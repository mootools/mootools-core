'use strict';

module.exports = function(grunt){
	require('load-grunt-tasks')(grunt);

	var pkg = grunt.file.readYAML('package.yml');

	var config = {
		environment: {
			dir: {
				dist: 'dist',
				build: 'build'
			},
			build: {
				compat: {
					name: 'mootools-core-compat',
					sources: pkg.sources,
					specs: 'Specs/**/*.js'
				},
				nocompat: {
					name: 'mootools-core',
					sources: pkg.sources,
					strip: ['.*compat'],
					specs: 'Specs/**/*.js'
				},
				server: {
					name: 'mootools-core-server',
					sources: pkg.sources,
					components: ['Core/Core', 'Core/Array', 'Core/String', 'Core/Number', 'Core/Function', 'Core/Object', 'Core/Class', 'Core/Class.Extras', 'Core/Class.Thenable', 'Core/JSON'],
					strip: ['1.2compat', '1.3compat', '1.4compat', '*compat', 'IE', 'ltIE8', 'ltIE9', '!ES5', '!ES5-bind', 'webkit', 'ltFF4'],
					specs: ['Specs/Core/*.js', 'Specs/Class/*.js', 'Specs/Types/*.js', 'Specs/Utilities/JSON.js'],
					uglify: false
				}
			},
			travis: {
				enabled: (process.env.TRAVIS === 'true'),
				pullRequest: (process.env.TRAVIS_PULL_REQUEST !== 'false'),
				browser: process.env.BROWSER,
				build: process.env.BUILD
			},
			sauceLabs: {
				username: process.env.SAUCE_USERNAME,
				accessKey: process.env.SAUCE_ACCESS_KEY
			}
		}
	};

	if (grunt.option('file') || grunt.option('module')){
		Object.getOwnPropertyNames(config.environment.build).forEach(function(name){
			var build = config.environment.build[name];
			if (grunt.option('file')){
				if (build.components == null || build.components.indexOf('Core/' + grunt.option('file')) !== -1){
					build.components = 'Core/' + grunt.option('file');
					build.specs = grunt.file.match('Specs/**/' + grunt.option('file') + '.js', grunt.file.expand(build.specs));
				} else {
					build.components = [];
					build.specs = [];
				}
			}
			if (grunt.option('module')){
				build.specs = grunt.file.match('Specs/' + grunt.option('module') + '/**.js', grunt.file.expand(build.specs));
			}
		});
	}

	grunt.initConfig(config);
	grunt.util.linefeed = '\n';

	grunt.file.expand('./Grunt/options/*.js').forEach(function(file){
		grunt.config.merge(require(file)(grunt));
	});

	grunt.loadTasks('Grunt/tasks');
};
