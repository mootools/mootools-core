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
   2. Add a [spec](https://github.com/Automattic/expect.js#api).
   3. Fix the bug.
   4. Build and run the specs.
   5. Push to your GitHub fork.
   6. Create Pull Request, and send Pull Request.


__Do try to contribute!__ This is a community project.


## Building & Testing

Current build process uses [Grunt](http://github.com/gruntjs), [Grunt MooTools Packager plugin](https://github.com/ibolmo/grunt-packager), and [Karma related repos](http://github.com/karma-runner/grunt-karma).

**By default**, the build process runs the tests (specs) relevant to the build. To build without testing see the `packager` build targets.

### Building MooTools _With_ Compatibility
This means `1.5.1` that is compatible with: `1.4.6`, `1.3.x`, `1.2.x`, and so on.

**Examples**

	grunt compat             # or
	grunt packager:compat    # to only build the source

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
	grunt compat --file=Function    # builds with only Core/Function and dependencies, then tests against specs in Specs/Core/Function
	grunt compat --module=Class     # tests against all specs in the Specs/Class *folder* (use --file to limit the build)

	# without compat
	grunt nocompat --file=Function  # builds with only Core/Function and dependencies, then tests against specs in Specs/Core/Function
	grunt nocompat --module=Class   # tests against all specs in the Specs/Class *folder* (use --file to limit the build)

#### Removing Other Packager Blocks
You'll need to add a specific task to the Gruntfile. See [packager's documentation](https://github.com/ibolmo/grunt-mootools-packager) for more examples.

### Testing locally

I you want to test your local repo you need just some small steps. Follow these in order:

    $ git clone https://github.com/mootools/mootools-core  # clone the MooTools repo
    $ cd mootools-core                                     # get into the directory
    $ npm install                                          # install de testing tools
    $ `npm bin`/grunt test                                 # run the specs!


To test a build in a local browser, you can run the `:dev` target of that build to start a test server at `http://localhost:9876/` and point your browser to it. When you're done testing, pressing `Ctrl+c` in the window running the grunt process should stop the server.

Example:

	$ `npm bin`/grunt compat:dev

If the log is too long, or if you want to store it in a file you can do:

    $ grunt > logs.txt   # This will create a new file called logs.txt in the local directory

### Testing on Travis & Sauce Labs

Every new Build and Pull Request is now tested on [Travis](https://travis-ci.org/) and [Sauce Labs](https://saucelabs.com/). You can also open your own free account on [Travis](https://travis-ci.org/) and [Sauce Labs](https://saucelabs.com/) to test new code ideas there.

[Travis](https://travis-ci.org/) testing uses [PhantomJS](http://phantomjs.org/) which is a headless browser. When connected to [Sauce Labs](https://saucelabs.com/) then it is possible to choose any number of [different Browsers and Platforms](https://saucelabs.com/platforms). You will need in this case to change the login key so it will match your account.

To add new Browsers in [Sauce Labs](https://saucelabs.com/) testing you can make changes to __[Grunt/options/browsers.json](Grunt/options/browsers.json)__:

 - add a new browser to the custom launchers already in the Gruntfile.

		...
		chrome: {
			base: 'SauceLabs',
			platform: 'Linux',
			browserName: 'chrome',
		},
		...


 - add the chosen browser, with the correct builds to .travis.yml:

		env:
			matrix:
				- BUILD='compat'     BROWSER='chrome'

#### Browsers, Platforms, and More

This test suite is ready for Travis & SauceLabs.
You can also run locally.

Support:

 - IE
 - Edge
 - Firefox
 - Safari
 - Chrome
 - Opera
 - PhantomJS (headless browser)

## More Information

[See the MooTools Wiki for more information](http://github.com/mootools/mootools-core/wikis)
