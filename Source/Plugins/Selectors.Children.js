/*
Script: Selectors.Children.js
	custom :children() pseudo selecor

License:
	MIT-style license.
*/

/*
Selector: children
	A custom Pseudo Selector for selecting ranges, and to access the children Elements with zero-based indexing.

Usage:
	Index Accessor:
		>':children(n)'

		Variables:
			n - (number) An index number to access from the Element's children. The index, n, can be negative to access from the end of the children list.

		Examples:
			[html]
				<ul id="myID">
					<li>0</li><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li>
				</ul>
			[/html]
			[javascript]
				$$('#myID:children(2)')[0].innerHTML //returns 2
			[/javascript]

			[javascript]
				$$('#myID:children(-3)')[0].innerHTML //returns 3
			[/javascript]

	Range:
		>':children(from:to)'

		Variables:
			from - (number) A starting index value. See the Index Accessor usage.
			to   - (number) A ending index value.

		Examples:
			[html]
				<ul id="myID">
					<li>0</li><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li>
				</ul>
			[/html]

			[javascript]
				$$('#myID:children(2:4)').map(function(){ return this.innerHTML }); //returns [2,3,4]
			[/javascript]

			[javascript]
				$$('#myID:children(-2:4)').map(function(){ return this.innerHTML }); //returns [4]
			[/javascript]

			[javascript]
				$$('#myID:children(0:-3)').map(function(){ return this.innerHTML }); //returns [0,1,2,3]
			[/javascript]

	n-Right-of Operation:
		>':children(start+n)'

		Variables:
			start - (number) A starting index value. See the Index Accessor usage.
			n     - (number) The number of Elements to the right of the starting Element. The number of Elements, n, may not be negative, however, in this usage.

		Examples:
			[html]
				<ul id="myID">
					<li>0</li><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li>
				</ul>
			[/html]

			[javascript]
				$$('#myID:children(2+2)').map(function(){ return this.innerHTML }); //returns [2,3,4]
			[/javascript]

			[javascript]
				$$('#myID:children(2+4))').map(function(){ return this.innerHTML }); //returns [0,2,3,4,5]
			[/javascript]

			[javascript]
				$$('#myID:children(-1+3))').map(function(){ return this.innerHTML }); //returns [0,1,2,5]
			[/javascript]

	n-Left-of Operation:
		>':children(start-n)'

		Variables:
			start - (number) A starting index value. See the Index Accessor usage.
			n     - (number) The number of Elements to the left of the starting Element. The number of Elements, n, may not be negative, however, in this usage.

		Examples:
			[html]
				<ul id="myID">
					<li>0</li><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li>
				</ul>
			[/html]

			[javascript]
				$$('#myID:children(2-2)').map(function(){ return this.innerHTML }); //returns [0,1,2]
			[/javascript]

			[javascript]
				$$('#myID:children(2-4))').map(function(){ return this.innerHTML }); //returns [0,1,2,4,5]
			[/javascript]

			[javascript]
				$$('#myID:children(-1-3))').map(function(){ return this.innerHTML }); //returns [2,3,4,5]
			[/javascript]

Note:
	- The n-right-of and the n-left-of usaged will "wrap" until the 'n' number of Elements have been matched.
	- All "range" results will be ordered from least to greatest (relative to their indexes).`
*/

Selectors.Pseudo.children = {

	parser: function(argument){
		argument = (argument) ? argument.match(/^([-+]?\d*)?([\-+:])?([-+]?\d*)?$/) : [null, 0, false, 0];
		if (!argument) return false;
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
