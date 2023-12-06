/*
* Project Name: Minnie AI
* By: Obi Ekekezie
* Date Created: 7/30/2018
*/

const { 
    resetCounters,
    resetCurrentScore
 } = require('./../lib/state.js');

 const MONTHS = {
    '0': 'January',
    '1': 'February',
    '2': 'March',
    '3': 'April',
    '4': 'May',
    '5': 'June',
    '6': 'July',
    '7': 'August',
    '8': 'September',
    '9': 'October',
    '10': 'November',
    '11': 'December'
};

/**
    Parameters
    - "state"
    - "parameters" (optional)
    Returns 
    - "followupEventToTrigger"
    - "nextState"
*/
let updateApplicationState = (state, { month: attemptMonth }) => {
    if (!state) throw new Error(`Must provide state to update`);
    let nextState = Object.assign({}, state);
    // Reset score if first attempt
    if (state.shouldResetCurrentScore === true) {
        state = resetCurrentScore(state);
    }
    // Score user's attempt
    const score = _scoreResponse({ attemptMonth });
    // Follow up event is always the same in this case
    const followupEventToTrigger = 'MEMORY_REGISTRATION';
    // Update score
    nextState.currentScore = state.currentScore + score;
    // Segue independent of score
    nextState.segue = 'SEGUE_ORIENTATION_MONTH';
    // Reset counters
    nextState = resetCounters(nextState);
    return {
        followupEventToTrigger,
        nextState
    };
};

let _scoreResponse = ({ attemptMonth }) => {
    const actualMonth = MONTHS[new Date().getMonth()] || '';
    return String(attemptMonth).toLowerCase() === actualMonth.toLowerCase() ? 0 : 1;
};

module.exports = {
    updateApplicationState
};
