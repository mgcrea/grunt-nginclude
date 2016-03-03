module.exports = function () {
    'use strict';

    return {
        'default': ['check'],
        test: ['mocha_istanbul'],
        check: ['eslint', 'mocha_istanbul']
    }
};
