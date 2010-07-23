#!/usr/bin/env node

/*
Builds a jsTestDriver.conf for the specified Source/Sets

Usage: ./build.js version path set1 set2

Example: ./build.js 1.3 ../Source/ 1.2 1.3

Note: this is really dirty and should be redone soon!

*/

var Source = require('./Source').Source,
	Sets = require('./Sets').Sets;

var argv = process.argv,
	version = argv[2],
	path = argv[3],
	sets = argv.splice(4, argv.length - 4);

var data = 'server: http://localhost:9876\n\n';

data += 'load:\n';
data += '  - "Jasmine/jasmine.js"\n';
data += '  - "JSTD-Adapter/src/JasmineAdapter.js"\n';
data += '  - "Helpers/JSSpecToJasmine.js"\n';

var i;
for (var base in Source[version]){
	var files = Source[version][base];

	for (i = 0; i < files.length; i++)
		data += '  - "' + path + files[i] + '.js"\n';
}

for (var i = 0; i < sets.length; i++){
	var set = sets[i];
	for (i = 0; i < Sets[set].length; i++)
		data += '  - "' + set + '/' + Sets[set][i] + '.js"\n';
}

var fs = require('fs');
fs.writeFile('./jsTestDriver.conf', data)