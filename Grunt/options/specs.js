'use strict';

module.exports = function(grunt){
	var dir = grunt.config.get('environment.dir'),
		build = grunt.config.get('environment.build');

	var config = {
		clean: {
			'specs': {src: dir.build + '/mootools-specs.js'}
		},
		packager: {
			'specs-compat': {
				options: {
					name: 'Specs',
					strip: build.compat.strip
				},
				src: build.compat.specs,
				dest: dir.build + '/mootools-specs.js'
			},
			'specs-nocompat': {
				options: {
					name: 'Specs',
					strip: build.nocompat.strip
				},
				src: build.nocompat.specs,
				dest: dir.build + '/mootools-specs.js'
			},
			'specs-server': {
				options: {
					name: 'Specs',
					strip: build.server.strip
				},
				src: build.server.specs,
				dest: dir.build + '/mootools-specs.js'
			}
		}
	};

	return config;
};
