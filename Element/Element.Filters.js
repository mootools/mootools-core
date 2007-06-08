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
	
	filterByNth: function(interval, n, start, nocash){
		var found = [];
		var parents = [];
		var is = [];
		switch(n){
			case 'n': is = [interval, start]; break;
			case 'odd': is = [2, 1]; break;
			case 'even': is = [2, 0];
		}
		for (var i = 0, l = this.length; i < l; i++){
			var parent = this[i].parentNode;
			if (!parent || parent.$included) continue;
			parent.$included = true;
			parents.push(parent);
			var children = Array.filter(parent.childNodes, function(el){
				return (this.contains(el));
			}, this);
			if (n){
				for (var o = 0, p = children.length; o < p; o++){
					if (o % is[0] == is[1]) found.push(children[o]);
				}
			} else {
				found.push(children[interval]);
			}
		}
		for (var r = 0, s = parents.length; r < s; r++) parents[r].$included = null;
		return (nocash) ? found : new Elements(found);
	}

});