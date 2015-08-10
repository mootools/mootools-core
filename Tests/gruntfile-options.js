"use strict";

var fs = require('fs');
var YAML = require('js-yaml');
var ymlPackage = YAML.safeLoad(fs.readFileSync('package.yml', 'utf8'));
var travisBuild = process.env.BUILD;
var travisBrowser = process.env.BROWSER;
var sauceBrowsers = JSON.parse(fs.readFileSync('Tests/browsers.json'));

var packagerOptions = {

    all: {
        src: ymlPackage.sources,
        dest: 'mootools-all.js'
    },
    nocompat: {
        options: {
            strip: ['.*compat'],
            only: '<%= grunt.option("file") && "Core/" + grunt.option("file") %>'
        },
        src: ymlPackage.sources,
        dest: 'mootools-nocompat.js'
    },
    specs: {
        options: {
            name: 'Specs'
        },
        src: 'Specs/<%= grunt.option("module") || "**" %>/<%= grunt.option("file") || "*" %>.js',
        dest: 'mootools-specs.js'
    },
    specsNoCompat: {
        options: {
            name: 'Specs',
            strip: ['.*compat'],
            only: '<%= grunt.option("file") && "Specs/" + grunt.option("file") %>'
        },
        src: 'Specs/**/*.js',
        dest: 'mootools-specs.js'
    }
}

var gruntOptions = {
    testserver: {
        options: {
            // We use end2end task (which does not start the webserver)
            // and start the webserver as a separate process
            // to avoid https://github.com/joyent/libuv/issues/826
            port: 8000,
            hostname: '0.0.0.0',
            middleware: function(connect, options){
                return [
                function(req, resp, next){
                    // cache get requests to speed up tests on travis
                    if (req.method === 'GET'){
                        resp.setHeader('Cache-control', 'public, max-age=3600');
                    }
                    next();
                },
                connect.static(options.base)];
            }
        }
    }
}

var karmaOptions = {
    captureTimeout: 60000 * 2,
    singleRun: true,
    frameworks: ['jasmine', 'sinon'],
    files: [
		'Tests/Utilities/*.js',
		'mootools-*.js',
		{pattern: 'Source/**/*.*', included: false, served: true},
		{pattern: 'Tests/**/*.*', included: false, served: true}
	],
	proxies: {
        '/specsserver/': 'http://localhost:9000/'
	},
    sauceLabs: {
        username: process.env.SAUCE_USERNAME,
        accessKey: process.env.SAUCE_ACCESS_KEY,
        testName: 'MooTools-Core. Build: ' + travisBuild + '. Browser: ' + travisBrowser
    },
    reporters: ['progress', 'saucelabs'],
    customLaunchers: sauceBrowsers,
}

var travisOptions = {
	build: travisBuild,
	browser: travisBrowser
}

exports.packager = packagerOptions;
exports.grunt = gruntOptions;
exports.karma = karmaOptions;
exports.travis = travisOptions;
