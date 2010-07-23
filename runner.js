#!/usr/bin/env node

// Runs specs in NodeJS, also a proof of concept for now

require.paths.push('./Jasmine-Node/lib');

var jasmine = require('jasmine'),
	sys = require('sys');

for(var key in jasmine)
  global[key] = jasmine[key];

require('./Helpers/JSSpecToJasmine');
require('./MooTools').apply(GLOBAL);

require('./1.3/Core/Core');
require('./1.3/Types/Array');
require('./1.3/Types/Function');
require('./1.3/Types/Object');

jasmine.executeSpecsInFolder(__dirname + '/1.3/Core', function(runner, log){
  process.exit(runner.results().failedCount);
}, true, true);