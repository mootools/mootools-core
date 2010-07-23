#!/usr/bin/env node
// Builds a jsTestDriver.conf for the specified Source/Sets

(function(){

var options = require('./Helpers/RunnerOptions').parseOptions(process.argv[2]);
if (!options) return;

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