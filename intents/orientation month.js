/*
* Project Name: Minnie AI
* By: Obi Ekekezie
* Date Created: 12/12/2018
*/

/**
    Return 
    - "responseDialog": { "dialog" (string), "shouldHangUp" (boolean) }
    - "listenForIntents" (array) 
*/
let generateResponseDialog = (state) => {
    if (!state) throw new Error(`Error: Must provide state from which to generate response dialog`);
    let dialog = null;
    switch (state.repetitionsRemaining) {
        default:
            dialog = 'PROMPT_ORIENTATION_MONTH';
            break;
    }
    if (!dialog) throw new Error(`Error: Failed to set message for response dialog`);
    return ({ 
        responseDialog: {
            dialog,
            shouldHangUp: false
        },
        listenForIntents: ['ORIENTATION_MONTH_ATTEMPT']
    });
};

module.exports = {
    generateResponseDialog
};
