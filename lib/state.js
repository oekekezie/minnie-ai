/*
* Project Name: Minnie AI
* By: Obi Ekekezie
* Date Created: 11/15/2018
*/

const _Context = require('./contexts');
const { hash: _hash } = require('./helpers');

const KEY_APPLICATION_STATE = 'application_state';
const LIFESPAN_APPLICATION_STATE = 999;
const INITIAL_APPLICATION_STATE = {
    enrolleeID: null,
    sessionID: null,
    startDate: null,
    registrationItems: {
        firstName: 'john',
        lastName: 'smith',
        streetNumber: '42',
        streetName: 'market',
        city: 'chicago'
    },
    attentionCount: {
        startAt: 20
    },
    attentionMonths: {
        startAt: 11
    },
    segue: null,
    currentScore: 0,
    shouldResetCurrentScore: true, // "true" at first; "false" after resetting score; reset to "true" with counters
    fallbacksRemaining: 2,
    repetitionsRemaining: 2,
    history: [] // [{ type, queryText, parameters, score, timestamp, fallbacksRemaining, repetitionsRemaining }]    
};

const ATTEMPT_EVENTS = [
    "ORIENTATION_YEAR_ATTEMPT",
    "ORIENTATION_MONTH_ATTEMPT",
    "MEMORY_REGISTRATION_ATTEMPT",
    "ORIENTATION_TIME_ATTEMPT",
    "ATTENTION_COUNT_ATTEMPT",
    "ATTENTION_MONTHS_ATTEMPT",
    "MEMORY_RECALL_ATTEMPT"
];

let getApplicationState = (dialogflowRequest) => {
    // Check if state exists
    if (_getApplicationStateFromContexts(dialogflowRequest)) {
        const state = _getApplicationStateFromContexts(dialogflowRequest).parameters;
        return state;
    } else {
        // Initialize if does not exist
        const state = Object.assign({}, INITIAL_APPLICATION_STATE);
        state.enrolleeID = _generateEnrolleeID(dialogflowRequest);
        state.startDate = new Date();
        state.sessionID = dialogflowRequest.session;
        return state;
    }
};

/**
 * Get application state from output contexts array
 * @param {Array} outputContexts 
 */
let getApplicationStateFromOutputContexts = (outputContexts = []) => {
    let state = null;
    for (let i = 0; i < outputContexts.length; i++) {
        const context = outputContexts[i];
        if (context.name.endsWith(KEY_APPLICATION_STATE)) {
            state = context.parameters;
            break;
        }
    }
    return state;
};

let addEventToApplicationStateHistory = (state, dialogflowRequest) => {
    if (!state || !Array.isArray(state.history) || !dialogflowRequest
    || !dialogflowRequest.queryResult || !dialogflowRequest.queryResult.intent) return null;
    const { 
        intent: { displayName: event },
        queryText,
        parameters: queryParameters
    } = dialogflowRequest.queryResult;
    const updatedHistory = state.history.concat([{ 
        event: event.trim().replace(/ - /g, '_').replace(/ /g, '_').toUpperCase(), 
        queryText: queryText || '<TRIGGERED EVENT>', 
        queryParameters,
        score: state.currentScore,
        fallbacksRemaining: state.fallbacksRemaining,
        repetitionsRemaining: state.repetitionsRemaining, 
        timestamp: new Date()
    }]);
    const newState = Object.assign(state, { history: updatedHistory });
    return newState;
};

let getPreviousEventFromApplicationState = (state, includeRepetitionsAndFallbacks = false) => {
    if (!state || !Array.isArray(state.history)) return null; 
    // Excludes attempts, repetitions, and fallbacks
    const filteredHistory = state.history.filter((record) => {
        let shouldInclude = true;
        // Exclude attempts
        if (ATTEMPT_EVENTS.includes(record.event)) {
            shouldInclude = false;
        }
        // Exclude repetitions and fallbacks
        if (record.event === 'REPEAT' || record.event === 'DEFAULT_FALLBACK') {
            shouldInclude = false;
        }
        // Include by default
        return shouldInclude;
    });
    // Determine previous event
    if (filteredHistory.length <= 0) return null;
    const previous = filteredHistory[filteredHistory.length - 1];
    return previous.event;
};

let getSegueFromApplicationState = (state) => {
    return state && typeof state.segue === 'string' ? state.segue : null;
};

let setSegueForApplicationState = (state, segue) => {
    const newState = Object.assign({}, state);
    newState.segue = segue;
    return newState;
};

let resetSegueForApplicationState = (state) => {
    const newState = Object.assign({}, state);
    newState.segue = null;
    return newState;
};

let resetCounters = (state) => {
    const newState = Object.assign({}, state);
    newState.fallbacksRemaining = 2;
    newState.repetitionsRemaining = 2;
    newState.shouldResetCurrentScore = true;
    return newState;
}

let resetCurrentScore = (state) => {
    const newState = Object.assign({}, state);
    if (newState.shouldResetCurrentScore === true) {        
        newState.currentScore = 0;
        newState.shouldResetCurrentScore = false;
    } else {
        throw new Error(`Cannot reset score if shouldResetCurrentScore = false`);
    }
    return newState;
};

/**
 * Returns a summary of the state i.e. score by domain
 * @param {object} state 
 */
let generateSummary = (state) => {    
    const summary = {};
    state.history.forEach((record) => {
        if (ATTEMPT_EVENTS.includes(record.event)) {
            summary[record.event]['score'] = Math.max(summary[record.event] || 0, record.score);
            summary[record.event]['said'] = record.queryText;
            summary[record.event]['heard'] = record.queryParameters;
        }
    });
    return summary;
};

let calculateScoreFromSummary = (summary) => {
    let totalScore = 0;
    for (const domain in object) {
        if (summary.hasOwnProperty(domain)) {
            const score = summary[domain];
            totalScore = totalScore + score;
        }
    }
};    

let _generateEnrolleeID = (dialogflowRequest, hash) => {
    if (typeof hash !== 'function') hash = _hash;
    const { originalDetectIntentRequest: { payload: { telephony: caller_id } } } = dialogflowRequest;
    return hash(caller_id);
};

let _getApplicationStateFromContexts = (dialogflowRequest, Context) => {
    if (!(Context instanceof _Context)) Context = _Context;
    const { queryResult: { outputContexts }, session } = dialogflowRequest;
    const contexts = new Context(outputContexts, session);
    return contexts.get(KEY_APPLICATION_STATE);
};

module.exports = {
    getApplicationState,
    getApplicationStateFromOutputContexts,
    addEventToApplicationStateHistory,
    getPreviousEventFromApplicationState,
    getSegueFromApplicationState,
    setSegueForApplicationState,
    resetSegueForApplicationState,
    resetCounters,
    resetCurrentScore,
    generateSummary,
    calculateScoreFromSummary,
    KEY_APPLICATION_STATE,
    LIFESPAN_APPLICATION_STATE
}
