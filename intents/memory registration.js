
/*
* Project Name: Minnie AI
* By: Obi Ekekezie
* Date Created: 12/12/2018
*/

/**
    Return 
    - "responseDialog": { "dialog" (string or object), "shouldHangUp" (boolean) }
    - "listenForIntents" (array) 
*/
let generateResponseDialog = (state) => {
    if (!state) throw new Error(`Must provide state from which to generate response dialog`);
    let key = null;
    switch (state.repetitionsRemaining) {
        case 2:
            key = 'PROMPT_MEMORY_REGISTRATION';
            break;
        case 1:
        case 0:
            key = 'REPROMPT_MEMORY_REGISTRATION'
            break;
        default:
            break;
    }
    if (!key) throw new Error(`Failed to set message for response dialog`);
    const dialog = {
        key,
        func: (template, params) => {            
            const { 
                actualFirstName, 
                actualLastName, 
                actualStreetNumber, 
                actualStreetName, 
                actualCity } = params;
            if (!actualFirstName || !actualLastName || !actualStreetNumber || !actualStreetName 
                || !actualCity) {
                throw new Error(`Missing parameter(s) to generate dialog from template`);
            }
            let output = template;
            output = output.replace('(FIRST NAME)', actualFirstName);
            output = output.replace('(LAST NAME)', actualLastName);
            output = output.replace('(STREET NUMBER)', actualStreetNumber);
            output = output.replace('(STREET NAME)', actualStreetName);
            output = output.replace('(CITY)', actualCity);
            return output;
        },
        params: {
            actualFirstName: state.registrationItems.firstName,
            actualLastName: state.registrationItems.lastName,
            actualStreetNumber: state.registrationItems.streetNumber,
            actualStreetName: state.registrationItems.streetName,
            actualCity: state.registrationItems.city
        }
    };    
    return ({ 
        responseDialog: {
            dialog,
            shouldHangUp: false
        },
        listenForIntents: ['MEMORY_REGISTRATION_ATTEMPT']
    });
};

module.exports = {
    generateResponseDialog
};
