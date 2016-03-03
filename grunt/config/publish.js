module.exports = (function () {
    'use strict';

    return {
        options: {
            ignore: ['node_modules', 'tests'],
            registry: 'https://registry.npmjs.org/',
            installBefore: true,
            forceInstall: true
        },
        src: ['./']
    };
})();
