"use strict";

var Jasmine = require('jasmine'),
	chai = require('chai'),
	sinon = require('sinon');

function injectLibraries(object){
	object.should = chai.should();
	object.expect = chai.expect;
	object.assert = chai.assert;
	object.sinon = sinon;
}

module.exports = function(cb){

	var jasmine = new Jasmine();
	jasmine.loadConfig({
		spec_dir: '/',
		spec_files: [
			'mootools-server.js',
			'mootools-server-specs.js'
		],
		helpers: []
	});

	jasmine.configureDefaultReporter({
		showColors: true
	});

	injectLibraries(global);

	jasmine.onComplete(function(passed){
		if(passed) cb();
		else process.exit(1);
	});

	jasmine.execute();
}
