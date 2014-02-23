# MooTools Core

[![Build Status](https://travis-ci.org/mootools/mootools-core.png?branch=master)](https://travis-ci.org/mootools/mootools-core)

This repository is for MooTools developers; not users.
All users should download MooTools from [MooTools.net](http://mootools.net/download "Download MooTools")

## Building & Testing

Current build process uses [Grunt](http://github.com/gruntjs), [Grunt MooTools Packager plugin](https://github.com/ibolmo/grunt-packager), and [Karma related repos](http://github.com/karma-runner/grunt-karma).

**By default**, the build process runs the tests (specs) relevant to the build. To build without testing see the `packager` build targets.

### Building MooTools _With_ Compatibility
This means `1.4.6` that is compatible with: `1.3.x`, `1.2.x`, and so on. 

**Examples**

	grunt               # or
	grunt packager:all  # to only build the source

### Building MooTools _Without_ Compatibility
This means `1.4.6` **without** deprecated code in `1.3.x`, `1.2.x`, and so on.

``` js
'Proceed at your own risk'
See the changelog or the blog related to each version for migrating your code.
```

**Examples**

	grunt nocompat           # or
	grunt packager:nocompat  # to only build the source

### Advanced Building and Testing
See the [Gruntfile](https://github.com/ibolmo/mootools-core/blob/1.4.6/Gruntfile.js) for further options.

**Examples**
  
  # with compat
  grunt --file=Function    # builds all deps on Core/Function, builds all Specs on Specs/Core/Function, runs karma
  grunt --module=Class     # builds all deps on Class *folder*, builds all Specs on Specs/Class *folder*

	# without compat
	grunt nocompat --file=Function    # builds all deps on Core/Function, builds all Specs on Specs/Core/Function, runs karma
	grunt nocompat --module=Class     # builds all deps on Class *folder*, builds all Specs on Specs/Class *folder*

#### Removing Other Packager Blocks
You'll need to add a specific task to the Gruntfile. See [line 24](https://github.com/ibolmo/mootools-core/blob/1.4.6/Gruntfile.js#24] for an example.

#### Browsers, Platforms, and More
This is a todo. We'll support SauceLabs soon™ and browsers will be added in a specific build target soon™. 

## More Information

[See the MooTools Wiki for more information](http://github.com/mootools/mootools-core/wikis)
