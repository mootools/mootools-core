/*
Script: Selectors.Pseudo.js
	Adds CSS3 and other custom pseudo selectors support for selecting elements.

License:
	MIT-style license.

See Also:
	<http://www.w3.org/TR/2005/WD-css3-selectors-20051215/#pseudo-classes>
*/

Selectors.Pseudo.enabled = {

	xpath: function(){
		return '[not(@disabled)]';
	},

	filter: function(){
		return !(this.disabled);
	}
};


Selectors.Pseudo.empty = {

	xpath: function(){
		return '[not(node())]';
	},

	filter: function(){
		return !(this.innerText || this.textContent || '').length;
	}

};


Selectors.Pseudo.contains = {

	xpath: function(argument){
		return '[contains(text(), "' + argument + '")]';
	},

	filter: function(argument){
		for (var i = this.childNodes.length; i--; i){
			var child = this.childNodes[i];
			if (child.nodeName && child.nodeType == 3 && child.nodeValue.contains(argument)) return true;
		}
		return false;
	}

};

Selectors.Pseudo.nth = {

	parser: function(argument){
		argument = (argument) ? argument.match(/^([+-]?\d*)?([devon]+)?([+-]?\d*)?$/) : [null, 1, 'n', 0];
		if (!argument) return false;
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

	filter: function(argument, Local){
		var count = 0, el = this;
		switch (argument.special){
			case 'n':
				Local.Positions = Local.Positions || {};
				if (!Local.Positions[this.uid]){
					var children = this.parentNode.childNodes;
					for (var i = 0, l = children.length; i < l; i++){
						var child = children[i];
						if (child.nodeType != 1) continue;
						child.uid = child.uid || [Native.UID++];
						Local.Positions[child.uid] = count++;
					}
				}
				return (Local.Positions[this.uid] % argument.a == argument.b);
			case 'last':
				while ((el = el.nextSibling)){
					if (el.nodeType == 1) return false;
				}
				return true;
			case 'only':
				var prev = el;
				while((prev = prev.previousSibling)){
					if (prev.nodeType == 1) return false;
				}
				var next = el;
				while ((next = next.nextSibling)){
					if (next.nodeType == 1) return false;
				}
				return true;
			case 'index':
				while ((el = el.previousSibling)){
					if (el.nodeType == 1 && ++count > argument.a) return false;
				}
				return true;
		}
		return false;
	}

};

Selectors.Pseudo.extend({

	'even': {
		parser: function(){
			return {'a': 2, 'b': 1, 'special': 'n'};
		},
		xpath: Selectors.Pseudo.nth.xpath,
		filter: Selectors.Pseudo.nth.filter
	},

	'odd': {
		parser: function(){
			return {'a': 2, 'b': 0, 'special': 'n'};
		},
		xpath: Selectors.Pseudo.nth.xpath,
		filter: Selectors.Pseudo.nth.filter
	},

	'first': {
		parser: function(){
			return {'a': 0, 'special': 'index'};
		},
		xpath: Selectors.Pseudo.nth.xpath,
		filter: Selectors.Pseudo.nth.filter
	},

	'last': {
		parser: function(){
			return {'special': 'last'};
		},
		xpath: Selectors.Pseudo.nth.xpath,
		filter: Selectors.Pseudo.nth.filter
	},

	'only': {
		parser: function(){
			return {'special': 'only'};
		},
		xpath: Selectors.Pseudo.nth.xpath,
		filter: Selectors.Pseudo.nth.filter
	}

});
