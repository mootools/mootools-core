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
		argument = (argument) ? argument.match(/^([+-]?\d*)?([nodev]+)?([+-]?\d*)?$/) : [null, 1, 'n', 0];
		if (!argument) throw new Error('bad :nth pseudo selector arguments');
		var inta = parseInt(argument[1]);
		var a = ($chk(inta)) ? inta : 1;
		var special = argument[2] || false;
		var b = parseInt(argument[3]) || 0;
		b = b - 1;
		while (b < 1) b += a;
		while (b >= a) b -= a;
		switch (special){
			case 'n': return {'a': a, 'b': b, 'special': 'n'};
			case 'odd': return {'a': 2, 'b': 0, 'special': 'n'};
			case 'even': return {'a': 2, 'b': 1, 'special': 'n'};
			case 'first': return {'a': 0, 'special': 'index'};
			case 'last': return {'special': 'last'};
			case 'only': return {'special': 'only'};
			default: return {'a': (a - 1), 'special': 'index'};
		}
	},
	
	xpath: function(argument){
		switch (argument.special){
			case 'n': return '[count(preceding-sibling::*) mod ' + argument.a + ' = ' + argument.b + ']';
			case 'last': return '[count(following-sibling::*) = 0]';
			case 'only': return '[not(preceding-sibling::* or following-sibling::*)]';
			default: return '[count(preceding-sibling::*) = ' + argument.a + ']';
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
		switch (argument.special){
			case 'n': if (parent.$children.indexOf(el) % argument.a == argument.b) include = true; break;
			case 'last': if (parent.$children.getLast() == el) include = true; break;
			case 'only': if (parent.$children.length == 1) include = true; break;
			case 'index': if (parent.$children[argument.a] == el) include = true;
		}
		if (i == all.length - 1){
			for (var j = 0, l = temp.parents.length; j < l; j++){
				temp.parents[j].$children = null;
				if (Client.Engine.ie) temp.parents[j].removeAttribute('$children');
			}
		}
		return include;
	}

};

Selectors.Pseudo.extend({
	
	'even': {
		'parser': {'a': 2, 'b': 1, 'special': 'n'},
		'xpath': Selectors.Pseudo.nth.xpath,
		'filter': Selectors.Pseudo.nth.filter
	},
	
	'odd': {
		'parser': {'a': 2, 'b': 0, 'special': 'n'},
		'xpath': Selectors.Pseudo.nth.xpath,
		'filter': Selectors.Pseudo.nth.filter
	},
	
	'first': {
		'parser': {'a': 0, 'special': 'index'},
		'xpath': Selectors.Pseudo.nth.xpath,
		'filter': Selectors.Pseudo.nth.filter
	},
	
	'last': {
		'parser': {'special': 'last'},
		'xpath': Selectors.Pseudo.nth.xpath,
		'filter': Selectors.Pseudo.nth.filter
	},
	
	'only': {
		'parser': {'special': 'only'},
		'xpath': Selectors.Pseudo.nth.xpath,
		'filter': Selectors.Pseudo.nth.filter
	}

});