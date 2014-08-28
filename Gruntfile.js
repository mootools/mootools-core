"use strict";

module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-uglify');
	require('load-grunt-tasks')(grunt);

	var fs = require('fs');
	var pullRequest = process.env.TRAVIS_PULL_REQUEST;	
	var distTasks = JSON.parse(fs.readFileSync('Tests/dist-tasks.json'));
	var options = require('./Tests/gruntfile-options');

	grunt.initConfig({
		'connect': options.grunt,
		'packager': {
			options: {name: 'Core'},
			'all':options.packager.all,
			'nocompat':options.packager.nocompat,
			'specs':options.packager.specs,
			'specs-nocompat':options.packager.specsNoCompat,
			'dist-all': distTasks.build.compat,
			'dist-nocompat': distTasks.build.nocompat,
			'dist-server': distTasks.build.server
		},
		uglify: distTasks.uglify,
		'karma': {
			options: options.karma,
			continuous: {
				browsers: ['PhantomJS']
			},
			sauceTask: {
				browsers: [options.travis.browser]
			},
			dev: {
				singleRun: false,
				browsers: ['PhantomJS'],
				reporters: 'dots'
			},
			// Testers for dist build files
			compatFull: distTasks.testTasks.compatFull,
			compatUglyfied: distTasks.testTasks.compatUglyfied,
			nocompatFull: distTasks.testTasks.nocompatFull,
			nocompatUglified: distTasks.testTasks.nocompatUglified
		},

		'clean': {
			dist: {src: 'dist/mootools-*.js'},
			specs: {src: 'mootools-*.js'}
		}
	});

	var compatBuild = ['clean:specs', 'packager:all', 'packager:specs'];
	var nocompatBuild = ['clean:specs', 'packager:nocompat', 'packager:specs-nocompat'];
	var tasks = options.travis.build == 'default' ? compatBuild : nocompatBuild;
	tasks =  pullRequest != 'false' ? tasks.concat('karma:continuous') : tasks.concat('karma:sauceTask');

	grunt.registerTask('default', compatBuild.concat('karma:continuous'));		// local testing - compat build
	grunt.registerTask('nocompat', nocompatBuild.concat('karma:continuous'));	// local testing - no compat build
	grunt.registerTask('default:travis', tasks);								// Travis & Sauce Labs
	grunt.registerTask('distBuild', [											// task to build and test /dist files
		// Build dist files
		'clean:dist', 'packager:dist-all', 'packager:dist-nocompat', 'packager:dist-server', 'uglify',
		// Test specs against dist files
		'clean:specs', 'packager:specs', 'karma:compatFull', 'karma:compatUglyfied',
		'clean:specs', 'packager:specs-nocompat', 'karma:nocompatFull', 'karma:nocompatUglified'
	]);

};
