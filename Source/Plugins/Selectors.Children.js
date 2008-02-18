/*
Script: Selectors.Children.js
	Adds the :children selector for selecting ranges of children of an element.

License:
	MIT-style license.
*/

Selectors.Cache.children = {};

Selectors.Utils.parseChildrenArgument = function(argument){
	
	if (Selectors.Cache.children[argument]) return Selectors.Cache.children[argument];
	
	argument = (argument) ? argument.match(/^([-+]?\d*)?([\-+:])?([-+]?\d*)?$/) : [null, 0, false, 0];
	if (!argument) return false;
	argument[1] = parseInt(argument[1]) || 0;
	var int1 = parseInt(argument[3]);
	argument[3] = ($chk(int1)) ? int1 : 0;
	var parsed;
	switch (argument[2]){
		case '-': case '+': case ':': parsed = {a: argument[1], b: argument[3], special: argument[2]}; break;
		default: parsed = {a: argument[1], b: 0, special: 'index'};
	}
	return Selectors.Cache.children[argument] = parsed;
};

Selectors.Pseudo.extend({
	
	children: function(argument, local){
		argument = Selectors.Utils.parseChildrenArgument(argument);		
		local.i = local.i || 0;
		local.all = local.all || this.parentNode.childNodes;
		local.len = local.len || local.all.length;
		var i = local.i;
		var len = local.len;
		var all = local.all;
		var include = false;
		var a = argument.a + ((argument.a < 0) ? len : 0);
		var b = argument.b + ((argument.b < 0) ? len : 0);
		switch (argument.special){
			case '-':
				b = (a - b) % len;
				include = (b < 0) ? (i <= a || i >= (b + len)) : (i <= a && i >= b);
			break;
			case '+': b = (b + a) % len;
			case ':': include = (b < a) ? (i >= a || i <= b) : (i >= a && i <= b); break;
			default: include = (all[a] == this);
		}
		local.i++;
		return include;	
	}
	
});