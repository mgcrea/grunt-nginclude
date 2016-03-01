module.exports = (function () {
    'use strict';

    return {
        grunt: {
            options: {
                configFile: 'config/eslint-src.json'
            },
            src: ['Gruntfile.js']
        },
        source: {
            options: {
                configFile: 'config/eslint-src.json'
            },
            src: ['tasks/**/*.js']
        },
        tests: {
            options: {
                configFile: 'config/eslint-tests.json'
            },
            src: ['tests/**/*.js']
        }
    };
})();

