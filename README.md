# MooTools Core

[![Build Status](https://travis-ci.org/mootools/mootools-core.png?branch=master)](https://travis-ci.org/mootools/mootools-core)

This repository is for MooTools developers; not users.
All users should download MooTools from [MooTools.net](http://mootools.net/download "Download MooTools")

---
## Contribute

You are welcome to contribute to MooTools! What we ask of you:

 - If you find a bug: please file a issue here on GitHub. 

    Add a jsFiddle so we can see a example to the broken code.

 - If you have a __bug fix suggestion__: 

    Clone the repo, fix it on your computer and test it with the tools we provide under. If it works good, you are very welcome to do a PR on it. The better you document it the better for us. If you can make some Specs for it, so we can keep testing this in the future, even better.

 
__Do try to contibute__. This is a community project.


## Building & Testing

Current build process uses [Grunt](http://github.com/gruntjs), [Grunt MooTools Packager plugin](https://github.com/ibolmo/grunt-packager), and [Karma related repos](http://github.com/karma-runner/grunt-karma).

**By default**, the build process runs the tests (specs) relevant to the build. To build without testing see the `packager` build targets.

### Testing locally 

I you want to test your local repo you need just some small steps. Follow these in order:

    $ git clone https://github.com/mootools/mootools-core  # clone the MooTools repo
    $ cd mootools-core                                     # get into the directory
    $ npm install                                          # install de testing tools
    $ npm install grunt-cli -g                             # install the Grunt command line interface
    
    
Now you are ready to go!    
Run `grunt default` from the command line and the tester will open and run tests. 
You can also change which browser to call in the Gruntfile.js.     
__Note that__ _most browsers need to be closed when starting tests so Grunt-Karma opens and closes the browser. Otherwise they might not close on its own and fire a timeout error for inactivity._

Example:

	continuous: {
		browsers: ['PhantomJS', 'IE', 'Chrome', 'Firefox', 'Safari']
	},
	
If the log is too long, or if you want to store it in a file you can do:

    $ grunt > logs.txt   # This will create a new file called logs.txt in the local directory

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
You'll need to add a specific task to the Gruntfile. See [line 24](https://github.com/ibolmo/mootools-core/blob/1.4.6/Gruntfile.js#L24) for an example.

#### Browsers, Platforms, and More

This test suite is ready for Travis & SauceLabs.
You can also run locally.

Support:

 - IE
 - Firefox
 - Safari
 - Chrome
 - Opera
 - PhantomJS (virtual browser)

## More Information

[See the MooTools Wiki for more information](http://github.com/mootools/mootools-core/wikis)
