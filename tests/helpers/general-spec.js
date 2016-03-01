var expect = require('chai').expect;
var generalHelper = require('../../tasks/helpers/general');

describe('helpers/general', function () {
    'use strict';

    describe('getFile()', function () {
        describe('when fileMap is specified', function () {
            var fileMap;

            beforeEach(function () {
                fileMap = {a: {}, b: {prop: ''}};
            });

            describe('and an existing file is requested', function () {
                it('should return a mapped file', function () {
                    var output = generalHelper.getFile('b', fileMap);

                    expect(output).to.eql(fileMap.b);
                });
            });

            describe('and the requested file is not mapped', function () {
                it('should throw error', function () {
                    function fnCall() {
                        generalHelper.getFile('c', fileMap);
                    }
                    expect(fnCall).to.throw('File "c" not present in dictionary');
                });

                it('should throw error on missing key', function () {
                    function fnCall() {
                        generalHelper.getFile(null, fileMap);
                    }
                    expect(fnCall).to.throw('`filename` and `fileMap` parameters are mandatory');
                });
            });
        });

        describe('when fileMap is not specified', function () {
            describe('and a file is requested', function () {
                it('should throw error', function () {
                    function fnCall() {
                        generalHelper.getFile('a', null);
                    }
                    expect(fnCall).to.throw('`filename` and `fileMap` parameters are mandatory');
                });
            });
            describe('and file key is missing', function () {
                it('should throw error', function () {
                    function fnCall() {
                        generalHelper.getFile(null, null);
                    }
                    expect(fnCall).to.throw('`filename` and `fileMap` parameters are mandatory');
                });
            });
        });
    });
});
