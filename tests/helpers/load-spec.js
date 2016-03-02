var expect = require('chai').expect;
var sinon = require('sinon');
var loadHelper = require('../../tasks/helpers/load');

describe('helpers/load', function () {
    'use strict';

    describe('newFile()', function () {
        var grunt;
        var fileGroup;
        var fileName;
        var fileContent;
        var taskConfig;

        beforeEach(function () {
            grunt = {file: {read: sinon.stub()}};
            fileGroup = {
                dest: '/tmp',
                cwd: '/app'
            };
            fileName = 'path/to/file.html';

            taskConfig = {
                replacementElementTag: 'span',
                replacementElementClass: ''
            };
        });

        describe('when file has no `ng-include` directive', function () {
            beforeEach(function () {
                fileContent = '<div>no ng-include present in snippet</div>';
                grunt.file.read.returns(fileContent);
            });

            it('should return a file object with no dependencies', function () {
                var output = loadHelper.file(grunt, fileGroup, fileName, taskConfig);

                expect(output.dependencies.length).to.eql(0);
            });

            it('should return same file attributes as provided', function () {
                var output = loadHelper.file(grunt, fileGroup, fileName, taskConfig);

                expect(output.name).to.eql('path/to/file.html');
                expect(output.outputPath).to.eql('/tmp');
            });

            it('should return set file as not referenced', function () {
                var output = loadHelper.file(grunt, fileGroup, fileName, taskConfig);

                expect(output.isReferenced).to.be.false;
            });
        });

        describe('when file has a directive', function () {
            describe('with static file path', function () {
                describe('as a `ng-include` attribute', function () {
                    beforeEach(function () {
                        fileContent = '<div ng-include="\'path/to/other/file.html\'">with ng-include in snippet</div>';
                        grunt.file.read.returns(fileContent);
                    });

                    it('should return a file object with one dependency', function () {
                        var output = loadHelper.file(grunt, fileGroup, fileName, taskConfig);

                        expect(output.dependencies.length).to.eql(1);
                    });

                    it('should have a cheerio element in the dependency', function () {
                        var output = loadHelper.file(grunt, fileGroup, fileName, taskConfig);

                        expect(output.dependencies[0].element).to.include.keys(['attribs', 'parent', 'type']);
                    });

                    it('should have the filename specified in the file content in the dependency', function () {
                        var output = loadHelper.file(grunt, fileGroup, fileName, taskConfig);

                        expect(output.dependencies[0].filename).to.eql('path/to/other/file.html');
                    });
                });

                describe('as a `data-ng-include` attribute', function () {
                    beforeEach(function () {
                        fileContent = '<div data-ng-include="\'path/to/other/file.html\'">ng-include in snippet</div>';
                        grunt.file.read.returns(fileContent);
                    });

                    it('should return a file object with one dependency', function () {
                        var output = loadHelper.file(grunt, fileGroup, fileName, taskConfig);

                        expect(output.dependencies.length).to.eql(1);
                    });
                });

                describe('as a `x-ng-include` attribute', function () {
                    beforeEach(function () {
                        fileContent = '<div x-ng-include="\'path/to/other/file.html\'">ng-include in snippet</div>';
                        grunt.file.read.returns(fileContent);
                    });

                    it('should return a file object with one dependency', function () {
                        var output = loadHelper.file(grunt, fileGroup, fileName, taskConfig);

                        expect(output.dependencies.length).to.eql(1);
                    });
                });

                describe('as a `ng-include` element', function () {
                    beforeEach(function () {
                        fileContent = '<ng-include src="\'path/to/other/file.html\'">snippet</ng-include>>';
                        grunt.file.read.returns(fileContent);
                    });

                    it('should return a file object with one dependency', function () {
                        var output = loadHelper.file(grunt, fileGroup, fileName, taskConfig);

                        expect(output.dependencies.length).to.eql(1);
                    });
                });

                describe('as a `data-ng-include` element', function () {
                    beforeEach(function () {
                        fileContent = '<data-ng-include src="\'path/to/other/file.html\'">snippet</data-ng-include>';
                        grunt.file.read.returns(fileContent);
                    });

                    it('should return a file object with one dependency', function () {
                        var output = loadHelper.file(grunt, fileGroup, fileName, taskConfig);

                        expect(output.dependencies.length).to.eql(1);
                    });
                });

                describe('as a `x-ng-include` element', function () {
                    beforeEach(function () {
                        fileContent = '<x-ng-include src="\'path/to/other/file.html\'">with ng-include</x-ng-include>';
                        grunt.file.read.returns(fileContent);
                    });

                    it('should return a file object with one dependency', function () {
                        var output = loadHelper.file(grunt, fileGroup, fileName, taskConfig);

                        expect(output.dependencies.length).to.eql(1);
                    });
                });
            });

            describe('with no static file path', function () {
                describe('as a `ng-include` attribute', function () {
                    beforeEach(function () {
                        fileContent = '<div ng-include="a.variable">with ng-include in snippet</div>';
                        grunt.file.read.returns(fileContent);
                    });

                    it('should return a file object with one dependency', function () {
                        var output = loadHelper.file(grunt, fileGroup, fileName, taskConfig);

                        expect(output.dependencies.length).to.eql(0);
                    });
                });

                describe('as a `data-ng-include` attribute', function () {
                    beforeEach(function () {
                        fileContent = '<div data-ng-include="a.variable">with ng-include in snippet</div>';
                        grunt.file.read.returns(fileContent);
                    });

                    it('should return a file object with one dependency', function () {
                        var output = loadHelper.file(grunt, fileGroup, fileName, taskConfig);

                        expect(output.dependencies.length).to.eql(0);
                    });
                });

                describe('as a `x-ng-include` attribute', function () {
                    beforeEach(function () {
                        fileContent = '<div x-ng-include="a.variable">with ng-include in snippet</div>';
                        grunt.file.read.returns(fileContent);
                    });

                    it('should return a file object with one dependency', function () {
                        var output = loadHelper.file(grunt, fileGroup, fileName, taskConfig);

                        expect(output.dependencies.length).to.eql(0);
                    });
                });

                describe('as a `ng-include` element', function () {
                    beforeEach(function () {
                        fileContent = '<ng-include src="\'an\'+\'expression\'">with ng-include</ng-include>';
                        grunt.file.read.returns(fileContent);
                    });

                    it('should return a file object with one dependency', function () {
                        var output = loadHelper.file(grunt, fileGroup, fileName, taskConfig);

                        expect(output.dependencies.length).to.eql(0);
                    });
                });

                describe('as a `data-ng-include` element', function () {
                    beforeEach(function () {
                        fileContent = '<data-ng-include src="\'an\'+\'expression\'">snippet</data-ng-include>';
                        grunt.file.read.returns(fileContent);
                    });

                    it('should return a file object with one dependency', function () {
                        var output = loadHelper.file(grunt, fileGroup, fileName, taskConfig);

                        expect(output.dependencies.length).to.eql(0);
                    });
                });

                describe('as a `x-ng-include` element', function () {
                    beforeEach(function () {
                        fileContent = '<x-ng-include src="\'an\'+\'expression\'">with ng-include</x-ng-include>';
                        grunt.file.read.returns(fileContent);
                    });

                    it('should return a file object with one dependency', function () {
                        var output = loadHelper.file(grunt, fileGroup, fileName, taskConfig);

                        expect(output.dependencies.length).to.eql(0);
                    });
                });
            });
        });

        describe('when file has 3 directives with static file path', function () {
            describe('as attribute', function () {
                beforeEach(function () {
                    fileContent =
                        '<div ng-include="\'path/to/first/file.html\'">with ng-include in snippet</div>' +
                        '<div data-ng-include="\'path/to/second/file.html\'">with ng-include in snippet</div>' +
                        '<div x-ng-include="\'path/to/third/file.html\'">with ng-include in snippet</div>';
                    grunt.file.read.returns(fileContent);
                });

                it('should return a file object with three dependencies', function () {
                    var output = loadHelper.file(grunt, fileGroup, fileName, taskConfig);

                    expect(output.dependencies.length).to.eql(3);
                });

                it('should have a cheerio element in each dependency', function () {
                    var output = loadHelper.file(grunt, fileGroup, fileName, taskConfig);

                    expect(output.dependencies[0].element).to.include.keys(['attribs', 'parent', 'type']);
                    expect(output.dependencies[1].element).to.include.keys(['attribs', 'parent', 'type']);
                    expect(output.dependencies[2].element).to.include.keys(['attribs', 'parent', 'type']);
                });

                it('should have the filename specified in the file content in each dependency', function () {
                    var output = loadHelper.file(grunt, fileGroup, fileName, taskConfig);

                    expect(output.dependencies[0].filename).to.eql('path/to/first/file.html');
                    expect(output.dependencies[1].filename).to.eql('path/to/second/file.html');
                    expect(output.dependencies[2].filename).to.eql('path/to/third/file.html');
                });
            });

            describe('as attribute', function () {
                beforeEach(function () {
                    fileContent =
                        '<ng-include src="\'path/to/first/file.html\'">with ng-include in snippet</ng-include>' +
                        '<data-ng-include src="\'path/to/second/file.html\'">with ng-include</data-ng-include>' +
                        '<x-ng-include src="\'path/to/third/file.html\'">with ng-include in snippet</x-ng-include>';
                    grunt.file.read.returns(fileContent);
                });

                it('should return a file object with tree dependencies', function () {
                    var output = loadHelper.file(grunt, fileGroup, fileName, taskConfig);

                    expect(output.dependencies.length).to.eql(3);
                });
            });
        });

        describe('when file has invalid html', function () {

            beforeEach(function () {
                fileContent = '<div>some text in the file';
                grunt.file.read.returns(fileContent);
            });

            it('should return a file object with no dependencies', function () {
                var output = loadHelper.file(grunt, fileGroup, fileName, taskConfig);

                expect(output.dependencies.length).to.eql(0);
            });

            it('should return same file attributes as provided', function () {
                var output = loadHelper.file(grunt, fileGroup, fileName, taskConfig);

                expect(output.name).to.eql('path/to/file.html');
                expect(output.outputPath).to.eql('/tmp');
            });
        });
    });
});
