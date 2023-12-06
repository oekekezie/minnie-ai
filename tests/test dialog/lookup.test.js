/*
* Project Name: Minnie AI
* By: Obi Ekekezie
* Date Created: 11/8/2018
*/

const { getLocalization, lookUp } = require('./../../dialog');

describe('dialog', () => {

    // Setup
    const _trueEnglishLocalization = require('./../../dialog/lang/en-us.js');

    // Tests
    test('retrieve localization if valid language', () => {
        const localization = getLocalization('en');
        expect(Object.keys(localization))
            .toHaveLength(Object.keys(_trueEnglishLocalization).length);
        expect(Object.keys(localization))
            .toEqual(expect.arrayContaining(Object.keys(_trueEnglishLocalization)));
        expect(Object.keys(_trueEnglishLocalization))
            .toEqual(expect.arrayContaining(Object.keys(localization)));
    });

    test('defaults to English if no language specified', () => {
        const localization = getLocalization();
        expect(Object.keys(localization))
            .toHaveLength(Object.keys(_trueEnglishLocalization).length);
        expect(Object.keys(localization))
            .toEqual(expect.arrayContaining(Object.keys(_trueEnglishLocalization)));
        expect(Object.keys(_trueEnglishLocalization))
            .toEqual(expect.arrayContaining(Object.keys(localization)));
    });

    test('defaults to English if unsupported language specified', () => {
        const localization = getLocalization('unsupported language');
        expect(Object.keys(localization))
            .toHaveLength(Object.keys(_trueEnglishLocalization).length);
        expect(Object.keys(localization))
            .toEqual(expect.arrayContaining(Object.keys(_trueEnglishLocalization)));
        expect(Object.keys(_trueEnglishLocalization))
            .toEqual(expect.arrayContaining(Object.keys(localization)));
    });

    test('look up returns correct message', () => {
        const _trueMessage = _trueEnglishLocalization['_FOR_UNIT_TESTING_'][0];
        expect(lookUp(_trueEnglishLocalization, '_FOR_UNIT_TESTING_'))
            .toEqual(_trueMessage);
    });

    test('lookUp throws error if message does not exist', () => {
        expect(() => lookUp(_trueEnglishLocalization, 'THIS MESSAGE DOES NOT EXIST'))
            .toThrow('No dialog corresponding to key');
    });

});