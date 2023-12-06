/*
* Project Name: Minnie AI
* By: Obi Ekekezie
* Date Created: 7/27/2018
*/

const STUDY_KEY = 'study';

const eventTypes = {
    ORIENTATION_YEAR: 'ORIENTATION_YEAR',
    ORIENTATION_YEAR_ATTEMPT: 'ORIENTATION_YEAR_ATTEMPT',
    ORIENTATION_MONTH: 'ORIENTATION_MONTH',
    ORIENTATION_MONTH_ATTEMPT: 'ORIENTATION_MONTH_ATTEMPT',
    MEMORY_REGISTRATION: 'MEMORY_REGISTRATION',
    MEMORY_REGISTRATION_ATTEMPT: 'MEMORY_REGISTRATION_ATTEMPT',
    ORIENTATION_TIME: 'ORIENTATION_TIME',
    ORIENTATION_TIME_ATTEMPT: 'ORIENTATION_TIME_ATTEMPT',
    ATTENTION_COUNT: 'ATTENTION_COUNT',
    ATTENTION_COUNT_ATTEMPT: 'ATTENTION_COUNT_ATTEMPT',
    ATTENTION_MONTHS: 'ATTENTION_MONTHS',
    ATTENTION_MONTHS_ATTEMPT: 'ATTENTION_MONTHS_ATTEMPT',
    MEMORY_RECALL: 'MEMORY_RECALL',
    MEMORY_RECALL_ATTEMPT: 'MEMORY_RECALL_ATTEMPT',
    CONCLUSION_ABNORMAL: 'CONCLUSION_ABNORMAL',
    CONCLUSION_NORMAL: 'CONCLUSION_NORMAL',
    DEFAULT_FALLBACK: 'DEFAULT_FALLBACK'
};

const NUMBER_OF_ATTEMPTS_FOR_QUESTION = {
    'on-QC': 3,
    'on-Q4': 2,
    'on-Q5': 2
};

let _correctContextName = ({ context, session }) => {
    if (!context.hasOwnProperty('name')) {
        throw new Error('Cannot correct context name without valid context.');
    }
    return context.name = context.name.startsWith(session) ? 
        context.name : `${session}/contexts/${context.name}`;
};

let addContextTo = (dialogflowRequest, context) => {
    const { outputContexts, session } = dialogflowRequest;
    // Correct context name
    if (Array.isArray(context)) {
        context = context.map((c) => {
            c.name = _correctContextName({ context: c, session });            
            return c;
        });
    } else {
        context.name = _correctContextName({ context, session });
    }
    // Update output contexts
    if (Array.isArray(outputContexts) && Array.isArray(context)) {
        return [...outputContexts, ...context];
    } else if (Array.isArray(outputContexts)) {
        return [...outputContexts, context];
    } else {
        // Default
        return Array.isArray(context) ? context : [context];
    }
};

let getContextFrom = (dialogflowRequest, contextName = '') => {
    const { session, queryResult: { outputContexts } } = dialogflowRequest;
    contextName = _correctContextName({ context: { name: contextName }, session });
    for (let context of outputContexts) {
        if (context.name.toLowerCase() === contextName.toLowerCase()) {
            return context;
        }
    }
    return null;
};

let cleanupContextFor = (outputContexts, contextName = '') => {
    return outputContexts.map((context) => { 
        if (context.name.endsWith(contextName)) {
            // Zero lifespan
            context.lifespanCount = 0;
        }
        return context;
    });
};

let updateStudy = (dialogflowRequest, currentQuestion = 'NA', update = {}, overwrite = false) => {
    let currentStudy = getContextFrom(dialogflowRequest, STUDY_KEY);
    if (currentStudy && currentStudy.hasOwnProperty('parameters')) {
        currentStudy.parameters[currentQuestion] = update;
    } else {
        throw new Error(`Unable to update study as no study context was found.`);
    }
    return currentStudy;
};

// Returns 'true' if study is normal
let scoreStudy = (currentStudy) => {
    let score = 0;
    const SCALE = {
        'on-Q1': 3,
        'on-Q2': 3,
        'on-Q3': 3,
        'on-Q4': 2,
        'on-Q5': 2,
        'on-Q6': 2
    };
    const THRESHHOLD = 9;
    const MODERATE_THRESHHOLD = 20;
    if (currentStudy && currentStudy.hasOwnProperty('parameters')) {
        for (let key in currentStudy.parameters) {
            if (currentStudy.parameters.hasOwnProperty(key)) {
                const element = currentStudy.parameters[key];
                // Check if element is score object
                if (element.hasOwnProperty('numErrors')) {
                    score = score + element.numErrors * SCALE[key];
                }
            }
        }
    } else {
        throw new Error(`Unable to score study as no study context was found.`);
    }
    // Mark end time
    currentStudy.endTime = new Date();
    return {
        isAbnormal: score >= THRESHHOLD,
        score,
        interpretation: score < THRESHHOLD ? 'normal' : 
            score < MODERATE_THRESHHOLD ? 'moderate' : 'severe',
        duration: (currentStudy.endTime - currentStudy.startTime) / 1000 // in seconds
    };
};

let generateRegistrationItems = () => {
    return {
        actualFirstName: 'John',
        actualLastName: 'Smith',
        actualStreetNumber: "42",
        actualStreetName: 'Market Street',
        actualCity: 'Chicago'
    };
}

let getNumberOfAttemptsFor = (question) => {
    if (NUMBER_OF_ATTEMPTS_FOR_QUESTION[String(question)] === undefined) {
        throw new Error(`No number of attempts assigned for question ${question}`);
        return 1;
    } else {
        return NUMBER_OF_ATTEMPTS_FOR_QUESTION[String(question)];
    }
};

module.exports = {
    eventTypes,
    addContextTo,
    getContextFrom,
    cleanupContextFor,
    generateRegistrationItems,
    getNumberOfAttemptsFor,
    updateStudy,
    scoreStudy,
    STUDY_KEY
};