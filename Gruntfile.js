"use strict";

module.exports = function(grunt){

	grunt.loadNpmTasks('grunt-mootools-packager');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.initConfig({

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
					strip: ['.*compat']
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
			}

		},

		'karma': {

			options: {
				browsers: ['PhantomJS'],
				frameworks: ['jasmine'],
				files: ['mootools-all.js', 'mootools-specs.js']
			},

			continuous: {
				singleRun: true
			},

			dev: {
				reporters: 'dots'
			}

		},

		'clean': {
			all: {
				src: ['mootools-all.js', 'mootools-specs.js']
			}
		}

	});

	grunt.registerTask('default', ['clean', 'packager:all', 'packager:specs', 'karma:continuous']);
};
