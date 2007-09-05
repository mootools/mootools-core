/*
Script: Element.Style.js
	Contains useful Element prototypes, to set/get styles in a fashionable way.

License:
	MIT-style license.
*/

/*
Class: Element
	Custom class to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

Element.Setters.styles = function(styles){
	this.setStyles(styles);
};

Element.extend({

	/*
	Method: setStyle
		Sets a CSS property to the Element.

	Syntax:
		>myElement.setStyle(property, value);

	Arguments:
		property - (string) The property to set.
		value    - (mixed) The value to which to set it. For numeric values that require "px" you can pass an integer.

	Returns:
		(element) This element.

	Example:
		[javascript]
			$('myElement').setStyle('width', '300px'); //the width is now 300px
			//or
			$('myElement').setStyle('width', 300); //the width is now 300px
		[/javascript]

	Note:
		All integer values will automatically be rounded to the nearest whole number.
	*/

	setStyle: function(property, value){
		switch (property){
			case 'opacity': return this.setOpacity(parseFloat(value));
			case 'float': property = (Client.Engine.ie) ? 'styleFloat' : 'cssFloat';
		}
		property = property.camelCase();
		if ($type(value) != 'string'){
			var map = (Element.Styles.All[property] || '@').split(' ');
			value = $splat(value).map(function(val, i){
				if (!map[i]) return '';
				return ($type(val) == 'number') ? map[i].replace('@', Math.round(val)) : val;
			}).join(' ');
		} else if (value == Number(value) + ''){
			value = Math.round(value);
		}
		this.style[property] = value;
		return this;
	},

	/*
	Method: setStyles
		Applies a collection of styles to the Element.

	Syntax:
		>myElement.setStyles(styles);

	Arguments:
		styles - (mixed) An object, or string, containing all the styles to apply.

	Returns:
		(element) This element.

	Examples:
		[javascript]
			$('myElement').setStyles({
				border: '1px solid #000',
				width: 300,
				height: 400
			});
			//or
			$('myElement').setStyles('border: 1px solid #000; width: 300px; height: 400px;'); // See the Note
		[/javascript]

	Note:
		When styles is a CSS string, all the CSS styles are overridden.

	See Also:
		<Element.setStyle>
	*/

	setStyles: function(styles){
		switch ($type(styles)){
			case 'object': for (var style in styles) this.setStyle(style, styles[style]); break;
			case 'string': this.style.cssText = styles;
		}
		return this;
	},

	/*
	Method: setOpacity
		Sets the opacity of the Element, and sets also visibility == "hidden" if opacity == 0, and visibility = "visible" if opacity > 0.

	Syntax:
		>Element.setOpacity(opacity);

	Arguments:
		opacity - (float) A values from 0.0 to 1.0, where 1.0 is visible and 0.0 is hidden.

	Returns:
		(element) This element.

	Example:
		[javascript]
			$('myElement').setOpacity(0.5) //make it 50% transparent
		[/javascript]
	*/

	setOpacity: function(opacity){
		if (opacity == 0){
			if (this.style.visibility != 'hidden') this.style.visibility = 'hidden';
		} else {
			if (this.style.visibility != 'visible') this.style.visibility = 'visible';
		}
		if (!this.currentStyle || !this.currentStyle.hasLayout) this.style.zoom = 1;
		if (Client.Engine.ie) this.style.filter = (opacity == 1) ? '' : 'alpha(opacity=' + opacity * 100 + ')';
		this.style.opacity = this.$attributes.opacity = opacity;
		return this;
	},

	/*
	Method: getStyle
		Returns the style of the Element given the property passed in.

	Syntax:
		>var style = myElement.getStyle(property);

	Arguments:
		property - (string) The css style property you want to retrieve.

	Returns:
		(string) The style value.

	Example:
		[javascript]
			$('myElement').getStyle('width'); //returns "400px"
			//but you can also use
			$('myElement').getStyle('width').toInt(); //returns 400
		[/javascript]
	*/

	getStyle: function(property){
		property = property.camelCase();
		if (property == 'opacity') return this.$attributes.opacity;
		var result = this.style[property];
		if (!$chk(result)){
			result = [];
			for (var style in Element.Styles.Short){
				if (property != style) continue;
				for (var s in Element.Styles.Short[style]) result.push(this.getStyle(s));
				return (result.every(function(item){
					return item == result[0];
				})) ? result[0] : result.join(' ');
			}
			if (document.defaultView) result = document.defaultView.getComputedStyle(this, null).getPropertyValue(property.hyphenate());
			else if (this.currentStyle) result = this.currentStyle[property];
		}
		if (result){
			result = String(result);
			var color = result.match(/rgba?\([\d\s,]+\)/);
			if (color) result = result.replace(color[0], color[0].rgbToHex());
		}
		return (Client.Engine.ie) ? Element.$fixStyle(property, result, this) : result;
	},

	/*
	Method: getStyles
		Returns an object of styles of the Element for each argument passed in.

	Syntax:
		>var styles = myElement.getStyles(property[, property2[, property3[, ...]]]);

	Arguments:
		properties - (strings) Any number of style properties.

	Returns:
		(object) An key/value object with the CSS styles as computed by the browser.

	Example:
		[javascript]
			$('myElement').getStyles('width', 'height', 'padding'); //returns {width: "10px", height: "10px", padding: "10px 0px 10px 0px"}
		[/javascript]

	See Also:
		<Element.getStyle>
	*/

	getStyles: function(){
		var result = {};
		$each(arguments, function(key){
			result[key] = this.getStyle(key);
		}, this);
		return result;
	}

});

Element.$fixStyle = function(property, result, element){
	if ($chk(parseInt(result))) return result;
	if (['height', 'width'].contains(property)){
		var values = (property == 'width') ? ['left', 'right'] : ['top', 'bottom'];
		var size = 0;
		values.each(function(value){
			size += element.getStyle('border-' + value + '-width').toInt() + element.getStyle('padding-' + value).toInt();
		});
		return element['offset' + property.capitalize()] - size + 'px';
	} else if (property.test(/border(.+)Width|margin|padding/)){
		return '0px';
	}
	return result;
};

Element.Styles = {

	All: {
		'width': '@px', 'height': '@px', 'left': '@px', 'top': '@px', 'bottom': '@px', 'right': '@px',
		'backgroundColor': 'rgb(@, @, @)', 'backgroundPosition': '@px @px', 'color': 'rgb(@, @, @)',
		'fontSize': '@px', 'letterSpacing': '@px', 'lineHeight': '@px',
		'margin': '@px @px @px @px', 'padding': '@px @px @px @px', 'border': '@px @ rgb(@, @, @) @px @ rgb(@, @, @) @px @ rgb(@, @, @)',
		'borderWidth': '@px @px @px @px', 'borderStyle': '@ @ @ @', 'borderColor': 'rgb(@, @, @) rgb(@, @, @) rgb(@, @, @) rgb(@, @, @)',
		'zIndex' : '@', 'zoom': '@', 'fontWeight': '@',
		'textIndent': '@px', 'opacity': '@'
	},

	Short: {'margin': {}, 'padding': {}, 'border': {}, 'borderWidth': {}, 'borderStyle': {}, 'borderColor': {}}

};

['Top', 'Right', 'Bottom', 'Left'].each(function(direction){
	var Short = Element.Styles.Short;
	var All = Element.Styles.All;
	['margin', 'padding'].each(function(style){
		var sd = style + direction;
		Short[style][sd] = All[sd] = '@px';
	});
	var bd = 'border' + direction;
	Short.border[bd] = All[bd] = '@px @ rgb(@, @, @)';
	var bdw = bd + 'Width', bds = bd + 'Style', bdc = bd + 'Color';
	Short[bd] = {};
	Short.borderWidth[bdw] = Short[bd][bdw] = '@px';
	Short.borderStyle[bds] = Short[bd][bds] = '@';
	Short.borderColor[bdc] = Short[bd][bdc] = 'rgb(@, @, @)';
});
