"use strict";

module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		'connect': {
			testserver: {
				options: {
					// We use end2end task (which does not start the webserver)
					// and start the webserver as a separate process
					// to avoid https://github.com/joyent/libuv/issues/826
					port: 8000,
					hostname: '0.0.0.0',
					middleware: function(connect, options) {
						return [
							function(req, resp, next) {
								// cache get requests to speed up tests on travis
								if (req.method === 'GET') {
									resp.setHeader('Cache-control', 'public, max-age=3600');
								}

								next();
							},
							connect.static(options.base)
						];
					}
				}
			}
		},

		'packager': {

			options: {
				name: 'Core'
			},

			all: {
				src: 'Source/**/*.js',
				dest: 'mootools-all.js'
			},

			nocompat: {
				options: {
					strip: ['.*compat'],
					only: '<%= grunt.option("file") && "Core/" + grunt.option("file") %>'
				},
				src: 'Source/**/*.js',
				dest: 'mootools-nocompat.js'
			},

			specs: {
				options: {
					name: 'Specs'
				},
				src: 'Specs/<%= grunt.option("module") || "**" %>/<%= grunt.option("file") || "*" %>.js',
				dest: 'mootools-specs.js'
			},

			'specs-nocompat': {
				options: {
					name: 'Specs',
					strip: ['.*compat'],
					only: '<%= grunt.option("file") && "Specs/" + grunt.option("file") %>'
				},
				src: 'Specs/**/*.js',
				dest: 'mootools-specs.js'
			}

		},

		'karma': {

			options: {
				captureTimeout: 60000 * 2,
				singleRun: true,
				frameworks: ['jasmine', 'sinon'],
				files: ['Tests/Utilities/*.js', 'mootools-*.js'],
				sauceLabs: {
					username: process.env.SAUCE_USERNAME,
					accessKey: process.env.SAUCE_ACCESS_KEY,
					testName: 'MooTools-Core'
				},
				customLaunchers: {
					chrome_linux: {
						base: 'SauceLabs',
						browserName: 'chrome',
						platform: 'linux'
					},
					firefox_linux: {
						base: 'SauceLabs',
						browserName: 'firefox',
						platform: 'linux'
					},
					opera_win2000: {
						base: 'SauceLabs',
						browserName: 'opera',
						platform: 'Windows 2008',
						version: '12'
					},
					safari7: {
						base: 'SauceLabs',
						browserName: 'safari',
						platform: 'OS X 10.9',
						version: '7'
					},
					safari6: {
						base: 'SauceLabs',
						browserName: 'safari',
						platform: 'OS X 10.8',
						version: '6'
					},
					safari5_osx10_6: {
						base: 'SauceLabs',
						browserName: 'safari',
						version: '5',
						platform: 'OS X 10.6'
					},
					safari5_win7: {
						base: 'SauceLabs',
						browserName: 'safari',
						version: '5',
						platform: 'Windows 7'
					},
					ie11: {
						base: 'SauceLabs',
						browserName: 'internet explorer',
						platform: 'Windows 8.1',
						version: '11'
					},
					ie10: {
						base: 'SauceLabs',
						browserName: 'internet explorer',
						platform: 'Windows 8',
						version: '10'
					},
					ie9: {
						base: 'SauceLabs',
						browserName: 'internet explorer',
						platform: 'Windows 7',
						version: '9'
					},
					ie8: {
						base: 'SauceLabs',
						browserName: 'internet explorer',
						platform: 'Windows 7',
						version: '8'
					},
					ie7: {
						base: 'SauceLabs',
						browserName: 'internet explorer',
						platform: 'Windows XP',
						version: '7'
					},
					ie6: {
						base: 'SauceLabs',
						browserName: 'internet explorer',
						platform: 'Windows XP',
						version: '6'
					},
					iphone_7: {
						base: 'SauceLabs',
						browserName: 'iphone',
						platform: 'OS X 10.9',
						version: '7',
						deviceOrientation: 'portrait'
					},
					iphone_6_1: {
						base: 'SauceLabs',
						browserName: 'iphone',
						platform: 'OS X 10.8',
						version: '6.1',
						deviceOrientation: 'portrait'
					},
					iphone_6: {
						base: 'SauceLabs',
						browserName: 'iphone',
						platform: 'OS X 10.8',
						version: '6',
						deviceOrientation: 'portrait'
					}
				},
			},

			continuous: {
				browsers: ['PhantomJS']
			},

			sauce1: {
				port: 9876,
				browsers: [
					'chrome_linux', 
					'firefox_linux', 
					'opera_win2000'
				]
			},

			sauce2: {
				port: 9877,
				browsers: [
					'safari7',
					'safari6',
					'safari5_osx10_6'
				],
			},

			// safari5_win7, ie11 and ie10 are not loading the test page
			sauce3: {
				port: 9999,
				browsers: [
					'safari5_win7',
					'ie11',
					'ie10'
				]
			},

			// ie9, ie8, and ie7 are not loading the test page
			sauce4: {
				port: 3000,
				browsers: [
					'ie9',
					'ie8',
					'ie7'
				]
			},

			// ie6 is not loading the test page
			// sauce5: {
			//  port: 9876,
			//  browsers: [
			//      'ie6',
			//      'iphone_7',
			//      'iphone_6_1',
			//  ]
			// },

			// sauce6: {
			//  port: 9805,
			//  browsers: [
			//      'iphone_6'
			//  ]
			// },

			dev: {
				singleRun: false,
				browsers: ['PhantomJS'],
				reporters: 'dots'
			}

		},

		'clean': {
			all: {
				src: 'mootools-*.js'
			}
		}

	});

	grunt.registerTask('default', ['clean', 'packager:all', 'packager:specs', 'karma:continuous']);
	grunt.registerTask('nocompat', ['clean', 'packager:nocompat', 'packager:specs-nocompat', 'karma:continuous']);
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
};