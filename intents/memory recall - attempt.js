/*
* Project Name: Minnie AI
* By: Obi Ekekezie
* Date Created: 8/12/2018
*/

const { 
    resetCounters,
    resetCurrentScore
 } = require('./../lib/state.js');

/**
    Parameters
    - "state"
    - "parameters" (optional)
    Returns 
    - "followupEventToTrigger"
    - "nextState"
*/
let updateApplicationState = (state, { person: attemptPerson, streetNumber: attemptStreetNumber, 
    streetName: attemptStreetName, city: attemptCity }) => {
    // FIXME: Hack solution to @sys.person change
    const attemptFirstName = attemptPerson.name.split(' ')[0];
    const attemptLastName = attemptPerson.name.split(' ')[1];
    if (!state) throw new Error(`Must provide state to update`);
    let nextState = Object.assign({}, state);
    // Reset score if first attempt
    if (state.shouldResetCurrentScore === true) {
        state = resetCurrentScore(state);
    }
    // Score user's attempt
    const score = _scoreResponse({ attemptFirstName, attemptLastName, attemptStreetNumber, 
        attemptStreetName, attemptCity }, state.registrationItems);
    // Update score
    nextState.currentScore = state.currentScore + score;
    // Determine segue - always the same, proceed to conclusion
    const followupEventToTrigger = 'CONCLUSION';
    nextState.segue = 'SEGUE_MEMORY_RECALL';
    nextState = resetCounters(nextState);
    if (!followupEventToTrigger) new Error(`No follow up event to trigger specified`);
    return {
        followupEventToTrigger,
        nextState
    };
};

let _scoreResponse = ({ attemptFirstName = '', attemptLastName = '', attemptStreetNumber = '', 
    attemptStreetName  = '', attemptCity  = '' }, registrationItems) => {
    const {
        firstName: actualFirstName,
        lastName: actualLastName,
        streetNumber: actualStreetNumber,
        streetName: actualStreetName,
        city: actualCity
    } = registrationItems;    
    let score = 0;
    // Score first name
    score = attemptFirstName.toLowerCase() === actualFirstName.toLowerCase() ? score : score + 1;
    // Score last name
    score = attemptLastName.toLowerCase() === actualLastName.toLowerCase() ? score : score + 1;
    // Score street number
    score = Number(attemptStreetNumber) === Number(actualStreetNumber) ? score : score + 1;
    // FIXME: Score street name - should be more robust
    const actualComponents = actualStreetName.toLowerCase().split(' ');
    const attemptComponents = attemptStreetName.toLowerCase().split(' ');
    score = attemptComponents[0].toLowerCase() === actualComponents[0].toLowerCase() ? score : score + 1;
    // Score city
    score = attemptCity.toLowerCase() === actualCity.toLowerCase() ? score : score + 1;
    // Return score of 1 if any error made; otherwise return 0
    return score;
};

module.exports = {
    updateApplicationState
};
