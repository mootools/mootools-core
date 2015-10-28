'use strict';

module.exports = function(grunt){
	var travis = grunt.config.get('environment.travis');

	var build = {
			compat: ['eslint:compat', 'clean:build', 'packager:compat', 'packager:specs-compat'],
			nocompat: ['eslint:nocompat', 'clean:build', 'packager:nocompat', 'packager:specs-nocompat'],
			server: ['eslint:server', 'clean:build', 'packager:server', 'packager:specs-server']
		},
		dist = {
			compat: ['clean:dist-compat', 'clean:specs', 'packager:dist-compat', 'uglify:dist-compat', 'packager:specs-compat'],
			nocompat: ['clean:dist-nocompat', 'clean:specs', 'packager:dist-nocompat', 'uglify:dist-nocompat', 'packager:specs-nocompat'],
			server: ['clean:dist-server', 'clean:specs', 'packager:dist-server', 'packager:specs-server']
		};

	grunt.registerTask('compat', build.compat.concat('karma:run', 'clean:specs'));
	grunt.registerTask('compat:test', build.compat.concat('karma:run', 'clean:build'));
	grunt.registerTask('compat:dev', build.compat.concat('karma:dev'));
	grunt.registerTask('compat:dist', dist.compat.concat('karma:dist-compat', 'karma:dist-compat-minified', 'clean:specs'));

	grunt.registerTask('nocompat', build.nocompat.concat('karma:run', 'clean:specs'));
	grunt.registerTask('nocompat:test', build.nocompat.concat('karma:run', 'clean:build'));
	grunt.registerTask('nocompat:dev', build.nocompat.concat('karma:dev'));
	grunt.registerTask('nocompat:dist', dist.nocompat.concat('karma:dist-nocompat', 'karma:dist-nocompat-minified', 'clean:specs'));

	grunt.registerTask('server', build.server.concat('mochaTest:run', 'clean:specs'));
	grunt.registerTask('server:test', build.server.concat('mochaTest:run', 'clean:build'));
	grunt.registerTask('server:dev', build.server.concat('mochaTest:dev'));
	grunt.registerTask('server:dist', dist.server.concat('mochaTest:dist-server', 'clean:specs'));

	grunt.registerTask('test', ['compat:test', 'nocompat:test', 'server:test']);
	grunt.registerTask('dist', ['clean:dist', 'compat:dist', 'nocompat:dist', 'server:dist']);

	grunt.registerTask('travis', function(){
		if (!travis.enabled){
			grunt.fail.warn('This does not appear to be travis-ci.');
		}
		if (!build[travis.build]){
			grunt.fail.fatal('Unknown build "' + travis.build + '".\nValid builds: ' + Object.keys(build).join(', ') + '.');
		}

		if (travis.build == 'server'){
			grunt.task.run(build[travis.build].concat('mochaTest:travis'));
		} else if (travis.browser == 'phantomjs' || !travis.pullRequest){
			var browsers = grunt.config.get('karma.options.customLaunchers');
			if (!browsers[travis.browser]){
				grunt.fail.fatal('Unknown browser "' + travis.browser + '".\nValid browsers: ' + Object.keys(browsers).join(', ') + '.');
			}
			grunt.task.run(build[travis.build].concat('karma:travis'));
		} else {
			grunt.log.writeln('This appears to be a Pull Request.');
			grunt.log.writeln('Unfortunately we cannot run browser tests for Pull Requests.');
		}
	});

	grunt.registerTask('default', function(){
		if (travis.enabled){
			grunt.log.writeln('Detected travis-ci environment.');
			grunt.option('verbose', true);
			grunt.task.run('travis');
		} else {
			grunt.log.writeln('Running all tests.');
			grunt.task.run('test');
		}
	});
};
