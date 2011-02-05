/*
---
name: Options
description: Options
requires: [Type, Class, Object]
provides: Options
...
*/

(function(){

var classSetOption = function(key, value){
	if (!this.options) this.options = {};
	if (this.listen && (/^on[A-Z]/).test(key) && typeOf(value) == 'function') this.listen(key.replace(/^on([A-Z])/, function(full, first){
		return first.toLowerCase();
	}), value);
	else Object.merge(this.options, key, value);
	return this;
};

var classGetOption = function(key){
	var options = this.options;
	if (!options) return null;
	var value = options[key];
	return (value != null) ? value : null;
};

this.Options = new Class({
	setOption: classSetOption,
	setOptions: classSetOption.overloadSetter(true),
	getOption: classGetOption,
	getOptions: classGetOption.overloadGetter(true)
});

}).call(this);
