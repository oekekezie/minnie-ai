/*
* Project Name: Minnie AI
* By: Obi Ekekezie
* Date Created: 7/28/2018
*/

const { 
    resetCounters
 } = require('./../lib/state.js');

/**
    Parameters
    - "state"
    - "parameters" (optional)
    Returns 
    - "followupEventToTrigger"
    - "nextState"
*/
let updateApplicationState = (state) => {
    let nextState = Object.assign({}, state);
    // Set segue
    nextState.segue = 'SEGUE_CONSENT_GIVEN';
    // Reset counters
    nextState = resetCounters(nextState);
    // Go to ORIENTATION_YEAR
    let result = {
        nextState,
        followupEventToTrigger: 'ORIENTATION_YEAR'
    };
    // Return result
    return result;
}

module.exports = {
    updateApplicationState
};
