/*
Script: Element.Filters.js
	add Filters capability to <Elements>.

License:
	MIT-style license.
*/

/*
Class: Elements
	A collection of methods to be used with <$$> elements collections.
*/

Elements.extend({
	
	/*
	Property: filterByTag
		Filters the collection by a specified tag name.
		Returns a new Elements collection, while the original remains untouched.
	*/
	
	filterByTag: function(tag, nocash){
		var elements = this.filter(function(el){
			return (Element.getTag(el) == tag);
		});
		return (nocash) ? elements : new Elements(elements);
	},
	
	/*
	Property: filterByClass
		Filters the collection by a specified class name.
		Returns a new Elements collection, while the original remains untouched.
	*/
	
	filterByClass: function(className, nocash){
		var elements = this.filter(function(el){
			return (el.className && el.className.contains(className, ' '));
		});
		return (nocash) ? elements : new Elements(elements);
	},
	
	/*
	Property: filterById
		Filters the collection by a specified ID.
		Returns a new Elements collection, while the original remains untouched.
	*/
	
	filterById: function(id, nocash){
		var elements = this.filter(function(el){
			return (el.id == id);
		});
		return (nocash) ? elements : new Elements(elements);
	},
	
	/*
	Property: filterByAttribute
		Filters the collection by a specified attribute.
		Returns a new Elements collection, while the original remains untouched.
		
	Arguments:
		name - the attribute name.
		operator - optional, the attribute operator.
		value - optional, the attribute value, only valid if the operator is specified.
	*/
	
	filterByAttribute: function(name, operator, value, nocash){
		var elements = this.filter(function(el){
			var current = Element.getProperty(el, name);
			if (!current) return false;
			if (!operator) return true;
			switch(operator){
				case '=': return (current == value);
				case '*=': return (current.contains(value));
				case '^=': return (current.substr(0, value.length) == value);
				case '$=': return (current.substr(current.length - value.length) == value);
				case '!=': return (current != value);
				case '~=': return current.contains(value, ' ');
			}
			return false;
		});
		return (nocash) ? elements : new Elements(elements);
	},
	
	filterByPseudo: function(name, param, nocash){
		var elements = [];
		var filter = false;
		var variation = false;
		if (name == 'first' || name == 'last' || name == 'only'){
			variation = name;
			name = 'nth';
		}
		switch(name){
			case 'nth':
				var parents = [];
				for (var i = 0, j = this.length; i < j; i++){
					var parent = this[i].parentNode;
					if (!parent || parent.$included) continue;
					parent.$included = true;
					parents.push(parent);
					var children = Array.filter(parent.childNodes, function(el){
						return (el.nodeName && el.nodeType == 1);
					});
					if (param[1]){
						for (var m = 0, n = children.length; m < n; m++){
							if ((m % param[0] == param[2]) && (this.contains(children[m]))) elements.push(children[m]);
						}
					} else {
						switch(variation){
							case false: if (this.contains(children[param[0]])) elements.push(children[param[0]]); break;
							case 'last':
								var last = children.getLast();
								if (this.contains(last)) elements.push(last);
							break;
							case 'first':
								var first = children[0];
								if (this.contains(first)) elements.push(first);
							break;
							case 'only': if (children.length == 1 && this.contains(children[0])) elements.push(children[0]);
						}
					}
				}
				for (var k = 0, l = parents.length; k < l; k++) parents[k].$included = null;
			break;
			case 'empty':
				filter = function(el){
					return (Element.getText(el).length === 0);
				};
			break;
			case 'enabled':
				filter = function(el){
					return (el.disabled || el.disabled === false);
				};
			break;
			case 'contains':
				filter = function(el){
					for (var o = 0, p = el.childNodes.length; o < p; o++){
						var child = el.childNodes[o];
						if (child.nodeName && child.nodeType == 3 && child.nodeValue.contains(param)) return true;
					}
					return false;
				};
			break;
			default:
				filter = function(el){
					var property = Element.getProperty(el, name);
					return (param) ? (property == param) : property;
				};
			break;
		}
		if (filter) elements = this.filter(filter);
		return (nocash) ? elements : new Elements(elements);
	}

});