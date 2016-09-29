'use strict';

module.exports = function(grunt){
	var dir = grunt.config.get('environment.dir'),
		build = grunt.config.get('environment.build'),
		travis = grunt.config.get('environment.travis');

	// Prepare karma preprocessor options for karma.
	// ES5 does not support to write dynamic object attribtues directly.
	var karmaPreProcessor = {};
	karmaPreProcessor[dir.build + '/mootools-core.js'] = ['coverage'];

	var config = {
		clean: {
			'build': {src: dir.build + '/mootools-*.js'}
		},
		karma: {
			'run': {
				options: {
					files: [dir.build + '/mootools-core.js', dir.build + '/mootools-specs.js']
				},
				reporters: ['coverage'],
				preprocessors: karmaPreProcessor,
				coverageReporter: {
					dir: dir.build + '/reports/coverage',
					reporters: [
						{type: 'html', subdir: 'report-html'}
					]
				}
			},
			'dev': {
				options: {
					files: [dir.build + '/mootools-core.js', dir.build + '/mootools-specs.js']
				},
				singleRun: false,
				captureTimeout: 0
			},
			'travis': {
				options: {
					files: [dir.build + '/mootools-core.js', dir.build + '/mootools-specs.js']
				},
				reporters: ['progress', 'saucelabs', 'coverage'],
				browsers: [travis.browser],
				preprocessors: karmaPreProcessor,
				coverageReporter: {
					dir: dir.build + '/reports/coverage',
					reporters: [
						// TODO: pass this files to a coverage service e.g. "coveralls.io".
						{type: 'lcov', subdir: 'report-lcov'},
						{type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt'}
					],
					// Don't minify instrumenter output
					instrumenterOptions: {
						istanbul: {
							noCompact: true
						}
					}
				}
			}
		},
		mochaTest: {
			'run': {
				src: [dir.build + '/mootools-core.js', dir.build + '/mootools-specs.js']
			},
			'dev': {
				options: {
					watch: true
				},
				src: [dir.build + '/mootools-core.js', dir.build + '/mootools-specs.js']
			},
			'travis': {
				src: [dir.build + '/mootools-core.js', dir.build + '/mootools-specs.js']
			}
		},
		packager: {
			'compat': {
				options: {
					strip: build.compat.strip,
					only: build.compat.components
				},
				src: build.compat.sources,
				dest: dir.build + '/mootools-core.js'
			},
			'nocompat': {
				options: {
					strip: build.nocompat.strip,
					only: build.nocompat.components
				},
				src: build.nocompat.sources,
				dest: dir.build + '/mootools-core.js'
			},
			'server': {
				options: {
					strip: build.server.strip,
					only: build.server.components
				},
				src: build.server.sources,
				dest: dir.build + '/mootools-core.js'
			}
		},
		eslint: {
			'compat': {
				src: ['Gruntfile.js', 'Grunt/{options,tasks}/*.js', build.compat.sources, build.compat.specs]
			},
			'nocompat': {
				src: ['Gruntfile.js', 'Grunt/{options,tasks}/*.js', build.nocompat.sources, build.nocompat.specs]
			},
			'server': {
				src: ['Gruntfile.js', 'Grunt/{options,tasks}/*.js', build.server.sources, build.server.specs]
			}
		}
	};

	return config;
};
