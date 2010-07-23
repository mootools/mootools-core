#!/usr/bin/env node
// Builds a jsTestDriver.conf for the specified Source/Sets

(function(){

var puts = require('sys').puts;

var arg = process.argv[2];
if (!arg){
	puts('Please provide options for the Spec Runner');
	return;
}

var options;
try {
	options = JSON.parse(arg);
} catch(e){
	puts('Please provide a proper JSON-Object');
	return;
}

var data = 'server: http://localhost:9876\n\n';
data += 'load:\n';
load = function(object, base){
	for (var j = 0; j < object.length; j++)
		data += '  - "' + (base || '') + object[j] + '.js"\n';
};

require('./Helpers/Loader');

var Source = require('./Source').Source,
	Sets = require('./Sets').Sets;

load([
	'Jasmine/jasmine',
	'JSTD-Adapter/src/JasmineAdapter',
	'Helpers/JSSpecToJasmine'
]);

loadLibrary(Source, options);
loadSpecs(Sets, options);

var fs = require('fs');
fs.writeFile('./jsTestDriver.conf', data);

})();