/*
* Project Name: Minnie AI
* By: Obi Ekekezie
* Date Created: 11/16/2018
*/

/**
    Return 
    - "responseDialog": { "dialog" (string), "shouldHangUp" (boolean) }
    - "listenForIntents" (array) 
*/
let generateResponseDialog = (state) => {
    if (!state) throw new Error(`Must provide state from which to generate response dialog`);
    let dialog = null;
    switch (state.repetitionsRemaining) {
        default:
            dialog = 'GREETING_AND_CONSENT';
            break;
    }
    if (!dialog) throw new Error(`Failed to set message for response dialog`);
    return ({ 
        responseDialog: {
            dialog,
            shouldHangUp: false
        },
        listenForIntents: ['WELCOME_CONSENT_YES_NO']
    });
};

module.exports = {
    generateResponseDialog
};
