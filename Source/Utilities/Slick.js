/*=
name: Slick
description: Target html nodes using css syntax.
=*/

(function(){
	
	var local = {};
	
	local.cacheNTH = {};
	
	local.uidx = 1;

	local.uidOf = (window.ActiveXObject) ? function(node){
		return (node._slickUID || (node._slickUID = [this.uidx++]))[0];
	} : function(node){
		return node._slickUID || (node._slickUID = this.uidx++);
	};
	
	local.contains = (document.documentElement.contains) ? function(context, node){
		return (context !== node && context.contains(node));
	} : (document.documentElement.compareDocumentPosition) ? function(context, node){
		return !!(context.compareDocumentPosition(node) & 16);
	} : function(context, node){
		var nodes = context.getElementsByTagName(node.tagName);
		for (var i = 0, l = nodes.length; i < l; i++){
			if (nodes[i] === node) return true;
		}
		return false;
	};
	
	local.parseNTHArgument = function(argument){
		var parsed = argument.match(/^([+-]?\d*)?([a-z]+)?([+-]?\d*)?$/);
		if (!parsed) return false;
		var inta = parseInt(parsed[1], 10);
		var a = (inta || inta === 0) ? inta : 1;
		var special = parsed[2] || false;
		var b = parseInt(parsed[3], 10) || 0;
		if (a != 0){
			b--;
			while (b < 1) b += a;
			while (b >= a) b -= a;
		} else {
			a = b;
			special = 'index';
		}
		switch (special){
			case 'n': parsed = {a: a, b: b, special: 'n'}; break;
			case 'odd': parsed = {a: 2, b: 0, special: 'n'}; break;
			case 'even': parsed = {a: 2, b: 1, special: 'n'}; break;
			case 'first': parsed = {a: 0, special: 'index'}; break;
			case 'last': parsed = {special: 'last-child'}; break;
			case 'only': parsed = {special: 'only-child'}; break;
			default: parsed = {a: (a - 1), special: 'index'};
		}

		return this.cacheNTH[argument] = parsed;
	};
	
	local.pushArray = function(node, tag, id, selector){
		if (this['match:selector'](node, tag, id, selector)) this.found.push(node);
	};
	
	local.pushUID = function(node, tag, id, selector){
		var uid = this.uidOf(node);
		if (!this.uniques[uid] && this['match:selector'](node, tag, id, selector)){
			this.uniques[uid] = true;
			this.found.push(node);
		}
	};
	
	var matchers = {
		
		node: function(node, selector){
			var parsed = this.Slick.parse(selector)[0][0];
			return this['match:selector'](node, parsed.tag, parsed.id, parsed.parts);
		},

		pseudo: function(node, name, argument){
			var pseudoName = 'pseudo:' + name;
			if (this[pseudoName]) return this[pseudoName](node, argument);
			var attribute = this.Slick.getAttribute(node, name);
			return (argument) ? argument == attribute : !!attribute;
		},

		selector: function(node, tag, id, parts){
			if (tag && tag != '*' && (!node.tagName || node.tagName.toLowerCase() != tag)) return false;
			if (id && node.id != id) return false;

			for (var i = 0, l = parts.length; i < l; i++){
				var part = parts[i];
				switch (part.type){
					case 'class': if (!node.className || !part.regexp.test(node.className)) return false; break;
					case 'pseudo': if (!this['match:pseudo'](node, part.key, part.value)) return false; break;
					case 'attribute': if (!part.test(this.Slick.getAttribute(node, part.key))) return false; break;
				}
			}

			return true;
		}

	};
	
	for (var m in matchers) local['match:' + m] = matchers[m];
	
	var combinators = {

		'>>': function(node, tag, id, parts){ // all child nodes, any level
			if (id){
				var item;
				if (node.getElementById){
					item = node.getElementById(id);
					if (item) this.push(item, tag, null, parts);
					return;
				} else if ((node === document.documentElement) || this.contains(document.documentElement, node)){
					item = document.getElementById(id);
					if (item && this.contains(node, item)) this.push(item, tag, null, parts);
					return;
				}
			}
			
			var children;
			
			if (node.getElementsByClassName && parts.length == 1 && parts[0].type == 'class'){
				children = node.getElementsByClassName(parts[0].value);
				for (var j = 0, k = children.length; j < k; j++) this.push(children[j], tag, id, []);
				return;
			}

			children = node.getElementsByTagName(tag);
			for (var i = 0, l = children.length; i < l; i++) this.push(children[i], null, id, parts);
		},
		
		'<<': function(node, tag, id, parts){  // all parent nodes up to document
			while ((node = node.parentNode)){
				if (node != document) this.push(node, tag, id, parts);
			}
		},

		'>': function(node, tag, id, parts){ // direct children
			var children = node.getElementsByTagName(tag);
			for (var i = 0, l = children.length; i < l; i++){
				var child = children[i];
				if (child.parentNode === node) this.push(child, null, id, parts);
			}
		},
		
		'<': function(node, tag, id, parts){}, // direct parent (one level)

		'+>': function(node, tag, id, parts){ // next sibling
			while ((node = node.nextSibling)){
				if (node.nodeType === 1){
					this.push(node, tag, id, parts);
					break;
				}
			}
		},

		'<+': function(node, tag, id, parts){  // previous sibling
			while ((node = node.previousSibling)){
				if (node.nodeType === 1){
					this.push(node, tag, id, parts);
					break;
				}
			}
		},

		'^': function(node, tag, id, parts){ // first child
			node = node.firstChild;
			if (node){
				if (node.nodeType === 1) this.push(node, tag, id, parts);
				else this['combinator:+>'](node, tag, id, parts);
			}
		},

		'$': function(node, tag, id, parts){  // last child
			node = node.lastChild;
			if (node){
				if (node.nodeType === 1) this.push(node, tag, id, parts);
				else this['combinator:<+'](node, tag, id, parts);
			}
		},

		'~>': function(node, tag, id, parts){  // next siblings
			while ((node = node.nextSibling)){
				if (node.nodeType !== 1) continue;
				var uid = this.uidOf(node);
				if (this.localUniques[uid]) break;
				this.localUniques[uid] = true;
				this.push(node, tag, id, parts);
			}
		},

		'<~': function(node, tag, id, parts){ // previous siblings
			while ((node = node.previousSibling)){
				if (node.nodeType !== 1) continue;
				var uid = this.uidOf(node);
				if (this.localUniques[uid]) break;
				this.localUniques[uid] = true;
				this.push(node, tag, id, parts);
			}
		},

		'~~': function(node, tag, id, parts){}, // next siblings and previous siblings
		
		'++': function(node, tag, id, parts){} // next sibling and previous sibling

	};
	
	for (var c in combinators) local['combinator:' + c] = combinators[c];
	
	var pseudos = {

		'checked': function(node){
			return node.checked;
		},

		'empty': function(node){
			return !(node.innerText || node.textContent || '').length;
		},

		'not': function(node, expression){
			return !this['match:node'](node, expression);
		},

		'contains': function(node, text){
			var inner = node.innerText || node.textContent || '';
			return (inner) ? inner.indexOf(text) > -1 : false;
		},

		'first-child': function(node){
			return this['pseudo:index'](node, 0);
		},

		'last-child': function(node){
			while ((node = node.nextSibling)){
				if (node.nodeType === 1) return false;
			}
			return true;
		},

		'only-child': function(node){
			var prev = node;
			while ((prev = prev.previousSibling)){
				if (prev.nodeType === 1) return false;
			}
			var next = node;
			while ((next = next.nextSibling)){
				if (next.nodeType === 1) return false;
			}
			return true;
		},

		'nth-child': function(node, argument){
			argument = (!argument) ? 'n' : argument;
			var parsed = this.cacheNTH[argument] || this.parseNTHArgument(argument);
			if (parsed.special != 'n') return this['pseudo:' + parsed.special](node, argument);
			if (parsed.a === 1 && parsed.b === 0) return true;
			var count = 0, uid = this.uidOf(node);
			if (!this.positions[uid]){
				while ((node = node.previousSibling)){
					if (node.nodeType !== 1) continue;
					count ++;
					var uis = this.uidOf(node);
					var position = this.positions[uis];
					if (position != null){
						count = position + count;
						break;
					}
				}
				this.positions[uid] = count;
			}
			return (this.positions[uid] % parsed.a === parsed.b);
		},

		// custom pseudos

		'index': function(node, index){
			var count = 0;
			while ((node = node.previousSibling)){
				if (node.nodeType === 1 && ++count > index) return false;
			}
			return (count === index);
		},

		'even': function(node, argument){
			return this['pseudo:nth-child'](node, '2n+1');
		},

		'odd': function(node, argument){
			return this['pseudo:nth-child'](node, '2n');
		}

	};
	
	for (var p in pseudos) local['pseudo:' + p] = pseudos[p];
	
	var combinatorMap = {' ': '>>', '+': '+>', '~': '~>'};
	
	// Slick
	
	this.Slick = function(context, expression, append){
		
		local.inSlick = true;
		
		if (!append) append = [];
		
		if (expression == null) return append;
		
		if (typeof expression != 'string' && Slick.contains(context, expression)){
			append.push(expression);
			return append;
		}
		
		local.positions = {};

		var current;
		var parsed = Slick.parse(expression);
		var tempUniques = {};

		local.push = (parsed.length == 1 && parsed[0].length == 1) ? local.pushArray : local.pushUID;

		for (var i = 0; i < parsed.length; i++){
			
			var currentSelector = parsed[i];
			
			for (var j = 0; j < currentSelector.length; j++){
				var currentBit = currentSelector[j];
				
				var combinator = currentBit.combinator;
				var alias = combinatorMap[combinator];
				if (alias) combinator = alias;
				combinator = 'combinator:' + combinator;

				var tag = currentBit.tag;
				var id = currentBit.id;
				var parts = currentBit.parts;
				
				local.localUniques = {};
				
				if (j === (currentSelector.length - 1)){
					local.uniques = tempUniques;
					local.found = append;
				} else {
					local.uniques = {};
					local.found = [];
				}
				
				if (j == 0){
					local[combinator](context, tag, id, parts);
				} else {
					var items = current;
					for (var m = 0, n = items.length; m < n; m++) local[combinator](items[m], tag, id, parts);
				}
				
				current = local.found;

			}
		}

		local.inSlick = false;
		return append;

	};
	
	local.Slick = Slick;
	
	// Slick contains
	
	Slick.contains = local.contains;
	
	// add pseudo
	
	Slick.definePseudo = function(name, fn){
		local['pseudo:' + name] = function(node, argument){
			return fn.call(node, argument);
		};
		return this;
	};
	
	// add combinator function
	
	Slick.defineCombinator = function(name, fn){
		local['combinator:' + name] = function(node, tag, id, parts){
			var nodes = fn.call(node);
			if (!nodes || !nodes.length) return;
			for (var i = 0, l = nodes.length; i < l; i++) push(nodes[i], tag, id, parts);
		};
		return this;
	};
	
	// default getAttribute (override this please)
	
	Slick.getAttribute = function(node, name){
		return (name == 'class') ? node.className : node.getAttribute(name);
	};
	
	// matcher
	
	Slick.match = function(node, selector){
		if (!selector || selector === node) return true;
		local.positions = {};
		return local['match:node'](node, selector);
	};
	
	Slick.uniques = function(nodes, append){
		var uniques = {};
		if (!append) append = [];
		for (var i = 0, l = nodes.length; i < l; i++){
			var node = nodes[i], uid = uidOf(node);
			if (!uniques[uid]){
				uniques[uid] = true;
				append.push(node);
			}
		}
		return append;
	};

})();

// > direct children
// < direct parent

// >> all children (aka ' ')
// << all parents

// ~> next siblings (aka '~')
// <~ previous siblings

// +> next sibling (aka '+')
// <+ previous sibling

// ^ first child
// $ last child

// ~~ nexts and previouses brothers
// ++ next and previous brothers

// possible combinators?

// ~> // +> // => // <~ // <+ // <= // >> // << // ~~ // ++ // == // @@ // %% // ^^ // $$ // && // !! // **

// parser

(function(){

	var parsed, separatorIndex, combinatorIndex, partIndex, cache = {};

	Slick.parse = function(expression){
		if (cache[expression]) return cache[expression];
		var exp = expression;
		parsed = [];
		separatorIndex = -1;
		while (exp != (exp = exp.replace(regexp, parser)));
		return cache[expression] = parsed;
	};
	
	var escapeRegExp = function(string){ // Credit: XRegExp 0.6.1 (c) 2007-2008 Steven Levithan <http://stevenlevithan.com/regex/xregexp/> MIT License
		return string.replace(/[-[\]{}()*+?.\\^$|,#\s]/g, "\\$&");
	};
	

	var combinators = "<>*~+^$=@%&!";

	var regexp = new RegExp(("(?x)\
		^(?:\n\
		       \\s+ (?=[" + combinators + "] | $) # Meaningless Whitespace \n\
		|      ( , ) \\s*                         # Separator              \n\
		|      ( \\s  (?=[^" + combinators + "])) # CombinatorChildren     \n\
		|      ( [" + combinators + "]{1,2}) \\s* # Combinator             \n\
		|      ( [a-z0-9_-]+ | \\* )              # Tag                    \n\
		| \\#  ( [a-z0-9_-]+       )              # ID                     \n\
		| \\.  ( [a-z0-9_-]+       )              # ClassName              \n\
		| \\[  ( [a-z0-9_-]+       )(?: ([*^$!~|]?=) (?: \"([^\"]*)\" | '([^']*)' | ([^\\]]*) )     )?  \\](?!\\]) # Attribute \n\
		|   :+ ( [a-z0-9_-]+       )(            \\( (?: \"([^\"]*)\" | '([^']*)' | ([^\\)]*) ) \\) )?             # Pseudo    \n\
	)").replace(/\(\?x\)|\s+#.*$|\s+/gim, ''), 'i');

	var map = {
		rawMatch: 0,
		separator: 1,
		combinator: 2,
		combinatorChildren: 3,
	
		tagName: 4,
		id: 5,
		className: 6,
	
		attributeKey: 7,
		attributeOperator: 8,
		attributeValueDouble : 9,
		attributeValueSingle : 10,
		attributeValue: 11,

		pseudoClass: 12,
		pseudoClassArgs: 13,
		pseudoClassValueDouble : 14,
		pseudoClassValueSingle : 15,
		pseudoClassValue: 16
	};

	var rmap = {};
	for (var p in map) rmap[map[p]] = p;

	var parser = function(){
		var a = arguments;

		var selectorBitMap, selectorBitName;
	
		for (var aN = 1; aN < a.length; aN++){
			if (a[aN]){
				selectorBitMap = aN;
				selectorBitName = rmap[selectorBitMap];
				break;
			}
		}
	
		if (!selectorBitName) return '';
	
		var isSeparator = selectorBitName == 'separator';
	
		if (isSeparator || separatorIndex == -1){
			parsed[++separatorIndex] = [];
			combinatorIndex = -1;
			if (isSeparator) return '';
		}
	
		var isCombinator = (selectorBitName == 'combinator') || (selectorBitName == 'combinatorChildren');
	
		if (isCombinator || combinatorIndex == -1){
			parsed[separatorIndex][++combinatorIndex] = {combinator: a[map.combinatorChildren] || '>>', tag: '*', parts: []};
			partIndex = 0;
			if (isCombinator) return '';
		}
	
		var currentParsed = parsed[separatorIndex][combinatorIndex];
	
		switch (selectorBitName){
			
			case 'tagName':
				currentParsed.tag = a[map.tagName];
			return '';
		
			case 'id':
				currentParsed.id = a[map.id];
			return '';
		
			case 'className':

				var className = a[map.className];
				
				currentParsed.parts[partIndex] = {
					type: 'class',
					value: className,
					regexp: new RegExp('(^|\\s)' + escapeRegExp(className) + '(\\s|$)')
				};

			break;
		
			case 'pseudoClass': currentParsed.parts[partIndex] = {
				type: 'pseudo',
				key: a[map.pseudoClass],
				value: a[map.pseudoClassValueDouble] || a[map.pseudoClassValueSingle] || a[map.pseudoClassValue]
			}; break;
		
			case 'attributeKey':
				
				var key = a[map.attributeKey];
				var operator = a[map.attributeOperator];
				var attribute = a[map.attributeValueDouble] || a[map.attributeValueSingle] || a[map.attributeValue] || '';
				
				var test, regexp;
				
				switch (operator){
					case '=': test = function(value){
						return attribute == value;
					}; break;
					case '!=': test = function(value){
						return attribute != value;
					}; break;
					case '*=': test = function(value){
						return attribute.indexOf(value) > -1;
					}; break;
					case '^=': regexp = new RegExp('^' + escapeRegExp(attribute)); break;
					case '$=': regexp = new RegExp(escapeRegExp(attribute) + '$'); break;
					case '~=': regexp = new RegExp('(^|\\s)' + escapeRegExp(attribute) + '(\\s|$)'); break;
					case '|=': regexp = new RegExp('(^|\\|)' + escapeRegExp(attribute) + '(\\||$)'); break;

					default: test = function(value){
						return !!value;
					};
				}
				
				if (!test) test = function(value){
					return regexp.test(value);
				};

				currentParsed.parts[partIndex] = {
					type: 'attribute',
					key: key,
					operator: operator,
					value: attribute,
					test: test
				};

			break;

		}
	
		partIndex++;
		return '';
	};

})();

document.search = function(expression){
	return Slick(document, expression);
};
