var trim = function(str){
	return str.replace(/^\s+|\s+$/g, '');
};

var capitalize = function(str){
	return str.replace(/\b[a-z]/g, function(match){
		return match.toUpperCase();
	});
};
