module.exports = (function () {
    'use strict';
    var general = require('./general');
    var cheerio = require('cheerio');
    var path = require('path');

    function getSupportedDirectivesAsSelector() {
        return general.SUPPORTED_DIRECTIVES.reduce(function (selector, currentDirective, index) {
            if (index === 1) {
                selector += ', [' + selector + ']';
            }
            return selector + ', ' + currentDirective + ', [' + currentDirective + ']';
        });
    }

    function getStaticPathFromDirectiveAttribute(element, document) {
        var $element = document(element);
        var attrValue = $element.attr('src');

        for (var i = 0; i < general.SUPPORTED_DIRECTIVES.length && attrValue === undefined; i += 1) {
            attrValue = $element.attr(general.SUPPORTED_DIRECTIVES[i]);
        }

        if (!attrValue.match(general.FILEPATH_STRING_REGEX)) {
            throw new Error('Attribute value is not a static file path');
        }

        return attrValue.substr(1, attrValue.length - 2);
    }

    function collectFileDependencies(file) {
        var dependencyList = [];
        var ngIncludeSelector = getSupportedDirectivesAsSelector();

        // Search for ng-include directives in file content and handle each one
        /*jslint unparam: true */
        file.content(ngIncludeSelector).each(function (index, element) {
            var dependency = {
                element: element,
                filename: null
            };

            try {
                dependency.filename = getStaticPathFromDirectiveAttribute(element, file.content);
                dependencyList.push(dependency);
            } catch (err) {
                // Ignore error and discard directive as new dependency
            }
        });
        /*jslint unparam: false */

        return dependencyList;
    }

    function newFile(grunt, fileGroup, fileName, taskOptions) {
        var file = {
            name: fileName,
            content: null,
            contentReplacement: null,
            dependencies: null,
            outputPath: fileGroup.dest,
            isReferenced: false
        };
        var filePath = fileGroup.cwd + path.sep + fileName;
        var fileContent = grunt.file.read(filePath, {encoding: 'utf8'});

        // Loads file content as a jQuery element for DOM manipulation purposes
        file.content = cheerio.load(fileContent, taskOptions.parserOptions);
        file.dependencies = collectFileDependencies(file);

        return file;
    }
    return {
        file: newFile
    };
})();
