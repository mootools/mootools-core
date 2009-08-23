/*
Script: Slick.js
	The new, superfast css selector engine.

License:
	MIT-style license.

Authors:
	Thomas Aylott, Valerio Proietti
*/

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
		if (node){
			while ((node = node.parentNode)){
				if (node === context) return true;
			}
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

	local.pushArray = function(node, tag, id, selector, classes, attributes, pseudos){
		if (this['match:selector'](node, tag, id, selector, classes, attributes, pseudos)) this.found.push(node);
	};

	local.pushUID = function(node, tag, id, selector, classes, attributes, pseudos){
		var uid = this.uidOf(node);
		if (!this.uniques[uid] && this['match:selector'](node, tag, id, selector, classes, attributes, pseudos)){
			this.uniques[uid] = true;
			this.found.push(node);
		}
	};

	var matchers = {

		node: function(node, selector){
			var parsed = this.Slick.parse(selector).expressions[0][0];
			if (!parsed) return true;
			return this['match:selector'](node, parsed.tag.toUpperCase(), parsed.id, parsed.parts);
		},

		pseudo: function(node, name, argument){
			var pseudoName = 'pseudo:' + name;
			if (this[pseudoName]) return this[pseudoName](node, argument);
			var attribute = this.getAttribute(node, name);
			return (argument) ? argument == attribute : !!attribute;
		},

		selector: function(node, tag, id, parts, classes, attributes, pseudos){
			if (tag && tag != '*' && (!node.tagName || node.tagName != tag)) return false;
			if (id && node.id != id) return false;

			for (var i = 0, l = parts.length; i < l; i++){
				var part = parts[i];
				switch (part.type){
					case 'class': if (classes !== false && (!node.className || !part.regexp.test(node.className))) return false; break;
					case 'pseudo': if (pseudos !== false && (!this['match:pseudo'](node, part.key, part.value))) return false; break;
					case 'attribute': if (attributes !== false && (!part.test(this.getAttribute(node, part.key)))) return false; break;
				}
			}

			return true;
		}

	};

	for (var m in matchers) local['match:' + m] = matchers[m];

	var combinators = {

		' ': function(node, tag, id, parts, classes){ // all child nodes, any level
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

			if (node.getElementsByClassName && classes){
				children = node.getElementsByClassName(classes.join(' '));
				for (var j = 0, k = children.length; j < k; j++) this.push(children[j], tag, id, parts, false);
				return;
			}

			children = node.getElementsByTagName(tag);
			for (var i = 0, l = children.length; i < l; i++) this.push(children[i], null, id, parts);
		},

		'!': function(node, tag, id, parts){  // all parent nodes up to document
			while ((node = node.parentNode)){
				if (node !== document) this.push(node, tag, id, parts);
			}
		},

		'>': function(node, tag, id, parts){ // direct children
			if ((node = node.firstChild)) do {
				if (node.nodeType == 1) this.push(node, tag, id, parts);
			} while ((node = node.nextSibling));
		},

		'!>': function(node, tag, id, parts){ // direct parent (one level)
			node = node.parentNode;
			if (node !== document) this.push(node, tag, id, parts);
		},

		'+': function(node, tag, id, parts){ // next sibling
			while ((node = node.nextSibling)){
				if (node.nodeType == 1){
					this.push(node, tag, id, parts);
					break;
				}
			}
		},

		'!+': function(node, tag, id, parts){ // previous sibling
			while ((node = node.previousSibling)){
				if (node.nodeType == 1){
					this.push(node, tag, id, parts);
					break;
				}
			}
		},

		'^': function(node, tag, id, parts){ // first child
			node = node.firstChild;
			if (node){
				if (node.nodeType == 1) this.push(node, tag, id, parts);
				else this['combinator:+>'](node, tag, id, parts);
			}
		},

		'!^': function(node, tag, id, parts){ // last child
			node = node.lastChild;
			if (node){
				if (node.nodeType == 1) this.push(node, tag, id, parts);
				else this['combinator:<+'](node, tag, id, parts);
			}
		},

		'~': function(node, tag, id, parts){ // next siblings
			while ((node = node.nextSibling)){
				if (node.nodeType != 1) continue;
				var uid = this.uidOf(node);
				if (this.localUniques[uid]) break;
				this.localUniques[uid] = true;
				this.push(node, tag, id, parts);
			}
		},

		'!~': function(node, tag, id, parts){ // previous siblings
			while ((node = node.previousSibling)){
				if (node.nodeType != 1) continue;
				var uid = this.uidOf(node);
				if (this.localUniques[uid]) break;
				this.localUniques[uid] = true;
				this.push(node, tag, id, parts);
			}
		},

		'++': function(node, tag, id, parts){ // next sibling and previous sibling
			this['combinator:+'](node, tag, id, parts);
			this['combinator:!+'](node, tag, id, parts);
		},

		'~~': function(node, tag, id, parts){ // next siblings and previous siblings
			this['combinator:~'](node, tag, id, parts);
			this['combinator:!~'](node, tag, id, parts);
		}

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

	// Slick

	this.Slick = function(context, expression, append){

		if (!append) append = [];

		var parsed;

		if (expression == null){
			return append;
		} else if (typeof expression == 'string'){
			parsed = Slick.parse(expression);
			if (!parsed.length) return append;
		} else if (expression.Slick){
			parsed = expression;
		} else if (local.contains(context, expression)){
			append.push(expression);
			return append;
		} else {
			return append;
		}

		local.positions = {};

		var current;

		// querySelectorAll for simple selectors

		if (parsed.simple && context.querySelectorAll && !Slick.disableQSA){
			var nodes;
			try { nodes = context.querySelectorAll(expression); }
			catch(error) { if (Slick.debug) Slick.debug('QSA Fail ' + expression, error); };

			if (nodes){
				for (var e = 0, l = nodes.length; e < l; e++) append.push(nodes[e]);
				return append;
			}
		}

		var tempUniques = {};
		var expressions = parsed.expressions;

		local.push = (parsed.length == 1 && expressions[0].length == 1) ? local.pushArray : local.pushUID;

		for (var i = 0; i < expressions.length; i++){

			var currentExpression = expressions[i];

			for (var j = 0; j < currentExpression.length; j++){
				var currentBit = currentExpression[j];

				var combinator = 'combinator:' + currentBit.combinator;

				var tag = currentBit.tag.toUpperCase();
				var id = currentBit.id;
				var parts = currentBit.parts;
				var classes = currentBit.classes;
				var attributes = currentBit.attributes;
				var pseudos = currentBit.pseudos;

				local.localUniques = {};

				if (j === (currentExpression.length - 1)){
					local.uniques = tempUniques;
					local.found = append;
				} else {
					local.uniques = {};
					local.found = [];
				}

				if (j == 0){
					local[combinator](context, tag, id, parts, classes, attributes, pseudos);
				} else {
					var items = current;
					if (local[combinator])
						for (var m = 0, n = items.length; m < n; m++) local[combinator](items[m], tag, id, parts, classes, attributes, pseudos);
					else
						if (Slick.debug) Slick.debug("Tried calling non-existant combinator: '"+currentBit.combinator+"'", currentExpression);
				}

				current = local.found;

			}
		}

		return append;

	};

	local.Slick = Slick;

	// Slick contains

	Slick.contains = local.contains;

	// add pseudos

	Slick.definePseudo = function(name, fn){
		local['pseudo:' + name] = function(node, argument){
			return fn.call(node, argument);
		};
		return this;
	};

	Slick.lookupPseudo = function(name){
		var pseudo = local['pseudo:' + name];
		if (pseudo) return function(argument){
			return pseudo.call(this, argument);
		};
	};

	local.attributeMethods = {};

	Slick.lookupAttribute = function(name){
		return local.attributeMethods[name] || null;
	};

	Slick.defineAttribute = function(name, fn){
		local.attributeMethods[name] = fn;
		return this;
	};

	Slick.defineAttribute('class', function(){
		return this.className;
	});

	local.getAttribute = function(node, name){
		var method = this.attributeMethods[name];
		return (method) ? method.call(node) : node.getAttribute(name, 2);
	};

	// matcher

	Slick.match = function(node, selector){
		if (!selector || selector === node) return true;
		local.positions = {};
		return local['match:node'](node, selector);
	};

	// Slick.reverseMatch = function(node, selector){

		// var selector = Slick.reverse(selector);

		// return Slick(node, );
	// };

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

// parser

(function(){

	Slick.parse = function(expression){
		return parse(expression);
	};

	Slick.reverse = function(expression){
		return parse((typeof expression == 'string') ? expression : expression.raw, true);
	};

	var parsed, separatorIndex, combinatorIndex, partIndex, reversed, cache = {}, reverseCache = {};

	var parse = function(expression, isReversed){
		reversed = !!isReversed;
		var currentCache = (reversed) ? reverseCache : cache;
		if (currentCache[expression]) return currentCache[expression];
		var exp = expression;
		parsed = {Slick: true, simple: true, expressions: [], raw: expression, reverse: function(){
			return parse(this.raw, true);
		}};
		separatorIndex = -1;
		while (exp != (exp = exp.replace(regexp, parser)));
		parsed.length = parsed.expressions.length;
		return currentCache[expression] = (reversed) ? reverse(parsed) : parsed;
	};

	var reverseCombinator = function(combinator){
		if (combinator == '!') return ' ';
		else if (combinator == ' ') return '!';
		else if ((/^!/).test(combinator)) return combinator.replace(/^(!)/, '');
		else return '!' + combinator;
	};

	var reverse = function(expression){
		var expressions = expression.expressions;
		for (var i = 0; i < expressions.length; i++){
			var exp = expressions[i];
			var last = {parts: [], tag: '*', combinator: reverseCombinator(exp[0].combinator)};

			for (var j = 0; j < exp.length; j++){
				var cexp = exp[j];
				if (!cexp.reverseCombinator) cexp.reverseCombinator = ' ';
				cexp.combinator = cexp.reverseCombinator;
				delete cexp.reverseCombinator;
			}

			exp.reverse().push(last);
		}
		return expression;
	};

	var escapeRegExp = function(string){ // Credit: XRegExp 0.6.1 (c) 2007-2008 Steven Levithan <http://stevenlevithan.com/regex/xregexp/> MIT License
		return string.replace(/[-[\]{}()*+?.\\^$|,#\s]/g, "\\$&");
	};

	Slick.parse.escapeRegExp = escapeRegExp;

	Slick.parse.getCombinators = function(){
		return combinatorChars.split('');
	};

	Slick.parse.setCombinators = function(combinators){
		combinatorChars = escapeRegExp(combinators.join(''));
		regexp = new RegExp(("(?x)\
			^(?:\n\
			  \\s+ $                                        # End                    \n\
			| \\s* ( , ) \\s*                               # Separator              \n\
			| \\s* ( [" + combinatorChars + "]+ ) \\s*      # Combinator             \n\
			|      ( \\s+ )                                 # CombinatorChildren     \n\
			|      ( [a-z0-9_-]+ | \\* )                    # Tag                    \n\
			| \\#  ( [a-z0-9_-]+       )                    # ID                     \n\
			| \\.  ( [a-z0-9_-]+       )                    # ClassName              \n\
			| \\[  ( [a-z0-9_-]+       )(?: ([*^$!~|]?=) (?: \"([^\"]*)\" | '([^']*)' | ([^\\]]*) )     )?  \\](?!\\]) # Attribute \n\
			|   :+ ( [a-z0-9_-]+       )(            \\( (?: \"([^\"]*)\" | '([^']*)' | ([^\\)]*) ) \\) )?             # Pseudo    \n\
		)").replace(/\(\?x\)|\s+#.*$|\s+/gim, ''), 'i');

		return Slick.parse;
	};

	var qsaCombinators = (/^(\s|[~+>])$/);

	var combinatorChars = ">+~" + "`!@$%^&={}\\;</";

	var regexp;
	Slick.parse.setCombinators(combinatorChars.split(''));

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
			parsed.expressions[++separatorIndex] = [];
			combinatorIndex = -1;
			if (isSeparator) return '';
		}

		var isCombinator = (selectorBitName == 'combinator') || (selectorBitName == 'combinatorChildren');

		if (isCombinator || combinatorIndex == -1){
			var combinator = a[map.combinator] || ' ';
			if (parsed.simple && !qsaCombinators.test(combinator)) parsed.simple = false;
			var currentSeparator = parsed.expressions[separatorIndex];
			if (reversed){
				if (currentSeparator[combinatorIndex]) currentSeparator[combinatorIndex].reverseCombinator = reverseCombinator(combinator);
			}
			currentSeparator[++combinatorIndex] = {combinator: combinator, tag: '*', id: null, parts: []};
			partIndex = 0;
			if (isCombinator) return '';
		}

		var currentParsed = parsed.expressions[separatorIndex][combinatorIndex];

		switch (selectorBitName){

			case 'tagName':
				currentParsed.tag = a[map.tagName];
			return '';

			case 'id':
				currentParsed.id = a[map.id];
			return '';

			case 'className':

				var className = a[map.className];

				if (!currentParsed.classes) currentParsed.classes = [className];
				else currentParsed.classes.push(className);

				currentParsed.parts[partIndex] = {
					type: 'class',
					value: className,
					regexp: new RegExp('(^|\\s)' + escapeRegExp(className) + '(\\s|$)')
				};

			break;

			case 'pseudoClass':

				parsed.simple = false;

				if (!currentParsed.pseudos) currentParsed.pseudos = [];

				currentParsed.pseudos.push(currentParsed.parts[partIndex] = {
					type: 'pseudo',
					key: a[map.pseudoClass],
					value: a[map.pseudoClassValueDouble] || a[map.pseudoClassValueSingle] || a[map.pseudoClassValue]
				});

			break;

			case 'attributeKey':
				parsed.simple = false;

				if (!currentParsed.attributes) currentParsed.attributes = [];

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
						return value.indexOf(attribute) > -1;
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

				currentParsed.attributes.push(currentParsed.parts[partIndex] = {
					type: 'attribute',
					key: key,
					operator: operator,
					value: attribute,
					test: test
				});

			break;

		}

		partIndex++;
		return '';
	};

})();

document.search = function(expression){
	return Slick(document, expression);
};