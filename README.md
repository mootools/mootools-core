# MooTools Core

[![Build Status](https://travis-ci.org/mootools/mootools-core.png?branch=master)](https://travis-ci.org/mootools/mootools-core)

[![Selenium Test Status](https://saucelabs.com/browser-matrix/MooTools-Core.svg)](https://saucelabs.com/u/MooTools-Core)

---

This repository is for MooTools developers; not users.
All users should download MooTools from [MooTools.net](http://mootools.net/download "Download MooTools")

---
## Contribute

You are welcome to contribute to MooTools! What we ask of you:

a. __To report a bug:__

   1. Create a [jsFiddle](http://jsfiddle.net/) with the minimal amount of code to reproduce the bug.
   2. Create a [GitHub Issue](https://github.com/mootools/mootools-core/issues), and link to the jsFiddle.

b. __To fix a bug:__

   1. Clone the repo.
   2. Add a [spec](http://jasmine.github.io/1.3/introduction.html). ([example](http://jsfiddle.net/q7RgN/))
   3. Fix the bug.
   4. Build and run the specs.
   5. Push to your GitHub fork.
   6. Create Pull Request, and send Pull Request.


__Do try to contibute!__ This is a community project.


## Building & Testing

Current build process uses [Grunt](http://github.com/gruntjs), [Grunt MooTools Packager plugin](https://github.com/ibolmo/grunt-packager), and [Karma related repos](http://github.com/karma-runner/grunt-karma).

**By default**, the build process runs the tests (specs) relevant to the build. To build without testing see the `packager` build targets.

### Building MooTools _With_ Compatibility
This means `1.5.1` that is compatible with: `1.4.6`, `1.3.x`, `1.2.x`, and so on.

**Examples**

	grunt               # or
	grunt packager:all  # to only build the source

### Building MooTools _Without_ Compatibility
This means `1.5.1` **without** deprecated code in `1.4.6`, `1.3.x`, `1.2.x`, and so on.

``` js
'Proceed at your own risk'
See the changelog or the blog related to each version for migrating your code.
```

**Examples**

	grunt nocompat           # or
	grunt packager:nocompat  # to only build the source


### Advanced Building and Testing
See the [Gruntfile](https://github.com/mootools/mootools-core/blob/master/Gruntfile.js) and [MooTools packager](https://github.com/ibolmo/grunt-mootools-packager) for further options.

**Examples**

	# with compat
	grunt --file=Function    # builds all deps on Core/Function, builds all Specs on Specs/Core/Function, runs karma
	grunt --module=Class     # builds all deps on Class *folder*, builds all Specs on Specs/Class *folder*

	# without compat
	grunt nocompat --file=Function    # builds all deps on Core/Function, builds all Specs on Specs/Core/Function, runs karma
	grunt nocompat --module=Class     # builds all deps on Class *folder*, builds all Specs on Specs/Class *folder*

#### Removing Other Packager Blocks
You'll need to add a specific task to the Gruntfile. See [packager's documentation](https://github.com/ibolmo/grunt-mootools-packager) for more examples.

### Testing locally

I you want to test your local repo you need just some small steps. Follow these in order:

    $ git clone https://github.com/mootools/mootools-core  # clone the MooTools repo
    $ cd mootools-core                                     # get into the directory
    $ npm install                                          # install de testing tools
    $ npm install grunt-cli -g                             # install the Grunt command line interface
    $ grunt default                                        # run the specs!


You can also change which browser to call in the Gruntfile.js.
__Note that__ _most browsers need to be closed when starting tests so Grunt-Karma opens and closes the browser. Otherwise they might not close on its own and fire a timeout error for inactivity._

Example:

	continuous: {
		browsers: ['PhantomJS', 'IE', 'Chrome', 'Firefox', 'Safari']
	},

If the log is too long, or if you want to store it in a file you can do:

    $ grunt > logs.txt   # This will create a new file called logs.txt in the local directory

### Testing on Travis & Sauce Labs

Every new Build and Pull Request is now tested on [Travis](https://travis-ci.org/) and [Sauce Labs](https://saucelabs.com/). You can also open your own free account on [Travis](https://travis-ci.org/) and [Sauce Labs](https://saucelabs.com/) to test new code ideas there.

[Travis](https://travis-ci.org/) testing uses [PhantomJS](http://phantomjs.org/) which is a headless browser. When connected to [Sauce Labs](https://saucelabs.com/) then it is possible to choose any number of [different Browsers and Platforms](https://saucelabs.com/platforms). You will need in this case to change the login key so it will match your account.

To add new Browsers in [Sauce Labs](https://saucelabs.com/) testing you can do some changes in the __[Gruntfile.js](https://github.com/mootools/mootools-core/blob/master/Gruntfile.js)__:

 - add a new browser to the custom launchers already in the Gruntfile.

		customLaunchers: {
			chrome_linux: {
				base: 'SauceLabs',
				browserName: 'chrome',
				platform: 'linux'
			},


 - add the chosen browser to a task (max 3 browsers per task if you are using a free account):

		sauce2: {
			port: 9877,
			browsers: [
				'safari7',
				'safari6',
				'safari5_osx10_6'
			],

	These tasks can be chained so its possible to test more than 3 browsers on the same test. But not more than 3 parallel.

__Example of a task chain:__
(This will run [registered tasks](http://gruntjs.com/api/grunt.task)that have been defined in the steps described before.)

		grunt.registerTask('default:travis', [
			'clean',
			'packager:all',
			'packager:specs',
			'karma:sauce1',
			'karma:sauce2',
			'karma:sauce3',
			'karma:sauce4'
			// 'karma:sauce5',
			// 'karma:sauce6'
		])

#### Browsers, Platforms, and More

This test suite is ready for Travis & SauceLabs.
You can also run locally.

Support:

 - IE
 - Firefox
 - Safari
 - Chrome
 - Opera
 - PhantomJS (headless browser)

## More Information

[See the MooTools Wiki for more information](http://github.com/mootools/mootools-core/wikis)
