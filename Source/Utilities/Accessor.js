/*
---
name: Accessor
description: Accessor
requires: [typeOf, Array, Function, String, Object]
provides: Accessor
...
*/

(function(){

this.Accessor = function(singular, plural){
	
	var accessor = {}, matchers = [];
	
	singular = (singular || '').capitalize();
	if (!plural) plural = singular + 's';
	
	var define = 'define', lookup = 'lookup', match = 'match', each = 'each';
	
	var defineSingular = this[define + singular] = function(key, value){
		if (typeOf(key) == 'regexp') matchers.push({'regexp': key, 'action': value});
		else accessor[key] = value;
		return this;
	};
	
	var definePlural = this[define + plural] = function(object){
		for (var key in object) accessor[key] = object[key];
		return this;
	};
	
	var matchSingular = this[match + singular] = function(name){
		for (var l = matchers.length; l--; l){
			var matcher = matchers[l], match = name.match(matcher.regexp);
			if (match && (match = match.slice(1))) return function(){
				return matcher.action.apply(this, Array.slice(arguments).append(match));
			};
		}
		return null;
	};
	
	var lookupSingular = this[lookup + singular] = function(key){
		return (accessor.hasOwnProperty(key) && accessor[key]) || null;
	};
	
	var lookupPlural = this[lookup + plural] = lookupSingular.overloadGetter(true);
	
	var eachSingular = this[each + singular] = function(fn, bind){
		Object.each(accessor, fn, bind);
	};

};

})();
