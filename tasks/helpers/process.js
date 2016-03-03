module.exports = (function () {
    'use strict';
    var arrUnion = require('mout/array/union');
    var cheerio = require('cheerio');
    var general = require('./general');
    var DIRECTIVE_ATTRIBUTES = arrUnion(general.SUPPORTED_DIRECTIVES, ['src']);

    function isElementDirective(dependency) {
        return general.SUPPORTED_DIRECTIVES.indexOf(dependency.element.name) > -1;
    }

    function hasDependencies(file) {
        return file.dependencies.length > 0;
    }

    function clearDependencies(file) {
        file.dependencies.length = 0;
    }

    function buildOutput(file) {
        return (file.contentReplacement = file.content.html());
    }

    function buildReplacementElement($element, $, taskConfig) {
        var remainingAttributes = $element.attr();
        var newDocument = cheerio.load('<'+taskConfig.replacementElementTag+'></'+taskConfig.replacementElementTag+'>');
        var newElement = newDocument(taskConfig.replacementElementTag)[0];

        $element.replaceWith(newElement);
        $element = $(newElement);

        $element.attr(remainingAttributes);
        // Add class if set in options
        if (taskConfig.replacementElementClass.length > 0) {
            $element.addClass(taskConfig.replacementElementClass);
        }

        return $element;
    }

    function produceFileContent(file, fileMap, taskConfig) {
        // Content already produced
        if (file.contentReplacement) {
            return file.contentReplacement;
        }

        // No dependencies to resolve
        if (!hasDependencies(file)) {
            file.contentReplacement = file.content.html();
            return file.contentReplacement;
        }

        // Resolve dependencies
        file.dependencies.forEach(function (dependency) {
            var referencedFile = general.getFile([dependency.filename], fileMap);
            var dependencyContent = produceFileContent(referencedFile, fileMap);
            var $element = file.content(dependency.element);

            referencedFile.isReferenced = true;

            // Remove attribute directive
            DIRECTIVE_ATTRIBUTES.forEach(function (directive) {
                $element.removeAttr(directive);
            });

            // If directive is element copy remaining attributes to map (they will be added to the replacing element)
            if (isElementDirective(dependency)) {
                $element = buildReplacementElement($element, file.content, taskConfig);
            }

            // Nest content
            $element.append(dependencyContent);
        });

        // Clearing dependencies as they were already replaced in source
        clearDependencies(file);

        // Setting output
        return buildOutput(file);
    }

    return {
        file: produceFileContent
    };
})();
