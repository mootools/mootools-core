/*
Script: Selectors.Pseudo.js
	Some default Pseudo Selectors for <Selectors.js>

License:
	MIT-style license.

See Also:
	<http://www.w3.org/TR/2005/WD-css3-selectors-20051215/#pseudo-classes>
*/

/*
Selector: enabled
	Matches all Elements that are enabled.

Usage:
	>':enabled'

Examples:
	[javascript]
		$$('*:enabled')
	[/javascript]

	[javascript]
		$('myElement').getElementsBySelector(':enabled');
	[/javascript]
*/

Selectors.Pseudo.enabled = {

	xpath: function(){
		return '[not(@disabled)]';
	},

	filter: function(el){
		return !(el.disabled);
	}
};

/*
Selector: empty
	Matches all elements which are empty.

Usage:
	>':empty'

Example:
	[javascript]
		$$('div:empty');
	[/javascript]
*/

Selectors.Pseudo.empty = {

	xpath: function(){
		return '[not(node())]';
	},

	filter: function(el){
		return !(el.innerText || el.textContent || '').length;
	}

};

/*
Selector: contains
	Matches all the Elements which contains the text.

Usage:
	>':contains(text)'

	Variables:
		text - (string) The text that the Element should contain.

Example:
	[javascript]
		$$('p:contains("find me")');
	[/javascript]
*/

Selectors.Pseudo.contains = {

	xpath: function(argument){
		return '[contains(text(), "' + argument + '")]';
	},

	filter: function(el, argument){
		for (var i = el.childNodes.length; i--;){
			var child = el.childNodes[i];
			if (child.nodeName && child.nodeType == 3 && child.nodeValue.contains(argument)) return true;
		}
		return false;
	}

};

/*
Selector: nth
	Matches every nth child.

Usage:
	Nth Expression:
		>':nth-child(nExpression)'

		Variables:
			nExpression - (string) A nth expression for the "every" nth-child.

			Examples:
				[javascript]
					$$('#myDiv:nth-child(2n)'); //returns every odd child
				[/javascript]

				[javascript]
					$$('#myDiv:nth-child(n)'); //returns every child
				[/javascript]

				[javascript]
					$$('#myDiv:nth-child(2n+1)') //returns every even child
				[/javascript]

				[javascript]
					$$('#myDiv:nth-child(4n+3)') //returns Elements [3, 7, 11, 15, ...]
				[/javascript]

	Every Odd Child:
		>':nth-child(odd)'

	Every Even Child:
		>':nth-child(even)'

	Without -Child:
		>':nth(nExpression)'
		>':nth(odd)'
		>':nth(even)'
*/

Selectors.Pseudo.nth = {

	parser: function(argument){
		argument = (argument) ? argument.match(/^([+-]?\d*)?([nodev]+)?([+-]?\d*)?$/) : [null, 1, 'n', 0];
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
			for (var j = temp.parents.length; j--;){
				temp.parents[j].$children = null;
				if (Client.Engine.ie) temp.parents[j].removeAttribute('$children');
			}
		}
		return include;
	}

};

Selectors.Pseudo.extend({
	
	/*
	Selector: even
		Matches every even child.

	Usage:
		>':even-child'
		>':even'

	Example:
		[javascript]
			$$('td:even-child');
		[/javascript]
	*/

	'even': {
		'parser': {'a': 2, 'b': 1, 'special': 'n'},
		'xpath': Selectors.Pseudo.nth.xpath,
		'filter': Selectors.Pseudo.nth.filter
	},
	
	/*
	Selector: odd
		Matches every odd child.

	Usage:
		>':odd-child'
		>':odd'

	Example:
		[javascript]
			$$('td:odd-child');
		[/javascript]
	*/

	'odd': {
		'parser': {'a': 2, 'b': 0, 'special': 'n'},
		'xpath': Selectors.Pseudo.nth.xpath,
		'filter': Selectors.Pseudo.nth.filter
	},
	
	/*
	Selector: first
		Matches the first child.

	Usage:
		>':first-child'
		>':first'

	Example:
		[javascript]
			$$('td:first-child');
		[/javascript]
	*/

	'first': {
		'parser': {'a': 0, 'special': 'index'},
		'xpath': Selectors.Pseudo.nth.xpath,
		'filter': Selectors.Pseudo.nth.filter
	},
	
	/*
	Selector: last
		Matches the last child.

	Usage:
		>':last-child'
		>':last'

	Example:
		[javascript]
			$$('td:last-child');
		[/javascript]
	*/

	'last': {
		'parser': {'special': 'last'},
		'xpath': Selectors.Pseudo.nth.xpath,
		'filter': Selectors.Pseudo.nth.filter
	},
	
	/*
	Selector: only
		Matches only child of its parent Element.

	Usage:
		>':only-child
		>':only'

	Example:
		[javascript]
			$$('td:only-child');
		[/javascript]
	*/

	'only': {
		'parser': {'special': 'only'},
		'xpath': Selectors.Pseudo.nth.xpath,
		'filter': Selectors.Pseudo.nth.filter
	}

});