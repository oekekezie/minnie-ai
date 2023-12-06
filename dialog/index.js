/*
* Project Name: Minnie AI
* By: Obi Ekekezie
* Date Created: 11/11/2018
*/

const _fs = require('fs');

const DEFAULT_LANGUAGE = 'en-us';

let _selectRandomDialog = (dialog) => {
    if (!Array.isArray(dialog)) throw new Error(`Dialog must be an array to select phrase at random`);
    if (dialog.length === 1) return dialog[0];
    return dialog[Math.floor(Math.random()*items.length)]
};

let getLocalization = (lang = 'en-us', fs) => {
    if (!fs || typeof(fs.existsSync) !== 'function') fs = _fs;
    lang = String(lang).toLowerCase();
    if (fs.existsSync(`./dialog/lang/${lang}.js`)) {
        return Object.freeze(Object.assign({}, require(`./lang/${lang}.js`)));
    } else if (fs.existsSync(`./dialog/lang/${DEFAULT_LANGUAGE}.js`)) {
        return Object.freeze(Object.assign({}, require(`./lang/${DEFAULT_LANGUAGE}.js`)));
    } else {
        throw new Error ('No English localization found');
    }
};

let lookUp = (localization, key) => {
    let dialog = null;
    if (typeof key === 'string') {
        dialog = localization[key.toUpperCase()];
    } else if (typeof key === 'object') {
        dialog = key;
    } else {
        throw new Error(`Key should be either String or Object`);
    }
    if (dialog) {
        // Valid lookup key
        if (Array.isArray(dialog)) {
            return _selectRandomDialog(dialog);
        } else if (typeof(dialog) === 'string') {
            return dialog;
        } else if (typeof(dialog) === 'object') {
            const { key: templateKey, func, params = {} } = dialog;
            if (typeof func !== 'function') throw new Error(`Dialog is object; requires func|function`);
            return func(lookUp(localization, templateKey), params);
        } else {
            throw new Error(`Dialog for key ${key} should be either String or Array`);
        }
    } else {
        // Invalid lookup key
        throw new Error(`No dialog corresponding to key ${JSON.stringify(key)}`);
    }
};

module.exports = {
    getLocalization,
    lookUp
}