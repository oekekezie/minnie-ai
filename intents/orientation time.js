/*
* Project Name: Minnie AI
* By: Obi Ekekezie
* Date Created: 1/3/2019
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
            dialog = 'PROMPT_ORIENTATION_TIME';
            break;
    }
    if (!dialog) throw new Error(`Error: Failed to set message for response dialog`);
    return ({ 
        responseDialog: {
            dialog,
            shouldHangUp: false
        },
        listenForIntents: ['ORIENTATION_TIME_ATTEMPT']
    });
};

module.exports = {
    generateResponseDialog
};
