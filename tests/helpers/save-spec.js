var expect = require('chai').expect;
var sinon = require('sinon');
var path = require('path');
var saveHelper = require('../../tasks/helpers/save');

describe('helpers/save', function () {
    'use strict';
    var grunt;
    var file;
    var outputFile;
    var options;

    beforeEach(function () {
        outputFile = 'outputFilePath';
        sinon.stub(path, 'resolve').returns(outputFile);
        grunt = {file: {write: sinon.spy()}};
        file = {
            name: 'abcd',
            outputPath: 'xyz',
            isReferenced: false,
            contentReplacement: 'some thing'
        };
    });

    afterEach(function () {
        path.resolve.restore();
    });

    describe('saveFile()', function () {
        describe('when options specify not to discar referenced files', function () {
            beforeEach(function () {
                options = {discardReferenced: false};
            });

            describe('and file is referenced', function () {
                beforeEach(function () {
                    file.isReferenced = true;
                });

                it('should write file contents to output file', function () {
                    saveHelper.file(grunt, file, options);

                    expect(grunt.file.write.calledWith(outputFile, file.contentReplacement)).to.be.true;
                });
            });

            describe('and file is not referenced', function () {
                beforeEach(function () {
                    file.isReferenced = false;
                });

                it('should write file contents to output file', function () {
                    saveHelper.file(grunt, file, options);

                    expect(grunt.file.write.calledWith(outputFile, file.contentReplacement)).to.be.true;
                });
            });

            describe('and has not enough information', function () {
                it('should throw having a file with no output path', function () {
                    file.outputPath = null;

                    function fnCall() {
                        saveHelper.file(grunt, file, options);
                    }

                    expect(fnCall).to.throw('`file` parameter hasn`t got all mandatory attributes');
                    expect(grunt.file.write.called).to.be.false;
                });

                it('should throw having a file with no name', function () {
                    file.name = null;

                    function fnCall() {
                        saveHelper.file(grunt, file, options);
                    }

                    expect(fnCall).to.throw('`file` parameter hasn`t got all mandatory attributes');
                    expect(grunt.file.write.called).to.be.false;
                });

                it('should throw having a file with no content replacement', function () {
                    file.contentReplacement = null;

                    function fnCall() {
                        saveHelper.file(grunt, file, options);
                    }

                    expect(fnCall).to.throw('`file` parameter hasn`t got all mandatory attributes');
                    expect(grunt.file.write.called).to.be.false;
                });
            });
        });

        describe('when options specify to discard referenced files', function () {
            beforeEach(function () {
                options = {discardReferenced: true};
            });

            describe('and file is referenced', function () {
                beforeEach(function () {
                    file.isReferenced = true;
                });

                it('should not write file contents to output file', function () {
                    saveHelper.file(grunt, file, options);

                    expect(grunt.file.write.called).to.be.false;
                });
            });

            describe('and file is not referenced', function () {
                beforeEach(function () {
                    file.isReferenced = false;
                });

                it('should write file contents to output file', function () {
                    saveHelper.file(grunt, file, options);

                    expect(grunt.file.write.called).to.be.true;
                });
            });
        });
    });
});
