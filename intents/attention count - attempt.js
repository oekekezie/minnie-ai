/*
* Project Name: Minnie AI
* By: Obi Ekekezie
* Date Created: 8/3/2018
*/

const { 
    resetCounters,
    resetCurrentScore
 } = require('./../lib/state.js');

const SCORE_THRESHOLD = 2;
const EXPECTED_SEQUENCE = [
    20, 19, 18, 17, 16, 
    15, 14, 13, 12, 11, 
    10, 9, 8, 7, 6, 
    5, 4, 3, 2, 1
];

/**
    Parameters
    - "state"
    - "parameters" (optional)
    Returns 
    - "followupEventToTrigger"
    - "nextState"
*/
let updateApplicationState = (state, { sequence: attemptSequence }) => {
    if (!state) throw new Error(`Must provide state to update`);
    let nextState = Object.assign({}, state);
    let followupEventToTrigger = null;
    // Reset score if first attempt
    if (state.shouldResetCurrentScore === true) {
        state = resetCurrentScore(state);
    }
    // Check for empty sequence
    if (!Array.isArray(attemptSequence) || attemptSequence.length < 1) {
        // Empty sequence
        followupEventToTrigger = 'ATTENTION_COUNT';
        nextState.segue = 'MISINTERPRETED_ATTENTION_COUNT';
        // FIXME: Potential infinite loop
    } else {
        // Score user's attempt
        const score = _scoreResponse({ attemptSequence }, state.attentionCount.startAt);
        // Update score
        nextState.currentScore = state.currentScore + score;
        // Determine segue
        if ((nextState.currentScore < SCORE_THRESHOLD 
            && _isSequenceComplete({ attemptSequence }, state.attentionCount.startAt)) 
        || nextState.currentScore >= SCORE_THRESHOLD) {
            // Correct and complete or made more than 2 errors
            followupEventToTrigger = 'ATTENTION_MONTHS';
            nextState.segue = 'SEGUE_ATTENTION_COUNT';
            nextState = resetCounters(nextState);
        } else {
            // Correct/acceptable so far but incomplete
            followupEventToTrigger = 'ATTENTION_COUNT';
            nextState.segue = 'INTERRUPT_ATTENTION_COUNT';
            // Determine next starting point
            nextState.attentionCount.startAt = _determineNextStartAt(
                { attemptSequence }, 
                state.attentionCount.startAt
            );
        }
    }
    if (!followupEventToTrigger) new Error(`No follow up event to trigger specified`);
    return {
        followupEventToTrigger,
        nextState
    };
};

let _scoreResponse = ({ attemptSequence }, startAt) => {
    if (EXPECTED_SEQUENCE.indexOf(startAt) === -1) throw new Error(`Invalid startAt for sequence`);
    if (attemptSequence.length < 1) throw new Error(`Sequence cannot be empty`);
    const expectedSubset = EXPECTED_SEQUENCE.slice(EXPECTED_SEQUENCE.indexOf(startAt));
    const attemptSubset = attemptSequence.length > expectedSubset.length ? 
        attemptSequence.slice(0, expectedSubset.length) : attemptSequence;
    const score = attemptSubset.reduce((acc, cur, i) => {
        return cur === expectedSubset[i] ? acc : ++acc;
    }, 0);
    return score;
};

let _isSequenceComplete = ({ attemptSequence }, startAt) => {
    if (attemptSequence.length < 1) throw new Error(`Sequence cannot be empty`);
    return _determineNextStartAt({ attemptSequence }, startAt) === 
        EXPECTED_SEQUENCE[EXPECTED_SEQUENCE.length - 1] - 1;
};

// TODO: Unit testing
let _determineNextStartAt = ({ attemptSequence }, startAt) => {
    if (EXPECTED_SEQUENCE.indexOf(startAt) === -1) throw new Error(`Invalid startAt for sequence`);
    if (attemptSequence.length < 1) throw new Error(`Sequence cannot be empty`);
    const expectedSubset = EXPECTED_SEQUENCE.slice(EXPECTED_SEQUENCE.indexOf(startAt));
    const attemptSubset = attemptSequence.length > expectedSubset.length ? 
        attemptSequence.slice(0, expectedSubset.length) : attemptSequence;
    let nextStartAt = expectedSubset[attemptSubset.length - 1] - 1;
    for (let i = 0; i < attemptSubset.length; i++) {
        const val = attemptSubset[i];
        if (val !== expectedSubset[i]) {
            nextStartAt = expectedSubset[i];
            break;
        }
    }
    return nextStartAt;
};

module.exports = {
    updateApplicationState
};
