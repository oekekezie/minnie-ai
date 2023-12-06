
/*
* Project Name: Minnie AI
* By: Obi Ekekezie
* Date Created: 1/4/2019
*/

const MONTHS_NAMES = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
];

/**
    Return 
    - "responseDialog": { "dialog" (string or object), "shouldHangUp" (boolean) }
    - "listenForIntents" (array) 
*/
let generateResponseDialog = (state) => {
    if (!state) throw new Error(`Must provide state from which to generate response dialog`);
    let key = null;
    switch (state.repetitionsRemaining) {
        default:
            key = 'PROMPT_ATTENTION_MONTHS';
            break;
    }
    if (!key) throw new Error(`Failed to set message for response dialog`);
    const dialog = {
        key,
        func: (template, params) => {            
            const { startAt } = params;
            if (typeof startAt !== 'number') {
                throw new Error(`Missing parameter(s) to generate dialog from template. startAt = ${JSON.stringify(startAt)}`);
            }
            let output = template;
            output = output.replace('(START AT)', MONTHS_NAMES[startAt]);
            return output;
        },
        params: {
            startAt: state.attentionMonths.startAt
        }
    };    
    return ({ 
        responseDialog: {
            dialog,
            shouldHangUp: false
        },
        listenForIntents: ['ATTENTION_MONTHS_ATTEMPT']
    });
};

module.exports = {
    generateResponseDialog
};
