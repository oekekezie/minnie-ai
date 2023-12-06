/*
* Project Name: Minnie AI
* By: Obi Ekekezie
* Date Created: 12/10/2018
*/

const { updateApplicationState } = require('./../../intents/repeat');

describe('repeat', () => {

    it('decrements repetitions remaining on update', () => {
        const mockApplicationState = {
            enrolleeID: null,
            sessionID: null,
            startDate: null,
            registrationItems: {
                firstName: 'john',
                lastName: 'smith',
                streetNumber: '42',
                streetName: 'market street',
                cityName: 'chicago'
            },
            fallbacksRemaining: 2,
            repetitionsRemaining: 2,
            currentScore: 0,
            history: [] // [{ type, queryText, parameters, score, timestamp, fallbacksRemaining, repetitionsRemaining }]
        };
        expect(updateApplicationState(mockApplicationState).nextState.repetitionsRemaining)
            .toEqual(1);
    });

    it('knows when repetitions remaining are depleted', () => {
        const mockApplicationState = {
            enrolleeID: null,
            sessionID: null,
            startDate: null,
            registrationItems: {
                firstName: 'john',
                lastName: 'smith',
                streetNumber: '42',
                streetName: 'market street',
                cityName: 'chicago'
            },
            fallbacksRemaining: 2,
            repetitionsRemaining: 0,
            currentScore: 0,
            history: [] // [{ type, queryText, parameters, score, timestamp, fallbacksRemaining, repetitionsRemaining }]
        };
        const expectedResponse = {
            segue: null,
            dialog: 'NO_REPETITIONS_REMAINING',
            shouldHangUp: true
        };
        expect(updateApplicationState(mockApplicationState).responseDialog)
            .toEqual(expectedResponse);
    });

});
