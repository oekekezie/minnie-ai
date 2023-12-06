/*
* Project Name: Minnie AI
* By: Obi Ekekezie
* Date Created: 12/3/2018
*/

const { 
    getApplicationState,
    addEventToApplicationStateHistory,
    getUpdatedOutputContext
} = require('./../../lib/state.js');

const mockApplicationStateContext = {
    name: 'projects/<Project ID>/agent/sessions/<Session ID>/contexts/applicationState',
    lifespanCount: 999,
    parameters: {
        test: 'test parameter'
    }
};

const mockUpdatedApplicationStateContext = {
    name: 'projects/<Project ID>/agent/sessions/<Session ID>/contexts/applicationState',
    lifespanCount: 999,
    parameters: {
        test: 'updated test parameter',
        anotherTest: 'another test parameter'
    }
};

const mockDialogflowRequestWithState = {
    session: 'projects/<Project ID>/agent/sessions/test-session-with-state',
    queryResult: {
        outputContexts: [mockApplicationStateContext]
    },
    originalDetectIntentRequest: { payload: { telephony: 'caller_id' } }
};

const mockDialogflowRequestNoState = {
    session: 'projects/<Project ID>/agent/sessions/test-session-no-state',
    queryResult: {
        outputContexts: []
    },
    originalDetectIntentRequest: { payload: { telephony: 'caller_id' } }
};

const mockDialogflowRequestTriggeredEvent = {
    session: 'projects/<Project ID>/agent/sessions/test-session-triggered-event',
    queryResult: {
        queryText: undefined,
        outputContexts: [mockApplicationStateContext],
        parameters: {
            nextState: mockUpdatedApplicationStateContext.parameters
        }
    },
    originalDetectIntentRequest: { payload: { telephony: 'caller_id' } }
};

describe('state', () => {

    it('gets state from dialogflow request', () => {
        expect(getApplicationState(mockDialogflowRequestWithState).test)
            .toEqual(expect.stringContaining('test parameter'));
    });

    it('creates new state if none exists', () => {
        const expectedApplicationStateKeys = [
            'enrolleeID',
            'sessionID',
            'startDate',
            'registrationItems',
            'attentionCount',
            'attentionMonths',
            'fallbacksRemaining',
            'repetitionsRemaining',
            'currentScore',
            'history'
        ];
        expect(Object.keys(getApplicationState(mockDialogflowRequestNoState)))
            .toEqual(expect.arrayContaining(expectedApplicationStateKeys));
    });

    it('applies new state if it exists', () => {
        const expectedApplicationStateKeys = [
            'test',
            'anotherTest'
        ];
        const newState = getApplicationState(mockDialogflowRequestTriggeredEvent);
        expect(Object.keys(newState))
            .toEqual(expect.arrayContaining(expectedApplicationStateKeys));
        expect(newState.test).toEqual('updated test parameter');
    });

    // FIXME: Should be passing state and dialogflowRequest
    // FIXME: Should be checking that length of history increased by 1
    it('adds event to state history', () => {
        const state = getApplicationState(mockDialogflowRequestNoState);
        expect(addEventToApplicationStateHistory(state, 'test', 'query', { test: 'test parameter' }).history)
            .toHaveLength(1);
    });

    // TODO: Add test for getting previous event

    it('updates state', () => {
        const mockApplicationState = {
            test: 'new test parameter'
        };
        const updatedOutputContext = getUpdatedOutputContext(
            mockDialogflowRequestWithState, 
            mockApplicationState
        );
        expect(updatedOutputContext[0].parameters.test)
            .toEqual('new test parameter');
    });

});
