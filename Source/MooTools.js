/*
---

name: MooTools

description: Module to load MooTools in serverside environments

license: MIT-style license.

copyright: Copyright (c) 2006-2010 [Valerio Proietti](http://mad4milk.net/).

authors: The MooTools production team (http://mootools.net/developers/)

...
*/

(function(){

var modules = [
	'Core/Core',
	'Types/Function', 'Types/Array', 'Types/String',
	'Types/Number', 'Types/Hash',
	'Class/Class', 'Class/Class.Extras'
];

for (var i = 0; i < modules.length; i++){
	var objects = require('./' + modules[i]);

	for (var id in objects)
		exports[id] = objects[id];
}

exports.apply = function(context){
	return Object.append(context, exports);
};

})();