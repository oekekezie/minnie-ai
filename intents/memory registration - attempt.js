/*
* Project Name: Minnie AI
* By: Obi Ekekezie
* Date Created: 7/31/2018
*/

const { 
    resetCounters,
    resetCurrentScore
 } = require('./../lib/state.js');

const SCORE_THRESHOLD = 3;

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
    // Determine segue
    let followupEventToTrigger = null;
    if (score === 0 || nextState.currentScore >= SCORE_THRESHOLD) {
        // Current attempt is correct or has failed to register within 3 attempts
        followupEventToTrigger = 'ORIENTATION_TIME';
        nextState.segue = 'SEGUE_MEMORY_REGISTRATION';
        nextState = resetCounters(nextState);
    } else if (score > 0) {
        // Current attempt is incorrect, attempt registration again
        followupEventToTrigger = 'MEMORY_REGISTRATION';
        nextState.segue = 'RETRY_MEMORY_REGISTRATION';
    }
    if (!followupEventToTrigger) new Error(`No follow up event to trigger specified`);
    return {
        followupEventToTrigger,
        nextState
    };
};

let _scoreResponse = ({ attemptFirstName, attemptLastName, attemptStreetNumber, 
    attemptStreetName, attemptCity }, registrationItems) => {
    const {
        firstName: actualFirstName,
        lastName: actualLastName,
        streetNumber: actualStreetNumber,
        streetName: actualStreetName,
        city: actualCity
    } = registrationItems;    
    let score = 0;
    console.log(`Scoring memory registration attempt...`)
    // Score first name
    score = attemptFirstName.toLowerCase() === actualFirstName.toLowerCase() ? score : score + 1;
    console.log(`Score = ${score}; ${attemptFirstName.toLowerCase()} vs. ${actualFirstName.toLowerCase()}`);
    // Score last name
    score = attemptLastName.toLowerCase() === actualLastName.toLowerCase() ? score : score + 1;
    console.log(`Score = ${score}; ${attemptLastName.toLowerCase()} vs. ${actualLastName.toLowerCase()}`);
    // Score street number
    score = Number(attemptStreetNumber) === Number(actualStreetNumber) ? score : score + 1;
    console.log(`Score = ${score}; ${Number(attemptStreetNumber)} vs. ${Number(actualStreetNumber)}`);
    // Score street name
    const attemptStreetNameSplit = attemptStreetName.split(' ')[0];
    score = attemptStreetNameSplit.toLowerCase() === actualStreetName.toLowerCase() ? score : score + 1;
    console.log(`Score = ${score}; ${attemptStreetNameSplit.toLowerCase()} vs. ${actualStreetName.toLowerCase()}`);
    // Score city
    score = attemptCity.toLowerCase() === actualCity.toLowerCase() ? score : score + 1;
    console.log(`Score = ${score}; ${attemptCity.toLowerCase()} vs. ${actualCity.toLowerCase()}`);
    // Return score of 1 if any error made; otherwise return 0
    return score ? 1 : 0;
};

module.exports = {
    updateApplicationState
};