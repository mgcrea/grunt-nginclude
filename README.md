# grunt-nginclude [![Build Status](https://secure.travis-ci.org/mgcrea/grunt-nginclude.png?branch=master)](http://travis-ci.org/#!/mgcrea/grunt-nginclude)

> Grunt task for embedding AngularJS static ngInclude elements.

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-nginclude --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-nginclude');
```

## The "nginclude" task

### Overview
In your project's Gruntfile, add a section named `nginclude` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  nginclude: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.assetsDirs
Type: `Array`
Default value: `[this.target]`

Array of directories to look for included files.

#### options.cheerioOpts
Type: `Object`
Default value: `{}`

You can also pass an extra object to  cheerio plugin if you need to modify any of the default parsing options.  
For more details see [this](https://github.com/cheeriojs/cheerio#loading)

#### options.prependAttrs
Type: `String`
Default value: `''`

By default plugin search `<ng-include>` elements and elements with `ng-include` attribute.  
In case you use `ng-` attributes prepended by `data-` for html validation, then this option should look like this
```js
prependAttrs: 'data-'
```


#### options.filterTags
Type: `String`
Default value: `''`

Cheerio(jQuery) selector.  
Useful if you want to replace not all of `ng-include` directives.  
Example: `filterTags: '.replace-include'` or `filterTags: '[data-replace-include]'`, etc.


#### options.attrs2Remove
Type: `Array`
Default value: `[]`

A list of attributes to be removed from element with `ng-include` directive.  
Useful in combination with `filterTags` option


#### options.useWrapComments
Type: `Boolean`
Default value: `true`

By default plugin wraps each included block with comments about his path.  
If you don't want this set this to false.



### Usage Examples

#### Default Options

```js
grunt.initConfig({
  nginclude: {
    options: {
      assetsDirs: ['views']
    },
    your_target: {
      files: [{
        src: '<%= yeoman.src %>/index.html',
        dest: '<%= yeoman.dist %>/index.html'
      }]
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
