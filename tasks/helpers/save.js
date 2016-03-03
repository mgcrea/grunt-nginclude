var path = require('path');

function saveFile(grunt, file, taskConfig) {
    'use strict';
    var outputFile;

    if (!(file.outputPath && file.name && file.contentReplacement)) {
        throw new Error('`file` parameter hasn`t got all mandatory attributes');
    }

    // Do not save file when option `discardReferenced` is set to true and file is referenced
    if (taskConfig.discardReferenced && file.isReferenced) {
        return;
    }

    outputFile = path.resolve(file.outputPath, file.name);
    grunt.file.write(outputFile, file.contentReplacement);
}

module.exports = {
    file: saveFile
};
