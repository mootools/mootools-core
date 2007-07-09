/*
Script: Selectors.Pseudo.Children.js
	custom :children() pseudo selecor

License:
	MIT-style license.
*/

Selectors.Pseudo.children = {

	parser: function(argument){
		argument = (argument) ? argument.match(/^([-+]?\d*)?([\-+:])?([-+]?\d*)?$/) : [null, 0, false, 0];		
		if (!argument) throw new Error('bad :children pseudo selector arguments');
		argument[1] = parseInt(argument[1]) || 0;
		var int1 = parseInt(argument[3]);
		argument[3] = ($chk(int1)) ? int1 : 0;
		switch (argument[2]){
			case '-': case '+': case ':': return {'a': argument[1], 'b': argument[3], 'special': argument[2]};
			default: return {'a': argument[1], 'b': 0, 'special': 'index'};
		}
	},
	
	xpath: function(argument){
		var include = '';
		var len = 'count(../child::*)';
		var a = argument.a + ' + ' + ((argument.a < 0) ? len : 0);
		var b = argument.b + ' + ' + ((argument.b < 0) ? len : 0);
		var pos = 'position()';
		switch (argument.special){
			case '-':
				b = '((' + a + ' - ' + b + ') mod (' + len + '))';
				a += ' + 1';
				b += ' + 1';
				include = '(' + b + ' < 1 and (' + pos + ' <= ' + a + ' or ' + pos + ' >= (' + b + ' + ' + len + ')' + ')) or (' + pos + ' <= ' + a + ' and ' + pos + ' >= ' + b + ')';
			break;
			case '+': b = '((' + a + ' + ' + b + ') mod ( ' + len + '))';
			case ':':
				a += ' + 1';
				b += ' + 1'; 
				include = '(' + b + ' < ' + a + ' and (' + pos + ' >= ' + a + ' or ' + pos + ' <= ' + b + ')) or (' + pos + ' >= ' + a + ' and ' + pos + ' <= ' + b + ')';
			break;
			default: include = (a + ' + 1');
		}
		return '[' + include + ']';
	},
	
	filter: function(el, argument, i, all){
		var include = false;
		var len = all.length;
		var a = argument.a + ((argument.a < 0) ? len : 0);
		var b = argument.b + ((argument.b < 0) ? len : 0);	
		switch (argument.special){
			case '-':
				b = (a - b) % len;
				include = (b < 0) ? (i <= (a - 1) || i >= (b + len)) : (i <= a && i >= b);
			break;
			case '+': b = (b + a) % len;
			case ':': include = (b < a) ? (i >= a || i <= b) : (i >= a && i <= b); break;
			default: include = (all[a] == el);
		}		
		return include;
	}
};