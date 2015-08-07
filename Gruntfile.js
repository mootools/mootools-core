"use strict";

module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-uglify');
	require('load-grunt-tasks')(grunt);

	var fs = require('fs');
	var usePhantom = process.env.TRAVIS_PULL_REQUEST != 'false' || process.env.BROWSER == 'phantomjs';
	var distTasks = JSON.parse(fs.readFileSync('Tests/dist-tasks.json'));
	var serverSpecsJasmine = require('./Tests/jasmine-server-tests');
	var options = require('./Tests/gruntfile-options');

	grunt.initConfig({
		'connect': options.grunt,
		'packager': {
			options: {name: 'Core'},
			'all':options.packager.all,
			'nocompat':options.packager.nocompat,
			'server':options.packager.server,
			'specs':options.packager.specs,
			'specs-nocompat':options.packager.specsNoCompat,
			'specs-server':options.packager.specsServer,
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
	var serverBuild = ['clean:specs', 'packager:server', 'packager:specs-server'];

	var tasks = options.travis.build == 'default' ? compatBuild : options.travis.build == 'server' ? serverBuild : nocompatBuild;
	tasks = options.travis.build == 'server' ? tasks.concat('server-jasmine-runner') : usePhantom ? tasks.concat('karma:continuous') : tasks.concat('karma:sauceTask');

	// to run only server specs and avoid running browser specs for in the different versions of node and iojs
	if (options.travis.build && options.travis.build != 'server' && process.version.slice(1, 5) != '0.10') tasks = [];

	grunt.registerTask('default', compatBuild.concat('karma:continuous'));		// local testing - compat build
	grunt.registerTask('nocompat', nocompatBuild.concat('karma:continuous'));	// local testing - no compat build
	grunt.registerTask('server', serverBuild.concat('server-jasmine-runner'));	// local testing - server build
	grunt.registerTask('server-jasmine-runner', function(){						// Travis server specs
		var done = this.async();
		serverSpecsJasmine(done);
	});
	grunt.registerTask('default:travis', tasks);								// Travis & Sauce Labs
	grunt.registerTask('distBuild', [											// task to build and test /dist files
		// Build dist files
		'clean:dist', 'packager:dist-all', 'packager:dist-nocompat', 'packager:dist-server', 'uglify',
		// Test specs against dist files
		'clean:specs', 'packager:specs', 'karma:compatFull', 'karma:compatUglyfied',
		'clean:specs', 'packager:specs-nocompat', 'karma:nocompatFull', 'karma:nocompatUglified'
	]);

};
