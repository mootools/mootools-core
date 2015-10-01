"use strict";

var path = require('path'),
	Mocha = require('mocha'),
	expect = require('expect.js'),
	sinon = require('sinon');

var dir = path.join(__dirname, '..'),
	files = [
		'mootools-server.js',
		'mootools-server-specs.js'
	];

function injectLibraries(object){
	object.expect = expect;
	object.sinon = sinon;
}

module.exports = function(cb){

	var mocha = new Mocha({
		reporter: 'dot'
	});

	for (var i = 0, l = files.length; i < l; ++i){
		mocha.addFile(path.join(dir, files[i]));
	}

	injectLibraries(global);

	mocha.run(function(failures){
		var passed = (failures === 0);
		if (passed) cb();
		else process.exit(1);
	});
}
