var puts = require('sys').puts;

exports.parseOptions = function(arg){

if (!arg){
	puts('Please provide options for the Spec Runner');
	return null;
}

var options;
try {
	options = JSON.parse(arg);
} catch(e){
	puts('Please provide a proper JSON-Object');
	return null;
}

return options;

};