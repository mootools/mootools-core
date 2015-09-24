"use strict";

var fs = require('fs');
var path = require('path');
var YAML = require('js-yaml');
var ymlPackage = YAML.safeLoad(fs.readFileSync('package.yml', 'utf8'));
var travisBuild = process.env.BUILD;
var travisBrowser = process.env.BROWSER;
var sauceBrowsers = JSON.parse(fs.readFileSync('Tests/browsers.json'));
var serverBuildOptions = JSON.parse(fs.readFileSync('Tests/dist-tasks.json')).build.server.options;
var serverBuild = {
	modules: serverBuildOptions.only,
	specFiles: ['Specs/Core/*.js', 'Specs/Class/*.js', 'Specs/Types/*.js', 'Specs/Utilities/JSON.js'],
	strip: serverBuildOptions.strip
}

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
    server: {
        options: {
            strip: serverBuild.strip,
            only: serverBuild.modules
        },
        src: ymlPackage.sources,
        dest: 'mootools-server.js'
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
    },
    specsServer: {
        options: {
            name: 'Specs',
            strip: serverBuild.strip,
        },
        src: serverBuild.specFiles,
        dest: 'mootools-server-specs.js'
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
    frameworks: ['expect', 'jasmine', 'sinon', 'syn'],
    plugins: ['karma-*', path.resolve('Tests/Plugins/syn')],
    files: ['mootools-*.js'],
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
