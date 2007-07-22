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
	Property: setStyle
		Sets a css property to the Element.

		Arguments:
			property - the property to set
			value - the value to which to set it; for numeric values that require "px" you can pass an integer

		Example:
			>$('myElement').setStyle('width', '300px'); //the width is now 300px
			>$('myElement').setStyle('width', 300); //the width is now 300px
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
		}
		this.style[property] = value;
		return this;
	},

	/*
	Property: setStyles
		Applies a collection of styles to the Element.

	Arguments:
		source - an object or string containing all the styles to apply. When its a string it overrides old style.

	Examples:
		>$('myElement').setStyles({
		>	border: '1px solid #000',
		>	width: 300,
		>	height: 400
		>});

		OR

		>$('myElement').setStyles('border: 1px solid #000; width: 300px; height: 400px;');
	*/

	setStyles: function(styles){
		switch ($type(styles)){
			case 'object': for (var style in styles) this.setStyle(style, styles[style]); break;
			case 'string': this.style.cssText = styles;
		}
		return this;
	},

	/*
	Property: setOpacity
		Sets the opacity of the Element, and sets also visibility == "hidden" if opacity == 0, and visibility = "visible" if opacity > 0.

	Arguments:
		opacity - float; Accepts values from 0 to 1.

	Example:
		>$('myElement').setOpacity(0.5) //make it 50% transparent
	*/

	setOpacity: function(opacity){
		if (opacity == 0){
			if (this.style.visibility != "hidden") this.style.visibility = "hidden";
		} else {
			if (this.style.visibility != "visible") this.style.visibility = "visible";
		}
		if (!this.currentStyle || !this.currentStyle.hasLayout) this.style.zoom = 1;
		if (Client.Engine.ie) this.style.filter = (opacity == 1) ? '' : "alpha(opacity=" + opacity * 100 + ")";
		this.style.opacity = this.$attributes.opacity = opacity;
		return this;
	},

	/*
	Property: getStyle
		Returns the style of the Element given the property passed in.

	Arguments:
		property - the css style property you want to retrieve

	Example:
		>$('myElement').getStyle('width'); //returns "400px"
		>//but you can also use
		>$('myElement').getStyle('width').toInt(); //returns 400

	Returns:
		the style as a string
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
			var color = result.match(/rgba?\([\d\s,]+\)/);
			if (color) result = result.replace(color[0], color[0].rgbToHex());
		}
		return (Client.Engine.ie) ? Element.$fixStyle(property, result, this) : result;
	},

	/*
	Property: getStyles
		Returns an object of styles of the Element for each argument passed in.
		Arguments:
		properties - strings; any number of style properties
	Example:
		>$('myElement').getStyles('width','height','padding');
		>//returns an object like:
		>{width: "10px", height: "10px", padding: "10px 0px 10px 0px"}
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
