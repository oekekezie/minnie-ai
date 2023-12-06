
/*
* Project Name: Minnie AI
* By: Obi Ekekezie
* Date Created: 1/10/2019
*/

/**
    Return 
    - "responseDialog": { "dialog" (string), "shouldHangUp" (boolean) }
    - "listenForIntents" (array) 
*/
let generateResponseDialog = (state) => {
    if (!state) throw new Error(`Error: Must provide state from which to generate response dialog`);
    const dialog = 'GOODBYE';    
    if (!dialog) throw new Error(`Error: Failed to set message for response dialog`);
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
