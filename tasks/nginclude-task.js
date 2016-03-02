/*
 * Replace angular`s ng-include directives by the corresponding template.
 */
var objMerge = require('mout/object/merge');
var general = require('./helpers/general');
var load = require('./helpers/load');
var process = require('./helpers/process');
var save = require('./helpers/save');

module.exports = function (grunt) {
    'use strict';
    var DEFAULT_TASK_CONFIG = {
        discardReferencedFiles: false,
        parserOptions: {},
        replacementElementTag: 'span',
        replacementElementClass: ''
    };

    grunt.registerMultiTask(
        'nginclude',
        'Grunt task to replace Angular 1.x ng-include directives with static paths by the corresponding file content',
        function () {
            var fileMap;
            var taskConfig = objMerge(DEFAULT_TASK_CONFIG, this.data.options);

            function loadFiles(filesConfig) {
                var newFileMap = {};

                filesConfig.forEach(function (fileGroup) {
                    fileGroup.src.forEach(function (srcFile) {
                        newFileMap[srcFile] = load.file(grunt, fileGroup, srcFile, taskConfig);
                    });
                });

                return newFileMap;
            }

            function processFiles(loadedFileMap) {
                var filenames = Object.keys(loadedFileMap);

                filenames.forEach(function (filename) {
                    var file = general.getFile(filename, loadedFileMap);

                    process.file(file, loadedFileMap, taskConfig);
                });
                return loadedFileMap;
            }

            function saveFiles(processedFileMap) {
                var filenames = Object.keys(processedFileMap);

                filenames.forEach(function (filename) {
                    var file = general.getFile(filename, processedFileMap);

                    save.file(grunt, file, taskConfig);
                });
            }

            fileMap = loadFiles(this.files);
            processFiles(fileMap);
            saveFiles(fileMap);
        }
    );
};
