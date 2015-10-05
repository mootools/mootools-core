'use strict';

module.exports = function(grunt){
	var dir = grunt.config.get('environment.dir'),
		build = grunt.config.get('environment.build');

	var config = {
		clean: {
			'dist': {src: dir.dist + '/mootools-*.js'},
			'dist-compat': {src: [dir.dist + '/' + build.compat.name + '.js', dir.dist + '/' + build.compat.name + '.min.js']},
			'dist-nocompat': {src: [dir.dist + '/' + build.nocompat.name + '.js', dir.dist + '/' + build.nocompat.name + '.min.js']},
			'dist-server': {src: dir.dist + '/' + build.server.name + '.js'}
		},
		karma: {
			'dist-compat': {
				options: {
					files: [dir.dist + '/' + build.compat.name + '.js', dir.build + '/mootools-specs.js']
				}
			},
			'dist-compat-minified': {
				options: {
					files: [dir.dist + '/' + build.compat.name + '.min.js', dir.build + '/mootools-specs.js' ]
				}
			},
			'dist-nocompat': {
				options: {
					files: [dir.dist + '/' + build.nocompat.name + '.js', dir.build + '/mootools-specs.js']
				}
			},
			'dist-nocompat-minified': {
				options: {
					files: [dir.dist + '/' + build.nocompat.name + '.min.js', dir.build + '/mootools-specs.js']
				}
			}
		},
		mochaTest: {
			'dist-server': {
				src: [dir.dist + '/' + build.server.name + '.js', dir.build + '/mootools-specs.js']
			}
		},
		packager: {
			'dist-compat': {
				options: {
					strip: build.compat.strip,
					only: build.compat.components
				},
				src: build.compat.sources,
				dest: dir.dist + '/' + build.compat.name + '.js'
			},
			'dist-nocompat': {
				options: {
					strip: build.nocompat.strip,
					only: build.nocompat.components
				},
				src: build.nocompat.sources,
				dest: dir.dist + '/' + build.nocompat.name + '.js'
			},
			'dist-server': {
				options: {
					strip: build.server.strip,
					only: build.server.components
				},
				src: build.server.sources,
				dest: dir.dist + '/' + build.server.name + '.js'
			}
		},
		uglify: {
			'dist-compat': {
				files: [
					{src: dir.dist + '/' + build.compat.name + '.js', dest: dir.dist + '/' + build.compat.name + '.min.js'}
				]
			},
			'dist-nocompat': {
				files: [
					{src: dir.dist + '/' + build.nocompat.name + '.js', dest: dir.dist + '/' + build.nocompat.name + '.min.js'}
				]
			}
		}
	};

	return config;
};
