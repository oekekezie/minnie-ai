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
    if (state.fallbacksRemaining < 1) {
        dialog = 'NO_FALLBACKS_REMAINING';
    } else if (state.repetitionsRemaining < 1) {
        dialog = 'NO_REPETITIONS_REMAINING';
    } else {
        throw new Error(`Failed to set message for response dialog`);
    }
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
