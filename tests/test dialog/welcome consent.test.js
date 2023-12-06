/*
* Project Name: Minnie AI
* By: Obi Ekekezie
* Date Created: 12/3/2018
*/

const { generateResponseDialog } = require('./../../intents/welcome consent');

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

describe('welcome consent response dialog', () => {

    it('2 repetitions remaining', () => {
        const expectedResponse = {
            shouldHangUp: false,
            segue: null,
            dialog: 'GREETING_AND_CONSENT'
        }
        expect(mockApplicationState.repetitionsRemaining)
            .toEqual(2);
        expect(generateResponseDialog(mockApplicationState))
            .toEqual(expectedResponse);
    });

    it('1 repetition remaining', () => {
        --mockApplicationState.repetitionsRemaining;
        const expectedResponse = {
            shouldHangUp: false,
            segue: 'SEGUE_I_SAID',
            dialog: 'GREETING_AND_CONSENT'
        }
        expect(mockApplicationState.repetitionsRemaining)
            .toEqual(1);
        expect(generateResponseDialog(mockApplicationState))
            .toEqual(expectedResponse);
    });

    it('0 repetitions remaining', () => {
        --mockApplicationState.repetitionsRemaining;
        const expectedResponse = {
            shouldHangUp: false,
            segue: 'SEGUE_PLEASE_LISTEN_CAREFULLY',
            dialog: 'GREETING_AND_CONSENT'
        }
        expect(mockApplicationState.repetitionsRemaining)
            .toEqual(0);
        expect(generateResponseDialog(mockApplicationState))
            .toEqual(expectedResponse);
    });

});