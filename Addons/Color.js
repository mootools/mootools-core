/*
Script: Color.js
	Contains the Color class.

Author:
	Michael Jackson <http://ajaxon.com/michael>

License:
	MIT-style license.
*/

/*
Class: Color
	Creates a new Color Object, which is an array with some color specific methods.

Example:
	(start code)
	var black = new Color('#000');
	var purple = new Color([255,0,255]);
	// mix black with white and purple, each time at 10% of the new color
	var darkpurple = black.mix('#fff', purple, 10);
	$('myDiv').setStyle('background-color', darkpurple);
	(end)
*/

var Color = new Class({

	initialize: function(color){
		if (color.mix && color.invert) return color;
		var rgb = (color.push) ? color : color.hexToRgb(true);
		return Object.extend(rgb, Color.prototype);
	},
	
	mix: function(){
		var colors = $A(arguments);
		var alpha = 50;
		if ($type(colors[colors.length-1]) == 'number') alpha = colors.pop();
		var rgb = this.copy();
		colors.each(function(color){
			color = new Color(color);
			for (var i = 0; i < 3; i++) rgb[i] = Math.round((rgb[i] / 100 * (100 - alpha)) + (color[i] / 100 * alpha));
		});
		return new Color(rgb);
	},

	invert: function(){
		var rgb = [];
		for (var i = 0; i < 3; i++) rgb.push(255 - this[i]);
		return new Color(rgb);
	}

});

function $C(color){
	return new Color(color);
};