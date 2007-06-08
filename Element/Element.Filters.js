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
	
	filterByNth: function(a, nth, b, nocash){
		var found = [];
		var parents = [];
		var ab = [];
		switch(nth){
			case 'n': ab = [a, b]; break;
			case 'odd': ab = [2, 1]; break;
			case 'even': ab = [2, 0];
		}
		for (var i = 0, j = this.length; i < j; i++){
			var parent = this[i].parentNode;
			if (!parent || parent.$included) continue;
			parent.$included = true;
			parents.push(parent);
			var children = Array.filter(parent.childNodes, function(el){
				return ($type(el) == 'element');
			});
			if (nth){
				for (var k = 0, l = children.length; k < l; k++){
					if ((k % ab[0] == ab[1]) && (this.contains(children[k]))) found.push(children[k]);
				}
			} else {
				if (this.contains(children[a])) found.push(children[a]);
			}
		}
		for (var m = 0, n = parents.length; m < n; m++) parents[m].$included = null;
		return (nocash) ? found : new Elements(found);
	}

});