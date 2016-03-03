[![Build Status](https://travis-ci.org/mgcrea/grunt-nginclude.svg?branch=master)](https://travis-ci.org/mgcrea/grunt-nginclude)
[![Coverage Status](https://coveralls.io/repos/github/mgcrea/grunt-nginclude/badge.svg?branch=master)](https://coveralls.io/github/mgcrea/grunt-nginclude?branch=master)
# grunt-nginclude

Grunt task for embedding AngularJS static `ng-include` elements.

## Getting Started
This plugin requires Grunt `~0.4.5`

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
      discardReferencedFiles: false,
      parserOptions: {
        decodeEntities: false
      },
      replacementElementClass: '',
      replacementElementTag: 'span'
    }
  },
});
```

### Options

#### options.discardReferencedFiles

Type: `Boolean`
Default value: `false`

Whether to discard referenced files on output or not.

Files that are explicitly referenced by `ng-include` directives are probably
not referenced from any other place and don't need to be present on the output
path neither on the template cache to be generated afterwards. To prevent
those files from being added to the output there is this option that will
discard referenced files when set to `true`.

#### options.parserOptions

Type: `Object`

Default value: `{}`

Enables parser options overrides.

For more information about available parser options check cheerio
[`loading`](https://github.com/cheeriojs/cheerio#loading) documentation or
directly the options available in the
[htmlparser2](https://github.com/fb55/htmlparser2/wiki/Parser-options) and
[domhandler](https://github.com/fb55/DomHandler).

#### options.replacementElementClass

Type: `String`
Default value: `''`

CSS class to add to the elements replacing `ng-include` element directives.

If, for some reason, there is the need to add a class to the replaced
`ng-include` element directive, it can be set with this configuration. This
gives a way of identifying the replacement element or of adding extra
styling to the new element.

By setting this option to `'nginclude-replaced'`, the following HTML
```html
<ng-include ng-if="showPartial" src="'partial.html'"></ng-include>
```
would turn to
```html
<span class="nginclude-replaced" ng-if="showPartial">partial contents</span>
```

#### options.replacementElementTag

Type: `String`
Default value: `'span'`

HTML tag used to replace `ng-include` element directives.

As `ng-include` element directives can't just be removed because there might
be some other attributes that need to be kept in order to be processed by
angular or the browser, these elements must be replaced by other ones that
have no special meaning for angular.

By setting this option to `'section'`, the following HTML
```html
<ng-include ng-if="showPartial" src="'partial.html'"></ng-include>
```
would turn to
```html
<section ng-if="showPartial">partial contents</section>
```

### Usage Examples

#### Default Options

```js
grunt.initConfig({
  nginclude: {
    options: {
      discardReferencedFiles: true
      parserOptions: {},
      replacementElementClass: 'nginclude-replaced',
      replacementElementTag: 'section'
    },
    your_target: {
      files: [{
        cwd: '<%= project.path.app %>'
        src: '**/*.html',
        dest: '<%= project.path.dist %>'
      }]
    },
  },
});
```