/*
* Project Name: Minnie AI
* By: Obi Ekekezie
* Date Created: 8/1/2018
*/

const { 
    resetCounters,
    resetCurrentScore
} = require('./../lib/state.js');

const TIME_ERROR_MARGIN = 1; // hours

/**
    Parameters
    - "state"
    - "parameters" (optional)
    Returns 
    - "followupEventToTrigger"
    - "nextState"
*/
let updateApplicationState = (state, { estimatedTime: attemptTime }) => {
    if (!state) throw new Error(`Must provide state to update`);
    let nextState = Object.assign({}, state);
    // Reset score if first attempt
    if (state.shouldResetCurrentScore === true) {
        state = resetCurrentScore(state);
    }
    // Score user's attempt
    const score = _scoreResponse({ attemptTime });
    // Follow up event is always the same in this case
    const followupEventToTrigger = 'ATTENTION_COUNT';
    // Update score
    nextState.currentScore = state.currentScore + score;
    // Segue independent of score
    nextState.segue = 'SEGUE_ORIENTATION_TIME';
    // Reset counters
    nextState = resetCounters(nextState);
    return {
        followupEventToTrigger,
        nextState
    };
};

// TODO: Test correctness
let _scoreResponse = ({ attemptTime, _actualTime }) => {
    if (attemptTime instanceof Date === false) {
        console.log(`Debug: attemptTime = ${JSON.stringify(attemptTime)}`);
        attemptTime = new Date(attemptTime);
    }
    let actualHour = _actualTime ? _actualTime.getHours() + _actualTime.getTimezoneOffset() / 60 
        : new Date().getHours() + new Date().getTimezoneOffset() / 60;
    let estimatedHour = attemptTime.getHours() + attemptTime.getTimezoneOffset() / 60;
    if (actualHour > 23) {
      console.log(`Debug: original actualHour = ${actualHour}`);
      actualHour = actualHour - 24;
    }
    if (estimatedHour > 23) {
      console.log(`Debug: original estimatedHour = ${estimatedHour}`);
      estimatedHour = estimatedHour - 24;
    }
    console.log(`Debug: actualHour = ${actualHour}`);
    console.log(`Debug: estimatedHour = ${estimatedHour}`);
    return Math.abs(actualHour - estimatedHour) <= TIME_ERROR_MARGIN ? 0 : 1;
};

module.exports = {
    updateApplicationState
};
