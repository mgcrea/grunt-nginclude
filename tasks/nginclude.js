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

    var processHtml = function(html){
      var $ = cheerio.load(html);

      // Use while to make the task recursive.
      while (true) {
        var tags = $('ng-include, [ng-include]');

        // If we don't find any more ng-include tags, we're done.
        if (tags.length == 0) {
          return $.html();
        }

        // For each tag, grab the associated source file and sub it in.
        tags.each(function(i, ng) {
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
      }
    }

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
        // Process the file's HTML source. 
        return processHtml(html);
      }).map(function(output) {
        grunt.file.write(f.dest, output);

        // Print a success message.
        grunt.log.writeln('File ' + chalk.cyan(f.dest) + ' created.');
      });

    });

  });

};
