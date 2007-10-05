/*
Script: Element.Form.js
	Contains Element methods for working with forms and their elements.

License:
	MIT-style license.
*/

/*
Native: Element
	Custom Native to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

Element.implement({

	/*
	Method: getValue
		Returns the value of the Element, if its tag is textarea, select or input. getValue called on a multiple select will return an array.

	Syntax:
		>var value = myElement.getValue();

	Returns:
		(mixed) Returns false if if tag is not a 'select', 'input', or 'textarea'. Otherwise returns the value of the Element.

	Example:
		HTML:
		[html]
			<form id="myForm">
				<select>
					<option value="volvo">Volvo</option>
					<option value="saab" selected="yes">Saab</option>
					<option value="opel">Opel</option>
					<option value="audi">Audi</option>
				</select>
			</form>
		[/html]

		Result:
		[javascript]
			var result = $('myForm').getElement('select').getValue(); // returns 'Saab'
		[/javascript]
	*/

	getValue: function(){
		switch (this.getTag()){
			case 'select':
				var values = [];
				Array.each(this.options, function(option){
					if (option.selected) values.push(option.value);
				});
				return (this.multiple) ? values : values[0];
			case 'input': if (['checkbox', 'radio'].contains(this.type) && !this.checked) return false;
			default: return $chk(this.value) ? this.value : false;
		}
	},

	/*
	Method: getFormElements
		Finds, extends, and returns all descendant form Elements: 'input, 'select', and 'textarea'.

	Syntax:
		>var elements = myElement.getFormElements();

	Returns:
		(array) A collection of Elements.

	Example:
		HTML:
		[html]
			<form id="myForm">
				<select>
					<option value="volvo">Volvo</option>
					<option value="saab" selected="yes">Saab</option>
				</select>
				<textarea></textarea>
			</form>
		[/html]

		[javascript]
			$('myForm').getFormElements(); // returns: [<select>, <textarea>];
		[/javascript]

	See Also:
		<$$>
	*/

	getFormElements: function(){
		return $$(this.getElementsByTagName('input'), this.getElementsByTagName('select'), this.getElementsByTagName('textarea'));
	},

	/*
	Method: toQueryString
		Reads the children inputs of the Element and generates a query string, based on their values.

	Syntax:
		>var query = myElement.toQueryString();

	Returns:
		(string) A string representation of a Form element and its children.

	Example:
		[html]
			<form id="myForm" action="submit.php">
				<input name="email" value="bob@bob.com">
				<input name="zipCode" value="90210">
			</form>
		[/html]

		[/javascript]
			$('myForm').toQueryString() //email=bob@bob.com&zipCode=90210\
		[/javascript]

	Note:
		Used internally in <Ajax>.
	*/

	toQueryString: function(){
		var queryString = [];
		this.getFormElements().each(function(el){
			var name = el.name, type = el.type, value = el.getValue();
			if (value === false || !name || el.disabled) return;
			if ((type == 'checkbox' || type == 'radio') && !el.checked ) return;
			var qs = function(val){
				queryString.push(name + '=' + encodeURIComponent(val));
			};
			if ($type(value) == 'array') value.each(qs);
			else qs(value);
		});
		return queryString.join('&');
	}

});