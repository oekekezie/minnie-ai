/*
* Project Name: Minnie AI
* By: Obi Ekekezie
* Date Created: 12/31/2018
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
            dialog = 'CONSENT_DECLINED';
            break;
    }
    if (!dialog) throw new Error(`Failed to set message for response dialog`);
    return ({ 
        responseDialog: {
            dialog,
            shouldHangUp: true
        },
        listenForIntents: null
    });
};

module.exports = {
    generateResponseDialog
};
