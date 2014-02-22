"use strict";

module.exports = function(grunt){

	grunt.loadNpmTasks('grunt-mootools-packager');
	grunt.loadNpmTasks('grunt-karma');

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
				src: 'Specs/**/*.js',
				dest: 'specs.js'
			}

		},

		'karma': {

			options: {
				browsers: ['Chrome']
			},

			continuous: {
				singleRun: true
			},

			dev: {
				reporters: 'dots'
			}

		}

	});

	grunt.registerTask('default', ['packager:all', 'packager:specs']);

};
