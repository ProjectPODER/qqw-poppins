//Code copied from Ghost https://raw.githubusercontent.com/TryGhost/Ghost/master/core/server/lib/common/i18n.js

const jp = require('jsonpath');
const isNil = require('lodash/isNil');
const fs = require('fs-extra');
const path = require('path');
const MessageFormat = require('intl-messageformat');
const isString = require('lodash/isString');
const isObject = require('lodash/isObject');
const isEqual = require('lodash/isEqual');
const merge = require('lodash/merge');
const get = require('lodash/get');

class I18n {
    constructor(locale) {
        if (!["es","en"].includes(locale)) {
            this._locale = this.defaultLocale();
            
            console.error("I18n constructor invalid",locale)
            //if an invalid locale is defined in the url, we return error
            //we could also return a page with the default locale, but that would create infinite URLs and **I GUESS** this could hurt SEO
            throw(new Error(`Invalid locale`))
        }
        else {
            this._locale = locale || this.defaultLocale();
        }
        this._strings = null;
    }

    /**
     * English is our default locale
     */
    defaultLocale() {
        return 'en';
    }

    supportedLocales() {
        return [this.defaultLocale(),this._locale];
    }

    /**
     * Exporting the current locale (e.g. "en") to make it available for other files as well,
     * such as core/frontend/helpers/date.js and core/frontend/helpers/lang.js
     */
    locale() {
        return this._locale;
    }

    /**
     * Helper method to find and compile the given data context with a proper string resource.
     *
     * @param {string} path Path with in the JSON language file to desired string (ie: "errors.init.jsNotBuilt")
     * @param {object} [bindings]
     * @returns {string}
     */
    t(path, bindings) {
        let string;
        let msg;
        try {
            string = this._findString(path);
        }
        catch (e) {
            throw(e);
        }

        // If the path returns an array (as in the case with anything that has multiple paragraphs such as emails), then
        // loop through them and return an array of translated/formatted strings. Otherwise, just return the normal
        // translated/formatted string.
        if (Array.isArray(string)) {
            msg = [];
            string.forEach(function (s) {
                msg.push(this._formatMessage(s, bindings));
            });
        } else {
            msg = this._formatMessage(string, bindings);
        }

        return msg;
    }

    /**
     * Setup i18n support:
     *  - Load proper language file into memory
     */
    init() {
        // This function is called during Ghost's initialization.
        // Reading translation file for messages from core .json files and keeping its content in memory
        // The English file is always loaded, until back-end translations are enabled in future versions.
        try {
            this._strings = this._readStringsFile(__dirname, '..', '.', 'translations', `${this.locale()}.json`);
        } catch (err) {
            this._strings = null;
            throw err;
        }

        this._initializeIntl();
    }

    /**
     * Check if a key exists in the loaded strings
     * @param {String} msgPath
     */
    doesTranslationKeyExist(msgPath) {
        const translation = this._findString(msgPath, {log: false});
        return translation !== this._fallbackError();
    }

    /**
     * Do the lookup with JSON path
     *
     * @param {String} msgPath
     */
    _getCandidateString(msgPath) {
        // Backend messages use dot-notation, and the '$.' prefix is added here
        // While bracket-notation allows any Unicode characters in keys for themes,
        // dot-notation allows only word characters in keys for backend messages
        // (that is \w or [A-Za-z0-9_] in RegExp)
        let path = `$["${msgPath}"]`;
        return jp.value(this._strings, path);
    }

    /**
     * Parse JSON file for matching locale, returns string giving path.
     *
     * @param {string} msgPath Path with in the JSON language file to desired string (ie: "errors.init.jsNotBuilt")
     * @returns {string}
     */
    _findString(msgPath, opts) {
        const options = merge({log: true}, opts || {});
        let candidateString;
        let matchingString;

        // no path? no string
        if (msgPath.length === 0 || !isString(msgPath)) {
            console.log('i18n.t() - received an empty path.');
            return '';
        }

        // If not in memory, load translations for core
        if (isNil(this._strings)) {
            try {
                this.init();
            } catch (e) {
                console.error("i18n _findStrings",e);
                throw(new Error("Invalid language"));
            }
        }
        candidateString = this._getCandidateString(msgPath);

        matchingString = candidateString || {};

        if (isObject(matchingString) || isEqual(matchingString, {})) {
            if (options.log) {
                // console.error(`i18n error: path was not found for locale: ${this.locale()}. "${msgPath}",`);
                return msgPath;
            }

            matchingString = this._fallbackError();
        }

        return matchingString;
    }

    /**
     * Resolve filepath, read file, and attempt a parse
     * Error handling to be done by consumer
     *
     * @param  {...String} pathParts
     */
    _readStringsFile(...pathParts) {
        try {

            const content = fs.readFileSync(path.join(...pathParts));
            return JSON.parse(content);
        }
        catch (e) {
            console.error("i18n _readStringsFile",e);
            throw(e);
        }
    }

    /**
     * Format the string using the correct locale and applying any bindings
     * @param {String} string
     * @param {Object} bindings
     */
    _formatMessage(string, bindings) {
        let currentLocale = this.locale();
        let msg = new MessageFormat(string, currentLocale);

        try {
            msg = msg.format(bindings);
        } catch (err) {
            console.error(err.message);

            // fallback
            msg = new MessageFormat(this._fallbackError(), currentLocale);
            msg = msg.format();
        }

        return msg;
    }

    /**
     * [Private] Setup i18n support:
     *  - Polyfill node.js if it does not have Intl support or support for a particular locale
     */
    _initializeIntl() {
        let hasBuiltInLocaleData;
        let IntlPolyfill;

        if (global.Intl) {
            // Determine if the built-in `Intl` has the locale data we need.
            hasBuiltInLocaleData = this.supportedLocales().every(function (locale) {
                return Intl.NumberFormat.supportedLocalesOf(locale)[0] === locale &&
                    Intl.DateTimeFormat.supportedLocalesOf(locale)[0] === locale;
            });
            if (!hasBuiltInLocaleData) {
                // `Intl` exists, but it doesn't have the data we need, so load the
                // polyfill and replace the constructors with need with the polyfill's.
                IntlPolyfill = require('intl');
                Intl.NumberFormat = IntlPolyfill.NumberFormat;
                Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
            }
        } else {
            // No `Intl`, so use and load the polyfill.
            global.Intl = require('intl');
        }
    }

    /**
     * A really basic error for if everything goes wrong
     */
    _fallbackError() {
        return get(this._strings, 'errors.errors.anErrorOccurred', 'An error occurred in i18n');
    }
}

module.exports = I18n;
