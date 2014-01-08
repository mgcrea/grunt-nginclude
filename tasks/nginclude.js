/*
 * grunt-nginclude
 * https://github.com/mgcrea/grunt-nginclude
 *
 * Copyright (c) 2014 Olivier Louvignes
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  var chalk = require('chalk');
  var cheerio = require('cheerio');

  grunt.registerMultiTask('nginclude', 'Embed static ngIncludes.', function() {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      assetsDirs: [this.target]
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        return grunt.file.read(filepath);
      }).map(function(html) {
        var $ = cheerio.load(html);
        $('ng-include, [ng-include]').each(function(i, ng) {
          var $ng = $(ng);
          var src = $ng.attr('src') || $ng.attr('ng-include');
          if(!src.match(/^'.+'$/g)) {
            return;
          }
          var searchpath = options.assetsDirs.length > 1 ? '{' + options.assetsDirs.join(',') + '}' : options.assetsDirs[0];
          searchpath += '/' + src.substr(1, src.length - 2);
          var foundfiles = grunt.file.expand(searchpath);
          if(!foundfiles.length) {
            grunt.log.warn('Included file "' + searchpath + '" not found.');
            return;
          }
          var include = grunt.file.read(foundfiles[0]).trim();
          $ng.replaceWith('<!-- ngInclude: \'' + foundfiles[0] + '\' -->\n' + include);
        });
        return $.html();
      }).map(function(output) {
        grunt.file.write(f.dest, output);

        // Print a success message.
        grunt.log.writeln('File ' + chalk.cyan(f.dest) + ' created.');
      });

    });

  });

};
