var expect = require('chai').expect;
var cheerio = require('cheerio');
var processHelper = require('../../tasks/helpers/process');

describe('helpers/process', function () {
    'use strict';

    describe('produceFileContent()', function () {
        var fileMap;
        var file;
        var taskConfig;

        beforeEach(function () {
            taskConfig = {
                replacementElementTag: 'span',
                replacementElementClass: ''
            };
        });

        describe('when directive is used in simple elements', function () {
            beforeEach(function () {
                var tmpFile;
                var tmpFileList = [{
                    name: 'path/to/most-complex/file.html',
                    content: cheerio.load('<h1 ng-include="path/to/simplest/file.html"></h1>' +
                        '<ng-include src="path/to/simple/file.html"></ng-include>'),
                    contentReplacement: null,
                    dependencies: [{
                        element: null,
                        filename: 'path/to/simplest/file.html'
                    }, {
                        element: null,
                        filename: 'path/to/simple/file.html'
                    }],
                    outputPath: 'dist',
                    isReferenced: false
                }, {
                    name: 'path/to/simplest/file.html',
                    content: cheerio.load('Well just some text'),
                    contentReplacement: null,
                    dependencies: [],
                    outputPath: 'dist',
                    isReferenced: false
                }, {
                    name: 'path/to/simple/file.html',
                    content: cheerio.load('<div ng-include="path/to/simplest/file.html"></div>'),
                    contentReplacement: null,
                    dependencies: [{
                        element: null,
                        filename: 'path/to/simplest/file.html'
                    }],
                    outputPath: 'dist',
                    isReferenced: false
                }];
                var directiveSelector = 'ng-include, [ng-include]';

                tmpFile = tmpFileList[0];
                tmpFile.dependencies[0].element = tmpFile.content(directiveSelector)[0];
                tmpFile.dependencies[1].element = tmpFile.content(directiveSelector)[1];

                tmpFile = tmpFileList[2];
                tmpFile.dependencies[0].element = tmpFile.content(directiveSelector)[0];

                fileMap = {};
                tmpFileList.forEach(function (item) {
                    fileMap[item.name] = item;
                });
            });

            describe('and all referenced files exist', function () {
                describe('and file has multiple levels of replacement', function () {
                    beforeEach(function () {
                        file = fileMap['path/to/most-complex/file.html'];
                    });

                    it('should hierarchically add contents to file', function () {
                        var output = processHelper.file(file, fileMap, taskConfig);

                        expect(output)
                            .to.eql('<h1>Well just some text</h1><span><div>Well just some text</div></span>');
                    });
                });

                describe('and file has single level of replacement', function () {
                    beforeEach(function () {
                        file = fileMap['path/to/simple/file.html'];
                    });

                    it('should add contents of nested file', function () {
                        var output = processHelper.file(file, fileMap, taskConfig);

                        expect(output).to.eql('<div>Well just some text</div>');
                    });
                });

                describe('and file has no level of replacement', function () {
                    beforeEach(function () {
                        file = fileMap['path/to/simplest/file.html'];
                    });

                    it('should return file contents', function () {
                        var output = processHelper.file(file, fileMap, taskConfig);

                        expect(output).to.eql('Well just some text');
                    });
                });
            });

            describe('and referenced file does not exist', function () {
                describe('and file has multiple levels of replacement', function () {
                    beforeEach(function () {
                        file = fileMap['path/to/most-complex/file.html'];
                        delete fileMap['path/to/simple/file.html'];
                    });

                    it('should throw error', function () {
                        function fnCall() {
                            processHelper.file(file, fileMap, taskConfig);
                        }

                        expect(fnCall).to.throw('File "path/to/simple/file.html" not present in dictionary');
                    });
                });
            });

        });

        describe('when directive is used in elements with more attributes', function () {
            beforeEach(function () {
                var tmpFile;
                var tmpFileList = [{
                    name: 'path/to/attribute/file.html',
                    content: cheerio.load('<h1 class="header" ng-include="path/to/second/file.html"></h1>'),
                    contentReplacement: null,
                    dependencies: [{
                        element: null,
                        filename: 'path/to/second/file.html'
                    }],
                    outputPath: 'dist',
                    isReferenced: false
                }, {
                    name: 'path/to/second/file.html',
                    content: cheerio.load('Well just some text'),
                    contentReplacement: null,
                    dependencies: [],
                    outputPath: 'dist',
                    isReferenced: false
                }, {
                    name: 'path/to/element/file.html',
                    content: cheerio.load('<ng-include ng-if="1==1" src="path/to/second/file.html"></ng-include>'),
                    contentReplacement: null,
                    dependencies: [{
                        element: null,
                        filename: 'path/to/second/file.html'
                    }],
                    outputPath: 'dist',
                    isReferenced: false
                }, {
                    name: 'path/to/element/file-with-class.html',
                    content: cheerio.load('<ng-include class="some-style" ' +
                        'ng-if="1==1" src="path/to/second/file.html"></ng-include>'),
                    contentReplacement: null,
                    dependencies: [{
                        element: null,
                        filename: 'path/to/second/file.html'
                    }],
                    outputPath: 'dist',
                    isReferenced: false
                }];
                var directiveSelector = 'ng-include, [ng-include]';

                tmpFile = tmpFileList[0];
                tmpFile.dependencies[0].element = tmpFile.content(directiveSelector)[0];

                tmpFile = tmpFileList[2];
                tmpFile.dependencies[0].element = tmpFile.content(directiveSelector)[0];

                tmpFile = tmpFileList[3];
                tmpFile.dependencies[0].element = tmpFile.content(directiveSelector)[0];

                fileMap = {};
                tmpFileList.forEach(function (item) {
                    fileMap[item.name] = item;
                });
            });

            describe('and `ng-include` is an attribute', function () {
                beforeEach(function () {
                    file = fileMap['path/to/attribute/file.html'];
                });

                it('should make the replacement leaving the remaining attributes', function () {
                    var output = processHelper.file(file, fileMap, taskConfig);

                    expect(output).to.eql('<h1 class="header">Well just some text</h1>');
                });
            });

            describe('and `ng-include` is an element', function () {
                beforeEach(function () {
                    file = fileMap['path/to/element/file.html'];
                });

                it('should replace directive attribute by a `span` leaving the remaining attributes', function () {
                    var output = processHelper.file(file, fileMap, taskConfig);

                    expect(output).to.eql('<span ng-if="1==1">Well just some text</span>');
                });

                describe('and task options set replacement element tag', function () {
                    beforeEach(function () {
                        taskConfig.replacementElementTag = 'section';
                    });

                    it('should replace directive attribute by a `span` leaving the remaining attributes', function () {
                        var output = processHelper.file(file, fileMap, taskConfig);

                        expect(output).to.eql('<section ng-if="1==1">Well just some text</section>');
                    });
                });

                describe('and task options set replacement element class', function () {
                    beforeEach(function () {
                        taskConfig.replacementElementClass = 'replaced';
                    });

                    it('should replace directive attribute by a `span` leaving the remaining attributes', function () {
                        var output = processHelper.file(file, fileMap, taskConfig);

                        expect(output).to.eql('<span ng-if="1==1" class="replaced">Well just some text</span>');
                    });
                });

                describe('and task options set replacement element class with a class attribute', function () {
                    beforeEach(function () {
                        file = fileMap['path/to/element/file-with-class.html'];
                        taskConfig.replacementElementClass = 'replacement';
                    });

                    it('should replace directive attribute by a `span` leaving the remaining attributes', function () {
                        var output = processHelper.file(file, fileMap, taskConfig);

                        expect(output)
                            .to.eql('<span class="some-style replacement" ng-if="1==1">Well just some text</span>');
                    });
                });
            });
        });
    });
});
