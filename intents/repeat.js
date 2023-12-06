/*
* Project Name: Minnie AI
* By: Obi Ekekezie
* Date Created: 12/3/2018
*/

const { 
    getPreviousEventFromApplicationState
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
    if (!state) throw new Error(`Must provide state to update`);
    const nextState = Object.assign({}, state);
    // Determine segue
    nextState.segue = _determineSegue(state);
    // Decrement repetitions
    --nextState.repetitionsRemaining;
    return {
        followupEventToTrigger: _determineFollowupEvent(state),
        nextState
    };
};

let _determineSegue = (state) => {
    let segue = null;
    switch (state.repetitionsRemaining) {
        case 2:
            segue = 'FIRST_REPETITION';
            break;
        case 1:
            segue = 'SECOND_REPETITION'
            break;
        default:            
            throw new Error('Could not determine segue given repetitions remaining');
    }
    if (!segue) {
        throw new Error('No segue determined for repetition');
    }
    return segue;
}

let _determineFollowupEvent = (state) => {
    const previous = getPreviousEventFromApplicationState(state);
    return previous || 'DEFAULT_FALLBACK';
};

module.exports = {
    updateApplicationState
};
