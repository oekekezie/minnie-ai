/*
* Project Name: Minnie AI
* By: Obi Ekekezie
* Date Created: 7/22/2018
*/

const fs = require('fs');
const Context = require('./lib/contexts.js');
const { 
    getApplicationState,
    getApplicationStateFromOutputContexts,
    getSegueFromApplicationState,
    resetSegueForApplicationState,
    addEventToApplicationStateHistory,
    KEY_APPLICATION_STATE,
    LIFESPAN_APPLICATION_STATE
} = require('./lib/state.js');
const { getLocalization, lookUp } = require ('./dialog');

// Actions; may respond w/ followup event or message
const INTENT_ACTIONS = [
    'attention count - attempt',
    'attention months - attempt',
    // 'default fallback',
    'memory recall - attempt',
    'memory registration - attempt',
    'orientation month - attempt',
    'orientation time - attempt',
    'orientation year - attempt',
    // 'repeat',
    'welcome consent - yes'
];

// Dialog; may respond w/ message
const INTENT_DIALOG = [    
    'attention count',
    'attention months',
    'conclusion',
    'goodbye',
    'memory recall',
    'memory registration',
    'none remaining',
    'orientation month',
    'orientation time',
    'orientation year',
    'welcome consent',
    'welcome consent - no'
];

// Lifespan for intents to listen for
const LIFESPAN_LISTEN_FOR_INTENT = 10;

// Begin testing at intent
const BEGIN_TESTING_AT = 'MEMORY_RECALL'; // WELCOME_CONSENT

let dialogflowRequestHandler = (req, res) => {  
    // FIXME: Security  
    const { body: dialogflowRequest } = req;
    if (!dialogflowRequest.queryResult) {
        res.status(404).send('Oops!');
        return;
    }
    const { displayName: intentName } = dialogflowRequest.queryResult.intent;
    let fulfillmentResponse = null;
    if (typeof intentName === 'string' && fs.existsSync(`./intents/${intentName}.js`) 
    || intentName === '#testing#') {
        const requestType = _determineRequestType(intentName);
        // Handle response according to type
        switch (requestType) {
            case 'action':
                fulfillmentResponse = _handleActionRequest(dialogflowRequest);
                break;
            case 'dialog':
                fulfillmentResponse = _handleDialogRequest(dialogflowRequest);
                break;
            case 'fallback':
                if (_checkIfNoFallbacksRemaining(dialogflowRequest)) {
                    fulfillmentResponse = _handleNoneRemaining(dialogflowRequest);
                } else {                    
                    fulfillmentResponse = _handleFallbackRequest(dialogflowRequest);
                }
                break;
            case 'repeat':
                if (_checkIfNoRepetitionsRemaining(dialogflowRequest)) {
                    fulfillmentResponse = _handleNoneRemaining(dialogflowRequest);
                } else {
                    fulfillmentResponse = _handleActionRequest(dialogflowRequest);
                }
                break;
            case '#testing#':
                fulfillmentResponse = _handleTesting(dialogflowRequest);
                break;
            default:
                break;
        }
    }
    if (!fulfillmentResponse) {
        // Default to error response            
        console.log(`Error: No fulfillment response for intent ${JSON.stringify(intentName)}`);
        fulfillmentResponse = _composeDefaultErrorResponse(dialogflowRequest);
    }
    // Check whether call is ending
    if (fulfillmentResponse.endInteraction === true) {
        // Call is ending, so document
        const { persistAssessment } = require('./lib/persist.js');
        const state = getApplicationStateFromOutputContexts(fulfillmentResponse.outputContexts);
        console.log(`Debug: state before ending call = ${JSON.stringify(state)}`);
        persistAssessment(state.history)
        .then(() => {
            // Send JSON response
            res.status(200).json(fulfillmentResponse);
        })
        .catch((error) => {
            // Failed to document
            console.log(`Error: Failed to document: ${error}`);
            // Respond with failed to document message
            res.status(200).json(
                _composeFailedToDocumentResponse(
                    dialogflowRequest,
                    fulfillmentResponse.outputContexts
                )
            );
        });
    } else {        
        // Call is not ending so continue
        res.status(200).json(fulfillmentResponse);
    }
};

let _checkIfNoFallbacksRemaining = (dialogflowRequest) => {
    const state = getApplicationState(dialogflowRequest);
    return state.fallbacksRemaining < 1;
};

let _checkIfNoRepetitionsRemaining = (dialogflowRequest) => {
    const state = getApplicationState(dialogflowRequest);
    return state.repetitionsRemaining < 1;
};

/**
 * Determine type of intent invoked or triggered
 * @param {string} intentName 
 */
let _determineRequestType = (intentName) => {
    if (INTENT_ACTIONS.includes(intentName)) {
        return 'action';
    } else if (INTENT_DIALOG.includes(intentName)) {
        return 'dialog';
    } else if (intentName === 'default fallback') {
        return 'fallback';
    } else if (intentName === 'repeat') {
        return 'repeat';
    } else if (intentName === '#testing#') {
        return '#testing#';
    } else {
        throw new Error(`Intent ${JSON.stringify(intentName)} not categorized to a type`);
    }
};

/**
 * Returns fulfillment response for no fallbacks or repetitions remaining
 * @param {object} dialogflowRequest 
 */
let _handleNoneRemaining = (dialogflowRequest) => {
    // Generate fulfillment response
    const fulfillmentResponse = _composeFulfillmentResponse(
        null,
        [], 
        _createFollowupEventInput(
            'NONE_REMAINING', 
            {}, 
            dialogflowRequest.queryResult.languageCode
        ),
        false
    );
    return fulfillmentResponse;
};

/**
 * Returns fulfillment response for #testing#
 * @param {object} dialogflowRequest 
 */
let _handleTesting = (dialogflowRequest) => {
    // Generate fulfillment response
    const fulfillmentResponse = _composeFulfillmentResponse(
        null,
        [], 
        _createFollowupEventInput(
            BEGIN_TESTING_AT, 
            {}, 
            dialogflowRequest.queryResult.languageCode
        ),
        false
    );
    return fulfillmentResponse;
};

// Returns fulfillment response
let _handleFallbackRequest = (dialogflowRequest) => {
    // Get localization
    const localization = getLocalization(dialogflowRequest.queryResult.languageCode);
    // Get state
    const state = getApplicationState(dialogflowRequest);
    // Load handler
    const { displayName: intentName } = dialogflowRequest.queryResult.intent;
    const { generateResponseDialog } = require(`./intents/${intentName}.js`);
    // Get response dialog
    const { responseDialog } = generateResponseDialog(state);
    // Decrement fallbacks remaining
    --state.fallbacksRemaining;
    // Generate dialog
    const dialog = lookUp(localization, responseDialog.dialog);
    // Update state history
    const stateUpdatedHistory = addEventToApplicationStateHistory(state, dialogflowRequest);
    // Update output contexts (use Context class)
    const outputContexts = new Context(
        dialogflowRequest.queryResult.outputContexts,
        dialogflowRequest.session
    );
    // Update application state context
    outputContexts.set(KEY_APPLICATION_STATE, LIFESPAN_APPLICATION_STATE, stateUpdatedHistory);
    // Generate fulfillment response    
    const fulfillmentResponse = _composeFulfillmentResponse(
        dialog,
        outputContexts.getV2OutputContextsArray(), 
        null,
        responseDialog.shouldHangUp
    );
    return fulfillmentResponse;
};

// Returns fulfillment response
let _handleDialogRequest = (dialogflowRequest) => {
    // Get localization
    const localization = getLocalization(dialogflowRequest.queryResult.languageCode);
    // Get state
    const state = getApplicationState(dialogflowRequest);
    // Load handler
    const { displayName: intentName } = dialogflowRequest.queryResult.intent;
    const { generateResponseDialog } = require(`./intents/${intentName}.js`);
    // Get response dialog AND intents to listen for
    const { responseDialog, listenForIntents = [] } = generateResponseDialog(state);
    // Get segue
    const segue = getSegueFromApplicationState(state);
    const segueDialog = segue ? lookUp(localization, segue) : null;
    // Generate dialog
    const dialog = segueDialog ? `${segueDialog} ${lookUp(localization, responseDialog.dialog)}` :  
        lookUp(localization, responseDialog.dialog);
    // Reset state segue
    const stateResetSegue = resetSegueForApplicationState(state);
    // Update state history
    const stateUpdatedHistory = addEventToApplicationStateHistory(stateResetSegue, dialogflowRequest);
    // Update output contexts (use Context class)
    const outputContexts = new Context(
        dialogflowRequest.queryResult.outputContexts, 
        dialogflowRequest.session
    );
    // Update application state context
    outputContexts.set(KEY_APPLICATION_STATE, LIFESPAN_APPLICATION_STATE, stateUpdatedHistory);
    // Create contexts to listen for
    if (Array.isArray(listenForIntents)) {        
        listenForIntents.forEach((intentToListenFor) => {
            outputContexts.set(intentToListenFor.toLowerCase(), LIFESPAN_LISTEN_FOR_INTENT, {});
        });
    }
    // Remove all other contexts except application state and those to listen for
    // console.log(`Should listen for ${JSON.stringify(listenForIntents)}`);
    for (const context of outputContexts) {
        if (Array.isArray(listenForIntents) && !listenForIntents.includes(context.name.toUpperCase()) 
        && context.name.toLowerCase() !== KEY_APPLICATION_STATE) {
            // Delete since not application state or included in listen for
            context.lifespan = 0;
            // console.log(`- No longer going to listen for ${context.name}`);
        } else {
            // console.log(`- Will listen for ${context.name}`);
        }
    }
    // Generate fulfillment response    
    const fulfillmentResponse = _composeFulfillmentResponse(
        dialog,
        outputContexts.getV2OutputContextsArray(), 
        null,
        responseDialog.shouldHangUp
    );
    return fulfillmentResponse;
};

// Returns fulfillment response
let _handleActionRequest = (dialogflowRequest) => {
    // Get state
    const state = getApplicationState(dialogflowRequest);
    // Get parameters
    const parameters = dialogflowRequest.queryResult ? 
        dialogflowRequest.queryResult.parameters || {} : {};
    // Load handler
    const { displayName: intentName } = dialogflowRequest.queryResult.intent;
    const { updateApplicationState } = require(`./intents/${intentName}.js`);
    // Get followup event to trigger AND next state
    const { followupEventToTrigger, nextState } = updateApplicationState(state, parameters);
    // Update state history
    const stateUpdatedHistory = addEventToApplicationStateHistory(nextState, dialogflowRequest);
    // Update output contexts (use Context class)
    const outputContexts = new Context(
        dialogflowRequest.queryResult.outputContexts,
        dialogflowRequest.session
    );
    // Update application state context
    outputContexts.set(KEY_APPLICATION_STATE, LIFESPAN_APPLICATION_STATE, stateUpdatedHistory);
    // Generate fulfillment response
    const fulfillmentResponse = _composeFulfillmentResponse(
        null,
        outputContexts.getV2OutputContextsArray(), 
        _createFollowupEventInput(
            followupEventToTrigger,
            {},
            dialogflowRequest.queryResult.languageCode
        ),
        false
    );
    return fulfillmentResponse;
};

let _composeDefaultErrorResponse = (dialogflowRequest) => {
    const { outputContexts } = dialogflowRequest;
    const localization = getLocalization(dialogflowRequest.queryResult.languageCode);
    return _composeFulfillmentResponse(
        lookUp(localization, 'ERROR_NO_MATCHING_INTENT_HANDLER'),
        outputContexts,
        null,
        true
    );
};

let _composeFailedToDocumentResponse = (dialogflowRequest, outputContexts) => {
    const localization = getLocalization(dialogflowRequest.queryResult.languageCode);
    return _composeFulfillmentResponse(
        lookUp(localization, 'FAILED_TO_DOCUMENT'),
        outputContexts,
        null,
        true
    );
};

let _composeFulfillmentResponse = (message = '', outputContexts = [], followupEventInput, shouldHangUp = false) => {
    const response = {
        fulfillmentText: message,
        fulfillmentMessages: _synthesizeSpeechResponse(message),
        outputContexts,
        followupEventInput: followupEventInput ? followupEventInput : {},
        endInteraction: shouldHangUp
    };
    return response;
};

let _synthesizeSpeechResponse = (message = '') => {
    if (message === null) {
        return null;
    }
    if (typeof message !== 'string') {
        throw new Error('Message must be "string" to synthesize speech response');
    }
        const speechResponse = [
        {
            platform: 'TELEPHONY',
            telephonySynthesizeSpeech: {
                ssml: _generateSsml(message)
            }
        }
    ];
    return speechResponse;
};

let _createFollowupEventInput = (name, parameters, languageCode) => {
    const eventInput = {
        name,
        parameters: parameters || {},
        languageCode
    }
    return eventInput;
};

let _generateSsml = (message = '') => {
    if (typeof message !== 'string') {
        throw new Error('Message must be "string" to generate SSML');
    }
    return `<speak>${message}</speak>`;
};

module.exports = {
    dialogflowRequestHandler
};
