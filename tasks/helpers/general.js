module.exports = (function () {
    'use strict';

    function getFile(filename, fileMap) {
        var file;

        if (!Boolean(filename) || !Boolean(fileMap)) {
            throw new Error('`filename` and `fileMap` parameters are mandatory');
        }

        file = fileMap[filename];
        if (!file) {
            throw new Error('File "' + filename + '" not present in dictionary');
        }
        return file;
    }

    return {
        // Reference: https://docs.angularjs.org/guide/directive#normalization
        SUPPORTED_DIRECTIVES: ['ng-include', 'data-ng-include', 'x-ng-include'],
        FILEPATH_STRING_REGEX: /^('[^']+'|"[^"]+")$/g,
        getFile: getFile
    };
})();

