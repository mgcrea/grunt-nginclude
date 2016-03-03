module.exports = (function () {
    'use strict';
    var MIN_COVERAGE = 90;
    var REPORTS_FOLDER = 'reports';
    var path = require('path');

    return {
        //recursive: true,
        unit: {
            src: 'tests',
            options: {
                reporter: 'spec',
                mask: '**/*.js',
                timeout: 5000,
                coverageFolder: path.join(REPORTS_FOLDER, 'coverage'),
                check: {
                    lines: MIN_COVERAGE,
                    statements: MIN_COVERAGE,
                    branches: MIN_COVERAGE,
                    functions: MIN_COVERAGE
                },
                reportFormats: ['html', 'lcov']
            }
        }
    };
})();

