/*
* Project Name: Minnie AI
* By: Obi Ekekezie
* Date Created: 12/24/2018
*/

/**
    Return 
    - "responseDialog": { "dialog" (string), "shouldHangUp" (boolean) }
    - "listenForIntents" (array) 
*/
let generateResponseDialog = (state) => {
    if (!state) throw new Error(`Must provide state from which to generate response dialog`);
    let dialog = null;
    let shouldHangUp = false;
    switch (state.fallbacksRemaining) {
        case 2:
            dialog = 'FIRST_FALLBACK';
            break;
        case 1:
            dialog = 'SECOND_FALLBACK';
            break;
        default:
            throw new Error(`Could not determine segue given fallbacks remaining`);
    }
    if (!dialog) throw new Error(`Failed to set dialog for fallback`);
    return ({ 
        responseDialog: {
            dialog,
            shouldHangUp
        },
        listenForIntents: null
    });
};

module.exports = {
    generateResponseDialog
};
