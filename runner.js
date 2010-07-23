#!/usr/bin/env node
// Runs Specs in NodeJS
// Usage: ./runner '{"specs": ["1.3base"], "path": "../core/"}'

var options = require('./Helpers/RunnerOptions').parseOptions(process.argv[2]);
if (!options) return;

require.paths.push('./Jasmine-Node/lib');

var jasmine = require('jasmine'),
	sys = require('sys');

for(var key in jasmine)
  global[key] = jasmine[key];

require('./Helpers/JSSpecToJasmine');
require('./MooTools').apply(GLOBAL);

require('./Helpers/Loader');

var Sets = require('./Sets').Sets;

var specs = [];
load = function(object, base){
	for (var j = 0; j < object.length; j++)
		specs.push(__dirname + '/' + (base || '') + object[j]);
};

loadSpecs(Sets, options);

jasmine.runSpecs(specs, function(runner, log){
  process.exit(runner.results().failedCount);
}, true, true);