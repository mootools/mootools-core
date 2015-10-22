var path = require('path');

var createPattern = function(path){
	return {pattern: path, included: true, served: true, watched: false};
};

//var initSyn = function(files){
//	files.unshift(createPattern(path.join(__dirname, 'post-amd.js')));
//	files.unshift(createPattern(path.resolve(require.resolve('syn'), '../../syn.js')));
//	files.unshift(createPattern(path.join(__dirname, 'pre-amd.js')));
//};

var initSyn = function(files){
	// Local version that works in IE9 and IE10.
	files.unshift(createPattern(path.join(__dirname, 'lib/syn.js')));
};

initSyn.$inject = ['config.files'];

module.exports = {
	'framework:syn': ['factory', initSyn]
};
