"use strict";

module.exports = function(grunt) {

	// grunt.loadNpmTasks('grunt-mootools-packager');
	// grunt.loadNpmTasks('grunt-karma');
	// grunt.loadNpmTasks('grunt-contrib-clean');
	// grunt.loadNpmTasks('grunt-contrib-connect');

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		'connect': {
			testserver: {
				options: {
					// We use end2end task (which does not start the webserver)
					// and start the webserver as a separate process (in travis_build.sh)
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
				frameworks: ['jasmine', 'sinon'],
				files: ['http://rawgithub.com/bitovi/legacy-syn/master/dist/syn.js', 'mootools-*.js'],
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
						version: '7'
					},
					safari6: {
						base: 'SauceLabs',
						browserName: 'safari',
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
						version: '11'
					},
					ie10: {
						base: 'SauceLabs',
						browserName: 'internet explorer',
						version: '10'
					},
					ie9: {
						base: 'SauceLabs',
						browserName: 'internet explorer',
						version: '9'
					},
					ie8: {
						base: 'SauceLabs',
						browserName: 'internet explorer',
						version: '8'
					},
					ie7: {
						base: 'SauceLabs',
						browserName: 'internet explorer',
						version: '7'
					},
					ie6: {
						base: 'SauceLabs',
						browserName: 'internet explorer',
						version: '6'
					},
					iphone_7: {
						base: 'SauceLabs',
						browserName: 'iphone',
						version: '7'
					},
					iphone_6_1: {
						base: 'SauceLabs',
						browserName: 'iphone',
						version: '6.1'
					},
					iphone_6: {
						base: 'SauceLabs',
						browserName: 'iphone',
						version: '6'
					}
				},
			},

			continuous: {
				singleRun: true,
				browsers: ['PhantomJS']
			},

			sauce1: {
				singleRun: true,
				browsers: [
					'chrome_linux', 
					'firefox_linux', 
					'opera_win2000'
				]
			},

			sauce2: {
				singleRun: true,
				browsers: [
					'safari7',
					'safari6',
					'safari5_osx10_6'
				],
			},

			sauce3: {
				singleRun: true,
				browsers: [
					'safari5_win7',
					'ie11',
					'ie10'
				]
			},

			sauce4: {
				singleRun: true,
				browsers: [
					'ie9',
					'ie8',
					'ie7'
				]
			},

			sauce5: {
				singleRun: true,
				browsers: [
					'ie6',
					'iphone_7',
					'iphone_6_1',
				]
			},

			sauce6: {
				singleRun: true,
				browsers: [
					'iphone_6'
				]
			},

			dev: {
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
	grunt.registerTask('default:travis', ['clean', 'packager:all', 'packager:specs', 'karma:sauce1', 'karma:sauce2', 'karma:sauce3', 'karma:sauce4', 'karma:sauce5', 'karma:sauce6'])
};