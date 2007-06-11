/*
Script: Selectors.Pseudo.js
	Some default Pseudo Selecors for <Selectors.js>

License:
	MIT-style license.
*/

Selectors.Pseudo.enabled = {

	xpath: function(){
		return '[not(@disabled)]';
	},

	filter: function(el){
		return !(el.disabled);
	}
};

Selectors.Pseudo.empty = {
	
	xpath: function(){
		return '[not(node())]';
	},
	
	filter: function(el){
		return (Element.getText(el).length === 0);
	}
	
};

Selectors.Pseudo.contains = {
	
	xpath: function(argument){
		return '[contains(text(), "' + argument + '")]';
	},
	
	filter: function(el, argument){
		for (var i = 0, l = el.childNodes.length; i < l; i++){
			var child = el.childNodes[i];
			if (child.nodeName && child.nodeType == 3 && child.nodeValue.contains(argument)) return true;
		}
		return false;
	}

};

Selectors.Pseudo.nth = {
	
	parser: function(argument){
		argument = (argument) ? argument.match(/^([+]?\d*)?([nodev]+)?([+]?\d*)?$/) : [null, 1, 'n', 2];
		if (!argument) throw new Error('bad nth pseudo selector arguments');
		var int1 = parseInt(argument[1]);
		argument[1] = ($chk(int1)) ? int1 : 1;
		argument[2] = argument[2] || false;
		argument[3] = parseInt(argument[3]) || 2;
		switch(argument[2]){
			case 'n': return {'a': argument[1], 'b': argument[3], 'special': 'n'};
			case 'odd': return {'a': 2, 'b': 1, 'special': 'n'};
			case 'even': return {'a': 2, 'b': 2, 'special': 'n'};
			case 'first': return {'a': 1, 'special': 'index'};
			case 'last': return {'special': 'last'};
			case 'only': return {'special': 'only'};
			default: return {'a': argument[1], 'special': 'index'};
		}
	},
	
	xpath: function(argument){
		switch(argument.special){
			case 'n': return '[count(preceding-sibling::*) mod ' + argument.a + ' = ' + (argument.b - 1) + ']';
			case 'last': return '[count(following-sibling::*) = 0]';
			case 'only': return '[not(preceding-sibling::* or following-sibling::*)]';
			default: return '[count(preceding-sibling::*) = ' + (argument.a - 1) + ']';
		}
	},
	
	filter: function(el, argument, i, all, temp){
		if (i == 0) temp.parents = [];
		var parent = el.parentNode;
		if (!parent.$children){
			temp.parents.push(parent);
			parent.$children = parent.$children || Array.filter(parent.childNodes, function(child){
				return (child.nodeName && child.nodeType == 1);
			});
		}
		var include = false;
		switch(argument.special){
			case 'n': if (parent.$children.indexOf(el) % argument.a == argument.b - 1) include = true; break;
			case 'last': if (parent.$children.getLast() == el) include = true; break;
			case 'only': if (parent.$children.length == 1) include = true; break;
			case 'index': if (parent.$children[argument.a - 1] == el) include = true;
		}
		if (i == all.length - 1){
			for (var j = 0, l = temp.parents.length; j < l; j++) temp.parents[j].$children = null;
		}
		return include;
	}

};

Selectors.Pseudo.extend({
	
	'odd': {
		'name': 'nth',
		'parser': {'a': 2, 'b': 1, 'special': 'n'}
	},
	
	'even': {
		'name': 'nth',
		'parser': {'a': 2, 'b': 2, 'special': 'n'}
	},
	
	'first': {
		'name': 'nth',
		'parser': {'a': 1, 'special': 'index'}
	},
	
	'last': {
		'name': 'nth',
		'parser': {'special': 'last'}
	},
	
	'only': {
		'name': 'nth',
		'parser': {'special': 'only'}
	}

});