var Sets = {
	
	'1.2public': [
		'Core/Core.js', 'Core/Browser.js',
		'Native/Array.js', 'Native/String.js', 'Native/Function.js', 'Native/Number.js', 'Native/Hash.js',
		'Class/Class.js', 'Class/Class.Extras.js', 
		'Element/Element.js', 'Element/Element.Style.js', 'Element/Element.Dimensions.js',
		'Utilities/Selectors.Children.js'
	],
	
	'1.2private': [
		'Core/Core.js', 'Core/Browser.js',
		
	]

};

var loadSpecs = (function(){

// Uses String.parseQueryString from MooTools-More
// TODO Needs compat for other browsers
var parseQueryString = function(string){
	var vars = string.split(/[&;]/), res = {};
	if (vars.length) vars.forEach(function(val){
		var index = val.indexOf('='),
			keys = index < 0 ? [''] : val.substr(0, index).match(/[^\]\[]+/g),
			value = decodeURIComponent(val.substr(index + 1)),
			obj = res;
		keys.forEach(function(key, i){
			var current = obj[key];
			if(i < keys.length - 1)
				obj = obj[key] = current || {};
			else if(current && current._type == 'Array') // JSSpec prototyping
				current.push(value);
			else
				obj[key] = current != undefined ? [current, value] : value;
		});
	});
	return res;
};

var getSpecs = function(queryString){
	queryString = parseQueryString(queryString);
	
	var requestedSpecs = [],
		specs = queryString.specs;
	
	(specs && specs._type == 'Array' ? specs : [specs]).forEach(function(spec){
		if (Sets[spec] && requestedSpecs.indexOf(spec) == -1) requestedSpecs.push(spec);
	});
	
	return requestedSpecs;
};

var loadSpecs = function(obj){
	for (var i = 0; i < obj.length; i++){
		SpecNames.push(obj[i]);
		
		var specs = Sets[obj[i]];
		for (var j = 0; j < specs.length; j++){
			document.write('<scr'+'ipt src="' + obj[i] + '/' + specs[j] + '" type="text/javascript"><\/script>');
		}
	}
};

var requestedSpecs = getSpecs(document.location.search.substr(1));
loadSpecs(requestedSpecs);

});