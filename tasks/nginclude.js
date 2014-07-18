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
      trim: true,
      assetsDirs: [this.target],
      cheerioOpts: {},
      prependAttrs: '',
      filterTags: '',
      attrs2Remove: [],
      useWrapComments: true
    });

    // Process some options to create others.
    options.baseSearchpath = options.assetsDirs.length > 1 ? '{' + options.assetsDirs.join(',') + '}' : options.assetsDirs[0];

    // This function receives an ng-include src and tries to read it from the filesystem.
    var readSource = function(src) {
      var searchpath = options.baseSearchpath + '/' + src;
      var foundfiles = grunt.file.expand(searchpath);
      if(!foundfiles.length) {
        grunt.log.warn('Included file "' + searchpath + '" not found.');
        return;
      }
      var include = grunt.file.read(foundfiles[0]);
      return include;
    };

    // Heavy lifting is done here. Parses ng-include tags and includes the source contents inside them.
    var processHtml = function(html) {

      var $ = cheerio.load(html, options.cheerioOpts);

      function processTag(i, ng) {
        var $ng = $(ng);
        var src = $ng.attr('src') || $ng.attr(options.prependAttrs + 'ng-include');
        if (!src.match(/^'[^']+'$/g)) return false;

        // Remove old ng-include attributes so Angular doesn't read them
        $ng.removeAttr('src').removeAttr(options.prependAttrs + 'ng-include');
        
        // Remove additional attributes specified by user in task options
        options.attrs2Remove.forEach(function(el) {
          $ng.removeAttr(el);
        });
        
        var before = "";
        var after = "";
        
        if (options.useWrapComments) {
          before = "\n<!-- ngInclude: " + src + " -->\n";
          after = "\n<!--/ngInclude: " + src + " -->\n";
        }
        
        var include = readSource(src.substr(1, src.length - 2));
        if(options.trim) include = include.trim();
        $ng.html(before + include + after);

        // If tag has an 'onload' handler, then add it to ng-init attribute
        if ($ng.attr('onload')) {
          $ng.attr(options.prependAttrs + 'ng-init',
              ($ng.attr(options.prependAttrs + 'ng-init') ? $ng.attr(options.prependAttrs + 'ng-init') + ';' : '') +
              $ng.attr('onload'))
            .removeAttr('onload');
        }

        return true;
      }

      // Use while to make the task recursive.
      while (true) {
        var tags = $('ng-include, ['+ options.prependAttrs + 'ng-include]');

        if (options.filterTags !== '') {
          tags = tags.filter(options.filterTags);
        }
        
        // If we don't find any more ng-include tags, we're done.
        if (tags.length === 0) {
          return $.html();
        }

        // For each tag, grab the associated source file and sub it in
        var results = [];
        /* jshint validthis:true*/
        tags.each(function() {
          results.push(processTag.apply(null, arguments));
        });

        // If we don't find any more suitable ng-include tags
        if(results.filter(Boolean).length === 0) {
          return $.html();
        }

      }
    };

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
