"use strict";

module.exports = function(grunt){

	grunt.loadNpmTasks('grunt-mootools-packager');

	grunt.initConfig({

		packager: {
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
			}
		}

	});

	grunt.registerTask('default', ['packager']);

};
