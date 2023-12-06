/*
* Project Name: Minnie AI
* By: Obi Ekekezie
* Date Created: 7/30/2018
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
let updateApplicationState = (state, { year: attemptYear }) => {
    if (!state) throw new Error(`Must provide state to update`);
    let nextState = Object.assign({}, state);
    // Reset score if first attempt
    if (state.shouldResetCurrentScore === true) {
        state = resetCurrentScore(state);
    }
    // Score user's attempt
    const score = _scoreResponse({ attemptYear });
    // Follow up event is always the same in this case
    const followupEventToTrigger = 'ORIENTATION_MONTH';
    // Update score
    nextState.currentScore = state.currentScore + score;
    // Segue independent of score
    nextState.segue = 'SEGUE_ORIENTATION_YEAR';
    // Reset counters
    nextState = resetCounters(nextState);
    return {
        followupEventToTrigger,
        nextState
    };
};

let _scoreResponse = ({ attemptYear }) => {
    const actualYear = new Date().getFullYear();    
    // Correct: 0, Incorrect: 1
    return Number(attemptYear) === Number(actualYear) ? 0 : 1;
};

module.exports = {
    updateApplicationState
};