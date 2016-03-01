module.exports = function (grunt) {
    'use strict';
    var path = require('path');

    grunt.registerTask('release', 'Release and publish new `grunt-nginclude` version', function (releaseType) {
        var RELEASE_TYPES = ['major', 'minor', 'patch'];

        if (!releaseType) {
            grunt.fail.fatal('Required release type as target (' + RELEASE_TYPES.join(', ') + ')');
        }

        if (RELEASE_TYPES.indexOf(releaseType) === -1) {
            grunt.fail.fatal('Unknown release type - use one allowed value (' + RELEASE_TYPES.join(', ') + ')');
        }

        grunt.task.run(['bump:' + releaseType, 'publish']);
    });

    require('load-grunt-config')(grunt, {
        configPath: [
            path.join(process.cwd(), 'grunt', 'config'),    // tasks configurations
            path.join(process.cwd(), 'grunt')               // tasks aliases
        ],
        init: true,
        loadGruntTasks: {
            pattern: 'grunt*'
        }
    });
};
