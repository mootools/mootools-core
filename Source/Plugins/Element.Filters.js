/*
Script: Element.Filters.js
	Adds Filtering Capabilities to Elements Collections.

License:
	MIT-style license.
*/

/*
Native: Elements
	Custom Native to allow all of its methods to be used with any DOM elements collections via the dollar function <$>.
*/

Elements.implement({

	/*
	Method: filterByTag
		Filters the collection by a specified tag name.

	Syntax:
		>var filteredElements = myElements.filterByTag(tag[, nocash]);

	Arguments:
		tag    - (string) The tag to match against throughout the Elements collection.
		nocash - (boolean, optional) Optionally return a new Elements collection from the filtered elements.

	Returns:
		(array) Returns a new Elements collection, while the original remains untouched.

	Example:
		HTML:
		[html]
			<div id="myElement">
				<div></div>
				<a></a>
				<p></p>
				<div></div>
				<a></a>
				<p></p>
			</div>
		[/javascript]

		[javascript]
			$('myElement').getChildren().filterByTag('div'); //returns [<div>, <div>]
		[/javascript]

	See Also:
		<$>, <Element.getChildren()>
	*/

	filterByTag: function(tag, nocash){
		var elements = this.filter(function(el){
			return (Element.get(el, 'tag') == tag);
		});
		return (nocash) ? elements : new Elements(elements, true);
	},

	/*
	Method: filterByClass
		Filters the collection by a specified class name.

	Syntax:
		>var filteredElements = myElements.filterByClass(className[, nocash]);

	Arguments:
		className - (string) The class to match against throughout the Elements collection.
		nocash    - (boolean, optional) Optionally return a new Elements collection from the filtered elements.

	Returns:
		(array) Returns a new Elements collection, while the original remains untouched.

	Example:
		HTML:
		[html]
			<div id="myElement">
				<div></div>
				<a class="findMe"></a>
				<p class="findMe"></p>
				<div class="findMe"></div>
				<a></a>
				<p></p>
			</div>
		[/html]

		[javascript]
			$('myElement').getChildren().filterByClass('findMe'); //returns [<a>, <p>, <div>]
		[/javascript]

	See Also:
		<$>, <Element.getChildren()>
	*/

	filterByClass: function(className, nocash){
		var elements = this.filter(function(el){
			return (el.className && el.className.contains(className, ' '));
		});
		return (nocash) ? elements : new Elements(elements, true);
	},

	/*
	Method: filterById
		Filters the collection by a specified ID.

	Syntax:
		>var filteredElements = myElements.filterById(id[, nocash]);

	Arguments:
		id     - (string) The class to match against throughout the Elements collection.
		nocash - (boolean, optional) Optionally return a new Elements collection from the filtered elements.

	Returns:
		(array) Returns a new Elements collection, while the original remains untouched.

	Example:
		HTML:
		[html]
			<div id="myElement">
				<div></div>
				<a></a>
				<p></p>
				<div id="findMe"</div>
				<a></a>
				<p></p>
			</div>
		[/html]

		[javascript]
			$('myElement').getChildren().filterById('findMe'); //returns [<div>]
		[/javascript]

	See Also:
		<$>, <Element.getChildren()>
	*/

	filterById: function(id, nocash){
		var elements = this.filter(function(el){
			return (el.id == id);
		});
		return (nocash) ? elements : new Elements(elements, true);
	},

	/*
	Method: filterByAttribute
		Filters the collection by a specified attribute.

	Syntax:
		>var filteredElements = myElements.filterByAttribute(name[, operator[, value[, nocash]]]);

	Arguments:
		name     - (string) The attribute name.
		operator - (string, optional) The attribute operator. If the operator is unsupported the match will always return true.
		value    - (mixed, optional) The attribute value, only valid if the operator is specified.
		nocash   - (boolean, optional) Optionally return a new Elements collection from the filtered elements.

	Returns:
		(array) Returns a new Elements collection, while the original remains untouched.

	Example:
		HTML:
		[html]
			<div id="myElement">
				<div></div>
				<a></a>
				<img src="mootools.png" alt="findMe" />
				<img src="whatever.gif" alt="findMe" />
				<iframe src="http://mootools.net/"></iframe>
				<script src="mootools.js"></script>
				<a></a>
				<p></p>
			</div>
		[/html]

		[javascript]
			var found = $('myElement').getChildren().filterByAttribute('src'); //returns [<img>, <img>, <iframe>, <script>]
			//could go further and:
			found = found.filterByAttribute('alt', '=', 'findMe'); //returns [<img>, <img>]
		[/javascript]

	See Also:
		<$>, <Element.getChildren()>
	*/

	filterByAttribute: function(name, operator, value, nocash){
		var elements = this.filter(function(el){
			var current = Element.get(el, name);
			if (!current) return false;
			if (!operator) return true;
			switch (operator){
				case '=': return (current == value);
				case '*=': return (current.contains(value));
				case '^=': return (current.substr(0, value.length) == value);
				case '$=': return (current.substr(current.length - value.length) == value);
				case '!=': return (current != value);
				case '~=': return current.contains(value, ' ');
				case '|=': return current.contains(value, '-');
			}
			return false;
		});
		return (nocash) ? elements : new Elements(elements, true);
	}

});
