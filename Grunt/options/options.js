'use strict';

var path = require('path');
var browsers = require('./browsers');

module.exports = function(grunt){
	var travis = grunt.config.get('environment.travis'),
		sauceLabs = grunt.config.get('environment.sauceLabs');

	var config = {
		karma: {
			options: {
				singleRun: true,
				captureTimeout: 60000 * 2,
				frameworks: ['expect', 'mocha', 'sinon', 'syn'],
				plugins: ['karma-*', path.resolve('Grunt/plugins/karma/syn')],
				reporters: ['progress'],
				browsers: ['PhantomJS'],
				sauceLabs: {
					username: sauceLabs.username,
					accessKey: sauceLabs.accessKey,
					testName: 'MooTools-Core. Build: ' + travis.build + '. Browser: ' + travis.browser
				},
				customLaunchers: browsers
			}
		},
		mochaTest: {
			options: {
				reporter: 'dot',
				require: function(){
					global.expect = require('expect.js');
					global.sinon = require('sinon');
				}
			}
		},
		packager: {
			options: {
				name: 'Core'
			}
		},
		uglify: {
			options: {
				mangle: false,
				compress: true,
				preserveComments: 'some'
			}
		},
		eslint: {
			options: {
				rulePaths: ['Grunt/plugins/eslint/rules']
			}
		}
	};

	return config;
};
