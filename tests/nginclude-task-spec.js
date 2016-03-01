var expect = require('chai').expect;
var sinon = require('sinon');
var generalHelper = require('../tasks/helpers/general');
var loadHelper = require('../tasks/helpers/load');
var processHelper = require('../tasks/helpers/process');
var saveHelper = require('../tasks/helpers/save');

describe('nginclude-task', function () {
    'use strict';

    var grunt;
    var taskCallback;
    var task;

    beforeEach(function () {
        grunt = {
            registerMultiTask: function (name, desc, callback) {
                taskCallback = callback;
            }
        };
        sinon.spy(grunt, 'registerMultiTask');
        task = require('../tasks/nginclude-task');
    });

    describe('when task registers', function () {
        it('should call registerMultiTask', function () {
            task(grunt);

            expect(grunt.registerMultiTask.calledWithMatch(
                'nginclude',
                'Grunt task to replace Angular 1.x ng-include directives ' +
                'with static paths by the corresponding file content'
            )).to.be.true;
        });
    });

    describe('when task executes', function () {
        var config;
        var firstFile;
        var secondFile;

        beforeEach(function () {
            sinon.stub(generalHelper, 'getFile');
            sinon.stub(loadHelper, 'file');
            sinon.stub(processHelper, 'file');
            sinon.stub(saveHelper, 'file');

            task = require('../tasks/nginclude-task');
            config = {
                files: [{
                    src: [
                        'path/to/first/file.html',
                        'path/to/second/file.html'
                    ]
                }],
                data: {options: {discardReferenced: true}}
            };

            firstFile = {name: 'path/to/first/file.html'};
            secondFile = {name: 'path/to/second/file.html'};

            loadHelper.file.onFirstCall().returns(firstFile);
            loadHelper.file.onSecondCall().returns(secondFile);

            generalHelper.getFile.onCall(0).returns(firstFile);
            generalHelper.getFile.onCall(1).returns(secondFile);
            generalHelper.getFile.onCall(2).returns(firstFile);
            generalHelper.getFile.onCall(3).returns(secondFile);

            task(grunt);

            taskCallback.apply(config);
        });

        afterEach(function () {
            generalHelper.getFile.restore();
            loadHelper.file.restore();
            processHelper.file.restore();
            saveHelper.file.restore();
        });

        it('should load files from configured paths', function () {
            expect(loadHelper.file.calledTwice).to.be.true;
            expect(loadHelper.file.firstCall.calledWith(grunt, config.files[0], 'path/to/first/file.html')).to.be.true;
            expect(loadHelper.file.secondCall.calledWith(grunt, config.files[0], 'path/to/second/file.html'))
                .to.be.true;
        });

        it('should process loaded files', function () {
            expect(processHelper.file.calledTwice).to.be.true;
            expect(processHelper.file.firstCall.calledWithMatch(firstFile, config.data.options));
            expect(processHelper.file.secondCall.calledWithMatch(secondFile, config.data.options));
        });

        it('should save processed files', function () {
            expect(saveHelper.file.calledTwice).to.be.true;
            expect(saveHelper.file.firstCall.calledWith(grunt, firstFile, config.data.options));
            expect(saveHelper.file.secondCall.calledWith(grunt, secondFile, config.data.options));
        });
    });
});
