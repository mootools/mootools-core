/*
---
name: Slick.Finder
provides: Slick.Finder
requires: Slick.Parser

description: The new, superfast css selector engine.

license: MIT-style

authors:
- Thomas Aylott
- Valerio Proietti
- Fabio M Costa
- Jan Kassens
...
*/

(function(){
	
	var exports = this;
	
	var local = {};
	
	var Slick = local.Slick = exports.Slick = exports.Slick || {};
	
	exports.Slick.version = "0.9wip";
	
	var objectPrototypeToString = Object.prototype.toString;
	
	// Feature / Bug detection

	exports.Slick.isXML = local.isXML = function(element){
		var ownerDocument = element.ownerDocument || element;
		return (!!ownerDocument.xmlVersion)
			|| (!!ownerDocument.xml)
			|| (objectPrototypeToString.call(ownerDocument) === '[object XMLDocument]')
			|| (ownerDocument.nodeType === 9 && ownerDocument.documentElement.nodeName !== 'HTML');
	};
	
	var timeStamp = +new Date();
	
	local.setDocument = function(document){
		if (local.document === document) return;
		
		if (document.nodeType === 9); // document
		else if (document.ownerDocument) document = document.ownerDocument; // node
		else if ('document' in document) document = document.document; // window
		else return false;
		
		if (local.document === document) return;
		local.document = document;
		local.root = document.documentElement;
		
		local.starSelectsClosed
		= local.starSelectsComments
		= local.starSelectsClosedQSA
		= local.idGetsName
		= local.brokenMixedCaseQSA
		= local.cachedGetElementsByClassName
		= local.brokenSecondClassNameGEBCN
		= false;
		
		if (!(local.isXMLDocument = local.isXML(document))){
			
			var testNode = document.createElement('div');
			local.root.appendChild(testNode);
			var selected, id;
			
			// IE returns comment nodes for getElementsByTagName('*') for some documents
			testNode.appendChild(document.createComment(''));
			local.starSelectsComments = (testNode.getElementsByTagName('*').length > 0);
			
			// IE returns closed nodes (EG:"</foo>") for getElementsByTagName('*') for some documents
			try {
				testNode.innerHTML = 'foo</foo>';
				selected = testNode.getElementsByTagName('*');
				local.starSelectsClosed = (selected && selected.length && selected[0].nodeName.charAt(0) == '/');
			} catch(e){};
			
			// IE 8 returns closed nodes (EG:"</foo>") for querySelectorAll('*') for some documents
			if (testNode.querySelectorAll) try {
				testNode.innerHTML = 'foo</foo>';
				selected = testNode.querySelectorAll('*');
				local.starSelectsClosedQSA = (selected && selected.length && selected[0].nodeName.charAt(0) == '/');
			} catch(e){};
			
			// IE returns elements with the name instead of just id for getElementById for some documents
			try {
				id = 'idgetsname' + timeStamp;
				testNode.innerHTML = ('<a name='+id+'></a><b id='+id+'></b>');
				local.idGetsName = testNode.ownerDocument.getElementById(id) === testNode.firstChild;
			} catch(e){};
			
			// Safari 3.2 QSA doesnt work with mixedcase on quirksmode
			try {
				testNode.innerHTML = '<a class="MiXedCaSe"></a>';
				local.brokenMixedCaseQSA = !testNode.querySelectorAll('.MiXedCaSe').length;
			} catch(e){};

			try {
				testNode.innerHTML = '<a class="f"></a><a class="b"></a>';
				testNode.getElementsByClassName('b').length;
				testNode.firstChild.className = 'b';
				local.cachedGetElementsByClassName = (testNode.getElementsByClassName('b').length != 2);
			} catch(e){};
			
			// Opera 9.6 GEBCN doesnt detects the class if its not the first one
			try {
				testNode.innerHTML = '<a class="a"></a><a class="f b a"></a>';
				local.brokenSecondClassNameGEBCN = (testNode.getElementsByClassName('a').length != 2);
			} catch(e){};
			
			local.root.removeChild(testNode);
			testNode = null;
			
		}
		
		local.activateEngines();
		
		local.collectionToArray = function(collection){
			return Array.prototype.slice.call(collection);
		};
		try {
			local.collectionToArray(local.root.childNodes);
		} catch(e){
			local.collectionToArray = function(collection){
				if (objectPrototypeToString.call(collection) === '[object Array]') return collection;
				var i = collection.length, array = new Array(i);
				while (i--) array[i] = collection[i];
				return array;
			};
		}
		
		local.setContains(local.root);
		local.setSorter(local.document);
		
	};
	
	// Custom engines
	
	local.customEngines = [];
	local.defaultCondition = function(){ return true; };
	local.dontRemoveEngine = {};
	
	local.registerEngine = function(name, fn, condition){
		fn = local['customEngine:' + fn] || fn;
		if (typeof fn !== 'function') return this;
		var customEngine = {
			name: 'customEngine:' + name,
			fn: fn,
			condition: condition || local.defaultCondition
		};
		local.customEngines.push(customEngine);
		this.activateEngine(customEngine.name, fn, customEngine.condition);
		return this;
	};
	
	local.activateEngine = function(name, fn, condition){
		if (condition){
			local[name] = fn;
			local.dontRemoveEngine[name] = true;
		} else {
			if (local[name] && !local.dontRemoveEngine[name]) delete local[name];
		}
	};
	
	local.activateEngines = function(){
		var customEngine, customEngines = local.customEngines;
		local.dontRemoveEngine = {};
		for (var i = 0; customEngine = customEngines[i++];){
			this.activateEngine(customEngine.name, customEngine.fn, customEngine.condition.call(local));
		}
	};
		
	// Init
	
	if (typeof document != 'undefined') 
		local.setDocument(document);
	
	var document = local.document;
	
	// Slick

	exports.Slick.search = local.search = function(context, expression, append, justFirst){
		
		// Multiple contexts
		if ({}.toString.call(context) == '[object Array]'){
			if (context == append) context = context.slice();
			
			if (!append) append = [];
			for (var c = 0, this_context; this_context = context[c]; c++)
				Slick.search(this_context, expression, append);
			
			if (justFirst) append = append[0] || null;
			return append;
		}

		// setup
		
		var parsed, i, found = justFirst ? null : (append || []);

		local.positions = {};

		// handle input / context:

		// No context
		if (!context) return found;

		// Convert the node from a window to a document
		if (!context.nodeType && context.document) context = context.document;

		// Reject misc junk input
		if (!context.nodeType) return found;

		// expression input
		if (typeof expression == 'string'){
			parsed = Slick.parse(expression);
			if (!parsed.length) return found;

		} else if (expression == null){
			return found;

		} else if (expression.Slick){
			parsed = expression;

		} else if (local.contains(context.documentElement || context, expression)){
			justFirst ? found = expression : found.push(expression);
			return found;

		} else {
			return found;
		}
		
		local.found = found = append || [];

		if (local.document !== (context.ownerDocument || context)) local.setDocument(context);
		var document = local.document;

		local.push = local.pushUID;
		if (!append && (justFirst || (parsed.length == 1 && parsed.expressions[0].length == 1)))
			local.push = local.pushArray;
		
		local.uniques = uniques = {};
		if (append) for (i = 0; node = append[i++];)
			uniques[!local.isXMLDocument ? node.uniqueNumber || (node.uniqueNumber = local.uidx++) : node.getAttribute(local.uidKey) || (node.setAttribute(local.uidKey, local.uidx++), node.getAttribute(local.uidKey))] = true;
		
		var shouldSort = parsed.expressions.length > 1 || (append && append.length);
		
		// custom engines
		
		customEngine: {
			var customEngineName = 'customEngine:' + (local.isXMLDocument ? 'XML:' : '') + parsed.type.join(':');
			if (!local[customEngineName]) break customEngine;
			
			local.found = [];
			if (local[customEngineName](context, parsed) !== false){
				if (justFirst && local.found.length) return local.found[0];
				if (append) found = Slick.uniques(local.found, append, local.isXMLDocument);
				else found = local.found;
				if (shouldSort) local.documentSort(found);
				return found;
			}
		}
		
		// querySelector|querySelectorAll

		QSA: if (context.querySelectorAll && !(parsed.simple === false || local.isXMLDocument || local.brokenMixedCaseQSA || Slick.disableQSA)){
			if (context.nodeType !== 9) break QSA; // FIXME: Make querySelectorAll work with a context that isn't a document
			
			var nodes;
			try {
				nodes = context[justFirst ? 'querySelector' : 'querySelectorAll'](parsed.raw);
				parsed.simple = true;
			} catch(error){
				parsed.simple = false;
				if (Slick.debug) Slick.debug('QSA Fail ' + parsed.raw, error);
			}
			
			if (justFirst){
				if (nodes || nodes == null) return nodes;
			}
			else{
				
				if (!nodes) break QSA;
				if (!append) return local.collectionToArray(nodes);
				
				// TODO: check if selectors other than '*' will return closed nodes
				if (local.starSelectsClosedQSA){
					var node;
					for (i = 0; node = nodes[i++];) if (node.nodeName.charCodeAt(0) != 47) append ? local.pushRawUID(node) : found.push(node);
				} else {
					if (append) for (i = 0, node; node = nodes[i++];) local.pushRawUID(node);
					else found.push.apply(found, local.collectionToArray(nodes));
				}
				
				if (append) found = Slick.uniques(found, append, local.isXMLDocument);
				if (shouldSort) local.documentSort(found);
				
				return found;
			}
		}

		// default engine
		
		var currentExpression, currentBit;
		var j, m, n;
		var combinator, tag, id, parts, classes, attributes, pseudos;
		var currentItems;
		var expressions = parsed.expressions;
		var lastBit;
		var tempUniques = {};
		
		search: for (i = 0; (currentExpression = expressions[i]); i++) for (j = 0; (currentBit = currentExpression[j]); j++){

			combinator = 'combinator:' + currentBit.combinator;
			if (!local[combinator]) continue search;
			
			tag        = local.isXMLDocument ? currentBit.tag : currentBit.tag.toUpperCase();
			id         = currentBit.id;
			parts      = currentBit.parts;
			classes    = currentBit.classes;
			attributes = currentBit.attributes;
			pseudos    = currentBit.pseudos;
			lastBit    = (j === (currentExpression.length - 1));
		
			local.localUniques = {};
			
			if (lastBit){
				local.uniques = uniques;
				local.found = found;
			} else {
				local.uniques = tempUniques;
				local.found = [];
			}

			if (j === 0){
				local[combinator](context, tag, id, parts, classes, attributes, pseudos);
				if (justFirst && lastBit && found.length) break search;
			} else {
				if (justFirst && lastBit) for (m = 0, n = currentItems.length; m < n; m++){
					local[combinator](currentItems[m], tag, id, parts, classes, attributes, pseudos);
					if (found.length) break search;
				}
				else for (m = 0, n = currentItems.length; m < n; m++)
					local[combinator](currentItems[m], tag, id, parts, classes, attributes, pseudos);
			}
			
			currentItems = local.found;
		}
		
		if (append) found = Slick.uniques(found, append, local.isXMLDocument);
		if (shouldSort) local.documentSort(found);
		
		return justFirst ? (found[0] || null) : found;
	};
	
	exports.Slick.find = local.find = function(context, expression){
		return Slick.search(context, expression, null, true);
	};
	
	// Utils
	
	local.uidx = 1;
	
	// FIXME: Add specs: local.contains should be different for xml and html documents?
	
	local.setContains = function(root){
		
		Slick.contains = local.contains = (root && root.contains) ? function(context, node){
			return context.contains(node);
		} : (root && root.compareDocumentPosition) ? function(context, node){
			return context === node || !!(context.compareDocumentPosition(node) & 16);
		} : function(context, node){
			if (node) do {
				if (node === context) return true;
			} while ((node = node.parentNode));
			return false;
		};
		
	};
	
	local.setContains(local.root);
	
	local.cacheNTH = {};
	
	local.matchNTH = /^([+-]?\d*)?([a-z]+)?([+-]\d+)?$/;
	
	local.parseNTHArgument = function(argument){
		var parsed = argument.match(this.matchNTH);
		if (!parsed) return false;
		var special = parsed[2] || false;
		var a = parsed[1] || 1;
		if (a == '-') a = -1;
		var b = parseInt(parsed[3], 10) || 0;
		switch (special){
			case 'n':    parsed = {a: a, b: b}; break;
			case 'odd':  parsed = {a: 2, b: 1}; break;
			case 'even': parsed = {a: 2, b: 0}; break;
			default:     parsed = {a: 0, b: a};
		}
		return (this.cacheNTH[argument] = parsed);
	};
	
	local.pushArray = function(node, tag, id, selector, classes, attributes, pseudos){
		if (this['match:selector'](node, tag, id, selector, classes, attributes, pseudos)) this.found.push(node);
	};
	
	var uniques;
	
	local.pushUID = function(node, tag, id, selector, classes, attributes, pseudos){
		var uid = !this.isXMLDocument ? node.uniqueNumber || (node.uniqueNumber = this.uidx++) : node.getAttribute(this.uidKey) || (node.setAttribute(this.uidKey, this.uidx++), node.getAttribute(this.uidKey));
		if (!this.uniques[uid] && this['match:selector'](node, tag, id, selector, classes, attributes, pseudos)){
			this.uniques[uid] = true;
			this.found.push(node);
		}
	};
	
	local.pushRawUID = function(node){
		var uid = !this.isXMLDocument ? node.uniqueNumber || (node.uniqueNumber = this.uidx++) : node.getAttribute(this.uidKey) || (node.setAttribute(this.uidKey, this.uidx++), node.getAttribute(this.uidKey));
		if (!this.uniques[uid]){
			this.uniques[uid] = true;
			this.found.push(node);
		}
	};
	
	var matchers = {
		
		node: function(node, selector){
			var parsed = (selector.Slick ? selector : this.Slick.parse(selector)).expressions[0][0];
			if (!parsed) return true;
			return this['match:selector'](node, this.isXMLDocument ? parsed.tag : parsed.tag.toUpperCase(), parsed.id, parsed.parts);
		},
		
		pseudo: function(node, name, argument){
			var pseudoName = 'pseudo:' + name;
			if (this[pseudoName]) return this[pseudoName](node, argument);
			var attribute = this.getAttribute(node, name);
			return (argument) ? argument == attribute : !!attribute;
		},

		selector: function(node, tag, id, parts, classes, attributes, pseudos){
			if (tag && tag == '*' && (node.nodeType != 1 || node.nodeName.charCodeAt(0) == 47)) return false; // Fix for comment nodes and closed nodes
			if (tag && tag != '*' && (!node.nodeName || node.nodeName != tag)) return false;
			if (id && node.getAttribute('id') != id) return false;
			if (parts) for (var i = 0, l = parts.length, part, cls; i < l; i++){
				part = parts[i];
				if (!part) continue;
				if (part.type == 'class' && classes !== false){
					cls = ('className' in node) ? node.className : node.getAttribute('class');	
					if (!(cls && part.regexp.test(cls))) return false;
				}
				if (part.type == 'pseudo' && pseudos !== false && (!this['match:pseudo'](node, part.key, part.value))) return false;
				if (part.type == 'attribute' && attributes !== false && (!part.test(this.getAttribute(node, part.key)))) return false;
			}
			return true;
		}

	};

	for (var m in matchers) local['match:' + m] = matchers[m];
	
	var combinators = {

		' ': function(node, tag, id, parts, classes, attributes, pseudos){ // all child nodes, any level
			
			var i, l, item, children;

			if (!this.isXMLDocument){
				getById: if (id && node.nodeType === 9){
					// if node == document then we don't need to use contains
					if (!node.getElementById) break getById;
					item = node.getElementById(id);
					if (!item || item.getAttributeNode('id').nodeValue != id) break getById;
					this.push(item, tag, null, parts);
					return;
				}
				getById: if (id && node.nodeType !== 9){
					if (!this.document.getElementById) break getById;
					item = this.document.getElementById(id);
					if (!item || item.getAttributeNode('id').nodeValue != id) break getById;
					if (!this.contains(node, item)) break getById;
					this.push(item, tag, null, parts);
					return;
				}
				getByClass: if (node.getElementsByClassName && classes && !this.cachedGetElementsByClassName && !this.brokenSecondClassNameGEBCN){
					children = node.getElementsByClassName(classes.join(' '));
					if (!(children && children.length)) break getByClass;
					for (i = 0, l = children.length; i < l; i++) this.push(children[i], tag, id, parts, false);
					return;
				}
/*
				QSA: if (node.querySelectorAll && !Slick.disableQSA){
					var query = [];
					if (tag && tag != '*') query.push(tag.replace(/(?=[^\\w\\u00a1-\\uFFFF-])/ig,'\\'));
					if (id){ query.push('#');query.push(id.replace(/(?=[^\\w\\u00a1-\\uFFFF-])/ig,'\\')); }
					if (classes){ query.push('.');query.push(classes.join('').replace(/(?=[^\\w\\u00a1-\\uFFFF-])/ig,'\\').replace(/\\/,'.')); }
					try {
						children = node.querySelectorAll(query.join(''));
					} catch(e){
						Slick.debug && Slick.debug(query, e);
						break QSA;
					}
					if (node.nodeType === 9) for (i = 0, l = children.length; i < l; i++) this.push(children[i], tag, id, parts);
					
					else for (i = 0, l = children.length; i < l; i++)
						if (this.contains(node, children[i])) this.push(children[i], tag, id, parts);
					
					return;
				}
*/
			}
			getByTag: {
				children = node.getElementsByTagName(tag);
				if (!(children && children.length)) break getByTag;
				if (!(this.starSelectsComments || this.starSelectsClosed)) tag = null;
				var child;
				for (i = 0; child = children[i++];) this.push(child, tag, id, parts);
			}
		},
		
		'!': function(node, tag, id, parts){  // all parent nodes up to document
			while ((node = node.parentNode)) if (node !== document) this.push(node, tag, id, parts);
		},

		'>': function(node, tag, id, parts){ // direct children
			if ((node = node.firstChild)) do {
				if (node.nodeType === 1) this.push(node, tag, id, parts);
			} while ((node = node.nextSibling));
		},
		
		'!>': function(node, tag, id, parts){ // direct parent (one level)
			node = node.parentNode;
			if (node !== document) this.push(node, tag, id, parts);
		},

		'+': function(node, tag, id, parts){ // next sibling
			while ((node = node.nextSibling)) if (node.nodeType === 1){
				this.push(node, tag, id, parts);
				break;
			}
		},

		'!+': function(node, tag, id, parts){ // previous sibling
			while ((node = node.previousSibling)) if (node.nodeType === 1){
				this.push(node, tag, id, parts);
				break;
			}
		},

		'^': function(node, tag, id, parts){ // first child
			node = node.firstChild;
			if (node){
				if (node.nodeType === 1) this.push(node, tag, id, parts);
				else this['combinator:+'](node, tag, id, parts);
			}
		},

		'!^': function(node, tag, id, parts){ // last child
			node = node.lastChild;
			if (node){
				if (node.nodeType === 1) this.push(node, tag, id, parts);
				else this['combinator:!+'](node, tag, id, parts);
			}
		},

		'~': function(node, tag, id, parts){ // next siblings
			while ((node = node.nextSibling)){
				if (node.nodeType !== 1) continue;
				var uid = !this.isXMLDocument ? node.uniqueNumber || (node.uniqueNumber = this.uidx++) : node.getAttribute(this.uidKey) || (node.setAttribute(this.uidKey, this.uidx++), node.getAttribute(this.uidKey));
				if (this.localUniques[uid]) break;
				this.localUniques[uid] = true;
				this.push(node, tag, id, parts);
			}
		},

		'!~': function(node, tag, id, parts){ // previous siblings
			while ((node = node.previousSibling)){
				if (node.nodeType !== 1) continue;
				var uid = !this.isXMLDocument ? node.uniqueNumber || (node.uniqueNumber = this.uidx++) : node.getAttribute(this.uidKey) || (node.setAttribute(this.uidKey, this.uidx++), node.getAttribute(this.uidKey));
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

		'empty': function(node){
			return !node.firstChild && !(node.innerText || node.textContent || '').length;
		},

		'not': function(node, expression){
			return !this['match:node'](node, expression);
		},

		'contains': function(node, text){
			var inner = node.innerText || node.textContent || '';
			return (inner) ? inner.indexOf(text) > -1 : false;
		},

		'first-child': function(node){
			return this['pseudo:nth-child'](node, '1');
		},

		'last-child': function(node){
			while ((node = node.nextSibling)) if (node.nodeType === 1) return false;
			return true;
		},

		'only-child': function(node){
			var prev = node;
			while ((prev = prev.previousSibling)) if (prev.nodeType === 1) return false;
			var next = node;
			while ((next = next.nextSibling)) if (next.nodeType === 1) return false;
			return true;
		},

		'nth-child': function(node, argument){
			argument = (!argument) ? 'n' : argument;
			var parsed = this.cacheNTH[argument] || this.parseNTHArgument(argument);
			var uid = !this.isXMLDocument ? node.uniqueNumber || (node.uniqueNumber = this.uidx++) : node.getAttribute(this.uidKey) || (node.setAttribute(this.uidKey, this.uidx++), node.getAttribute(this.uidKey));
			if (!this.positions[uid]){
				var count = 1;
				while ((node = node.previousSibling)){
					if (node.nodeType !== 1) continue;
					var position = this.positions[!this.isXMLDocument ? node.uniqueNumber || (node.uniqueNumber = this.uidx++) : node.getAttribute(this.uidKey) || (node.setAttribute(this.uidKey, this.uidx++), node.getAttribute(this.uidKey))];
					if (position != null){
						count = position + count;
						break;
					}
					count++;
				}
				this.positions[uid] = count;
			}
			var a = parsed.a, b = parsed.b, pos = this.positions[uid];
			if (a == 0) return b == pos;
			if (a > 0){
				if (pos < b) return false;
			} else {
				if (b < pos) return false;
			}
			return ((pos - b) % a) == 0;
		},

		// custom pseudos

		'index': function(node, index){
			return this['pseudo:nth-child'](node, '' + index + 1);
		},

		'even': function(node, argument){
			return this['pseudo:nth-child'](node, '2n');
		},

		'odd': function(node, argument){
			return this['pseudo:nth-child'](node, '2n+1');
		},

		'enabled': function(node){
			return (node.disabled === false);
		},
		
		'disabled': function(node){
			return (node.disabled === true);
		},

		'checked': function(node){
			return node.checked;
		},

		'selected': function(node){
			return node.selected;
		}
	};

	for (var p in pseudos) local['pseudo:' + p] = pseudos[p];
	
	// add pseudos
	
	exports.Slick.definePseudo = function(name, fn){
		fn.displayName = "Slick Pseudo:" + name;
		name = 'pseudo:' + name;
		local[name] = function(node, argument){
			return fn.call(node, argument);
		};
		local[name].displayName = name;
		return this;
	};
	
	exports.Slick.lookupPseudo = function(name){
		var pseudo = local['pseudo:' + name];
		if (pseudo) return function(argument){
			return pseudo.call(this, argument);
		};
		return null;
	};
	
	// Id Custom Engines
	
	local.registerEngine('id', function(context, parsed){
		if (!context.getElementById) return false;
		var id = parsed.expressions[0][0].id;
		var el = context.getElementById(id);
		if (el){
			if (el.getAttribute && el.getAttribute('id') !== id) return false;
			this.found.push(el);
		};
	});
	
	// TagName Custom Engines
	
	local.registerEngine('tagName', function(context, parsed){
		this.found.push.apply(this.found, this.collectionToArray(context.getElementsByTagName(parsed.expressions[0][0].tag)));
	})
	.registerEngine('XML:tagName', 'tagName')
	.registerEngine('tagName*', 'tagName', function(){
		return !(this.starSelectsComments || this.starSelectsClosed || this.starSelectsClosedQSA);
	});
	
	// ClassName Custom Engines
	
	local.registerEngine('className', function(context, parts){
		var results = context.getElementsByTagName(parts.expressions[0][0].tag);
		parts = parts.expressions[0][0].parts;
		N: for (var i = 0, j, part, node, className; node = results[i++];){
			if (!(className = node.className)) continue N;
			for (j = 0; part = parts[j++];)
				if (part.type == 'class' && !part.regexp.test(className)) continue N;
			this.found.push(node);
		}
	}, function(){
		return !this.root.querySelectorAll && !this.root.getElementsByClassName;
	})
	.registerEngine('className', function(context, parsed){
		if (!context.getElementsByClassName) return false;
		this.found.push.apply(this.found, this.collectionToArray(context.getElementsByClassName(parsed.expressions[0][0].classes.join(' '))));
	}, function(){
		return this.root.getElementsByClassName && !this.cachedGetElementsByClassName && !this.brokenSecondClassNameGEBCN;
	})
	.registerEngine('classNames', 'className')
	.registerEngine('tagName:className', 'className', function(){
		return !this.root.getElementsByClassName;
	})
	.registerEngine('tagName:classNames', 'tagName:className');
	
	// Slick.lookupEngine = function(name){
	// 	var engine = local['customEngine:' + name];
	// 	if (engine) return function(context, parsed){
	// 		return engine.call(this, context, parsed);
	// 	};
	// };
	
	// add attributes
	
	local.attributeMethods = {};
	
	exports.Slick.defineAttribute = function(name, fn){
		local.attributeMethods[name] = fn;
		fn.displayName = "Slick Attribute:" + name;
		return this;
	};
	
	exports.Slick.lookupAttribute = function(name){
		return local.attributeMethods[name];
	};
	
	Slick.defineAttribute('class', function(){
		return ('className' in this) ? this.className : this.getAttribute('class');
	}).defineAttribute('for', function(){
		return ('htmlFor' in this) ? this.htmlFor : this.getAttribute('for');
	}).defineAttribute('href', function(){
		return this.getAttribute('href', 2);
	}).defineAttribute('style', function(){
		return this.style.cssText;
	});

	local.getAttribute = function(node, name){
		// FIXME: check if getAttribute() will get input elements on a form on this browser
		// getAttribute is faster than getAttributeNode().nodeValue
		var method = this.attributeMethods[name];
		if (method) return method.call(node);
		var attributeNode = node.getAttributeNode(name);
		return attributeNode ? attributeNode.nodeValue : null;
	};
	
	// matcher
	
	exports.Slick.match = function(node, selector, context){
		if (!(node && selector)) return false;
		if (!selector || selector === node) return true;
		if (typeof selector !== 'string') return false;
		local.positions = {};
		if (local.document !== (node.ownerDocument || node)) local.setDocument(node);
		var parsed = this.parse(selector);
		return (!context && parsed.length === 1 && parsed.expressions[0].length === 1) ?
			local['match:node'](node, parsed) :
			this.deepMatch(node, parsed, context);
	};
	
	exports.Slick.deepMatch = function(node, expression, context){
		// FIXME: FPO code only
		var nodes = this.search(context || local.document, expression);
		for (var i=0; i < nodes.length; i++){
			if (nodes[i] === node){
				return true;
			}
		}
		return false;
	};
	
	local.uidKey = 'SlickJS_uniqueNumber';
	
	exports.Slick.uniques = function(nodes, append, noExpandos){
		var uniques = {};
		if (!append) append = [];
		var i, node, uid;
		
		for (i = 0; node = append[i++];)
			uniques[!noExpandos ? node.uniqueNumber || (node.uniqueNumber = local.uidx++) : node.getAttribute(local.uidKey) || (node.setAttribute(local.uidKey, local.uidx++), node.getAttribute(local.uidKey))] = true;
		for (i = 0; node = nodes[i++];){
			uid = !noExpandos ? node.uniqueNumber || (node.uniqueNumber = local.uidx++) : node.getAttribute(local.uidKey) || (node.setAttribute(local.uidKey, local.uidx++), node.getAttribute(local.uidKey));
			if (!uniques[uid]){
				uniques[uid] = true;
				append.push(node);
			}
		}
		if (noExpandos) for (uid in uniques) uniques[uid] && typeof uniques[uid].removeAttribute == 'function' && uniques[uid].removeAttribute('uniqueNumber');
		return append;
	};
	
	
	// document order sorting
	// credits to Sizzle (http://sizzlejs.com/)
	
	local.documentSort = function(results){
		if (!this.documentSorter) return results;
		results.sort(this.documentSorter);
		return results;
	};
	
	local.setSorter = function(document){
		if (!document) return;
		
		if (document.documentElement.compareDocumentPosition) this.documentSorter = function(a, b){
			if (!a.compareDocumentPosition || !b.compareDocumentPosition) return 0;
			var ret = a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
			return ret;
		};
		else if ('sourceIndex' in document.documentElement) this.documentSorter = function(a, b){
			if (!a.sourceIndex || !b.sourceIndex) return 0;
			var ret = a.sourceIndex - b.sourceIndex;
			return ret;
		};
		else if (document.createRange) this.documentSorter = function(a, b){
			if (!a.ownerDocument || !b.ownerDocument) return 0;
			var aRange = a.ownerDocument.createRange(), bRange = b.ownerDocument.createRange();
			aRange.setStart(a, 0);
			aRange.setEnd(a, 0);
			bRange.setStart(b, 0);
			bRange.setEnd(b, 0);
			var ret = aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
			return ret;
		};
	};
	
	local.setSorter(local.document);

	// debugging
	
	var setDisplayName = function(obj, prefix){
		prefix = prefix || '';
		for (displayName in obj)
			if (typeof obj[displayName] === 'function') obj[displayName].displayName = prefix + displayName;
	};
	
	setDisplayName(local);
	setDisplayName(Slick, 'Slick.');
	
}).apply(typeof exports != 'undefined' ? exports : this);
