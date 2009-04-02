The MooTools Unit Test Framework
================================

### Author & Contact

Aaron Newton (aaron [ at ] iminta &lt;dot&gt; com)

### Download

This framework can be downloaded from Google's svn servers:

[http://code.google.com/p/clientside-test-framework][]

Overview
--------

### Purpose

MooTools ships with a version of JSSpec ([http://jania.pe.kr/aw/moin.cgi/JSSpec][]) and a series of Specs tests. This test framework is excellent at verifying that code that immediately produces an output is working. It can test, for example, that 2+2 does equal 4.

It is not, however, very good at evaluating any type of code that has a delay between the execution of a code block and the production of a result. This includes Ajax requests, animations and other transitions, or interfaces that require a user to interact with the test (such as Drag).

### The Unit Test Framework

The MooTools Unit Test Framework aims to create an environment where developers can utilize test driven development patterns to develop their code as well as use those tests to regress their changes. Tests are easy to write and easy to verify by non-coders. Users are given a simple task ("Drag the box around") and a question to answer ("Can you drag it around?"). Answering yes marks the test as having passed. Answering no marks it as having failed.


### Environment

The test framework itself is written with MooTools 1.2, but it can test any javascript code. It creates a "vanilla" iframe with only three javascript values defined: *dbug*, *$exec*, and *$LoadScript* (more on these in a bit).

When a test is loaded, the dependencies for that test are loaded into the iframe synchronously along with the HTML portion of the test. This allows the developer to do several things:

 * Test the dependency map of their code base. This uses the MooTools scripts.json to map dependencies; more than one scripts.json can be used (so long as the file names are all unique - so only one "Core.js" please).
 * Test only the code needed to run the test. Rather than including a full build of all their code, they can include on the parts that, in theory, are needed to run the test.
 * Quickly introduce changes and test again. Developers can edit their source files and run the test again without reloading their browsers.

### Running Tests

The framework comes with a Firebug-like interface (Moobugger) for testing with browsers that are not equipped with with Firebug. Tests produce output into the debugger to show the user that test are loading and are ready. Additionally, tests themselves can send output directly to the debugger for the user to inspect.

### User Entry

The test framework allows for users to run their own code in the iframe via a text area under the test frame. This facilitates debugging the current test environment. The author of individual tests can also choose to expose a portion of or all of an individual test as editable code that the user can alter at test time.

Authoring Tests
---------------

### tests.json

The test framework loads a menu of available tests based on a file called tests.json found in the UserTests subdirectory. This subdirectory should mirror the Source directory of your repository, though it does not have to have directories for every directory in the Source directory. In other words, if you wish to only test on script in a repository that has several directories (Core, Request, Element, etc) you can only have the one you need (say, Request).

*tests.json* describes the tests that should be loaded.

#### Example

	{
		"Foo":{
			"Bar": ['a','b','c']
		}
	}

#### File Mapping

The above tests.json would load a menu with a "Foo" section and a test group called "Bar". Clicking on "Bar" would expand to show the tests for "a", "b", and "c". This would specifically test *Source/Foo/Bar.js* and load its dependencies as defined in *Source/scripts.json*.

The actual javascript test file would therefore be located at *UserTests/Foo/Bar.a.js* and the HTML file for the test would be located at *UserTests/Foo/Bar.a.html*.

### Single Tests vs. Break-outs

Tests can be written as a single test file for a given script (as defined in Scripts.json) or as a series of tests. This is accomplished by naming conventions of the test files. If you give a test the name "all" then clicking the test name will not expand to show sub-tests but will instead just load the single test defined.

#### Single Test in tests.json

	{
		"Foo":{
			"Bar": ['all']
		}
	}

This would load *Source/Foo/Bar.js* and its dependencies just as before, but it would load *UserTests/Foo/Bar.all.js* and *Bar.all.html* instead of expanding a list of sub-tests.

### Test Files

Test files come in pairs: the javascript which is used to load the test and the accompanying HTML (which can be empty if no HTML is required, but must exist).

#### HTML and paths

The HTML can be anything. Note that its source location is that of the iframe's, which is the same path as the test suite. So if your test is at http://foo/tests/ then the iframe's base url is also at that location. You can use relative locations to refer to other files on your system (such as ../../bar.jpg) though it is not recommended as it makes your tests less portable. It is recommended that any assets that accompany your tests be located along side your test files. So if your test needs to reference "x.jpg" that you put it in the same location as the test files and refer to it as *UserTests/Foo/x.jpg*.


#### In-line JavaScript and domReady
HTML parts can contain in-line JavaScript inside of &lt;script&gt; tags. This code will be evaluated *after* your HTML body and dependencies have loaded. Note that this means that you cannot refer to *onload* in your inline code, as the document will already be loaded when your code is evaluated. You should assume that your inline code will be evaluated after the document is ready. *domReady* is fired manually for those dependencies that load that refer to it, but your inline code need not use it.

#### Test Javascript Files

Each test comes with HTML and a JavaScript configuration file. These files look like this:

	{
		tests: [
			{
				title: "Your Test Title",
				description: "A brief description of this test.",
				verify: "Verification question to ask the user - did the test work?",
				before: function(){
					//code to execute when the user starts the test
				},
				body: "//User editable JavaScript run after *before* and before *post*",
				post: function(){
					//code to execute immediately after the *before* test above;
					//if this returns a "falsy" value, the test will fail immediately
					//before the user does anything else
				}
			}
		],
		otherScripts: ["SomeOtherFileToLoad"]
	}

The *tests* array is an array of objects that contain test configurations. This allows you to pose more than one question to the user for a given test or to put more than one test in a given file.

Each test has the following properties:

 * title - (*string*) the title of the test; this is displayed to the user before they run the test.
 * description - (*string*) a brief (one sentence is best) description of the test; this is also displayed
	before the test is run.
 * verify - (*string*) a question that the user must answer after they run the test. The question must be
	a yes/no question and answering it *yes* signals that the test succeeded. This is only displayed after
	the user starts the test.
 * before - (*function*; optional) this code is run immediately when the test is started. If it throw an error, the
	test will fail immediately.
 * body - (*string*; optional) this code is evaluated when the user runs the test after the *before* method if it is defined. This is user-editable so this string is displayed to them for them to change if they like. If this code throws an error the test
	will fail immediately.
 * post - (*function*; optional) this code is run immediately after the *body* code is evaluated (if it's defined).
	If this code throws an error or returns a 'falsy' value the test will fail immediately.

In addition to the tests, the test author can define additional scripts that should be loaded. This will include any missing dependencies for that script as well. This is useful if you're testing something that, say, doesn't require *Selector.js*, but you want to use *Selectors* for your test. This property is an array of script names assigned to the property *otherScripts*.

Configuration
-------------

The test framework must be configured for each environment in which it runs. All that is required is that the file *config.js* be altered for your environment. This amounts to initializing the *UnitTester* class with any options you choose to specify.

	window.addEvent('load', function(){
		new UnitTester(scripts, tests);
	});

### Arguments

1. sources - (*object*) a set of name/value pairs for the locations of scripts.json files for dependency mapping
2. tests - (*object*) a set of name/value pairs for the locations of tests.json files to load

### Example

	window.addEvent('load', function(){
		new UnitTester({
			mootoolsCore: '../svn/Mootools/mootools-core',
			mootoolsMore: '../svn/Mootools/mootools-more'
		},{
			defaultTests: './UserTests/'
		});
	});

Local Testing
-------------

The framework is designed to work from the desktop or from a server, but it definitely works better from a server. Some browsers (FF3 in particular) won't allow you to request local files due to security settings. Safari will allow it and IE will prompt you to allow it. It is possible to work around this in FF3, but it's better to serve the tests from a server when possible.

[http://jania.pe.kr/aw/moin.cgi/JSSpec]: http://jania.pe.kr/aw/moin.cgi/JSSpec
[http://code.google.com/p/clientside-test-framework]: http://code.google.com/p/clientside-test-framework