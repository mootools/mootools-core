/*
Script: Color.js
	Contains the Color class.

Author:
	Michael Jackson <http://ajaxon.com>

License:
	MIT-style license.
*/

/*
Class: Color
	Creates a new Color Object, which is an array with some color specific methods.

Example:
	(start code)

	(end)
*/

var Color = new Class({

	initialize: function(color){
		if (color.blend && color.mix) return color;
		var rgb = (color.push) ? color : color.hexToRgb(true);
		return Object.extend(rgb, Color.prototype);
	},
	
	mix: function(){
		var colors = $A(arguments);
		var alpha = 50;
		if (colors.length == 2 && $type(colors[1]) == 'number'){
			alpha = colors[1];
			colors.pop();
		}
		var mixed = this;
		colors.each(function(color){
			var rgb = [];
			color = new Color(color);
			for (var i = 0; i < 3; i++) rgb.push(Math.round((mixed[i] / 100 * (100 - alpha)) + (color[i] / 100 * alpha)));
			mixed = new Color(rgb);
		});
		return mixed;
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