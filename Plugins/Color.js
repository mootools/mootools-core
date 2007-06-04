/*
Script: Color.js
	Contains the Color class.

License:
	MIT-style license.
*/

/*
Class: Color
	Creates a new Color Object, which is an array with some color specific methods.
Arguments:
	color - the hex, the RGB array or the HSB array of the color to create. For HSB colors, you need to specify the second argument.
	type - a string representing the type of the color to create. needs to be specified if you intend to create the color with HSB values, or an array of HEX values. Can be 'rgb', 'hsb' or 'hex'.

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

	initialize: function(color, type){
		type = type || (color.push ? 'rgb' : 'hex');
		var rgb, hsb;
		switch(type){
			case 'rgb':
				rgb = color;
				hsb = rgb.rgbToHsb();
				break;
			case 'hsb':
				rgb = color.hsbToRgb();
				hsb = color;
				break;
			default:
				rgb = color.hexToRgb(true);
				hsb = rgb.rgbToHsb();
		}
		rgb.hsb = hsb;
		rgb.hex = rgb.rgbToHex();
		return $extend(rgb, Color.prototype);
	},

	/*
	Property: mix
		Mixes two or more colors with the Color.
		
	Arguments:
		color - a color to mix. you can use as arguments how many colors as you want to mix with the original one.
		alpha - if you use a number as the last argument, it will be threated as the amount of the color to mix.
	*/

	mix: function(){
		var colors = $A(arguments);
		var alpha = ($type(colors[colors.length - 1]) == 'number') ? colors.pop() : 50;
		var rgb = this.copy();
		colors.each(function(color){
			color = new Color(color);
			for (var i = 0; i < 3; i++) rgb[i] = Math.round((rgb[i] / 100 * (100 - alpha)) + (color[i] / 100 * alpha));
		});
		return new Color(rgb, 'rgb');
	},

	/*
	Property: invert
		Inverts the Color.
	*/

	invert: function(){
		return new Color(this.map(function(value){
			return 255 - value;
		}));
	},

	/*
	Property: setHue
		Modifies the hue of the Color, and returns a new one.
	
	Arguments:
		value - the hue to set
	*/

	setHue: function(value){
		return new Color([value, this.hsb[1], this.hsb[2]], 'hsb');
	},

	/*
	Property: setSaturation
		Changes the saturation of the Color, and returns a new one.
	
	Arguments:
		percent - the percentage of the saturation to set
	*/

	setSaturation: function(percent){
		return new Color([this.hsb[0], percent, this.hsb[2]], 'hsb');
	},

	/*
	Property: setBrightness
		Changes the brightness of the Color, and returns a new one.
	
	Arguments:
		percent - the percentage of the brightness to set
	*/

	setBrightness: function(percent){
		return new Color([this.hsb[0], this.hsb[1], percent], 'hsb');
	}

});

/* Section: Utility Functions */

/*
Function: $RGB
	Shortcut to create a new color, based on red, green, blue values.

Arguments:
	r - (integer) red value (0-255)
	g - (integer) green value (0-255)
	b - (integer) blue value (0-255)

*/

function $RGB(r, g, b){
	return new Color([r, g, b], 'rgb');
};

/*
Function: $HSB
	Shortcut to create a new color, based on hue, saturation, brightness values.

Arguments:
	h - (integer) hue value (0-100)
	s - (integer) saturation value (0-100)
	b - (integer) brightness value (0-100)
*/

function $HSB(h, s, b){
	return new Color([h, s, b], 'hsb');
};

/*
Class: Array
	A collection of The Array Object prototype methods.
*/

Array.extend({
	
	/*
	Property: rgbToHsb
		Converts a RGB array to an HSB array.

	Returns:
		the HSB array.
	*/

	rgbToHsb: function(){
		var red = this[0], green = this[1], blue = this[2];
		var hue, saturation, brightness;
		var max = Math.max(red, green, blue), min = Math.min(red, green, blue);
		var delta = max - min;
		brightness = max / 255;
		saturation = (max != 0) ? delta / max : 0;
		if (saturation == 0){
			hue = 0;
		} else {
			var rr = (max - red) / delta;
			var gr = (max - green) / delta;
			var br = (max - blue) / delta;
			if (red == max) hue = br - gr;
			else if (green == max) hue = 2 + rr - br;
			else hue = 4 + gr - rr;
			hue /= 6;
			if (hue < 0) hue++;
		}
		return [Math.round(hue * 360), Math.round(saturation * 100), Math.round(brightness * 100)];
	},

	/*
	Property: hsbToRgb
		Converts an HSB array to an RGB array.

	Returns:
		the RGB array.
	*/

	hsbToRgb: function(){
		var br = Math.round(this[2] / 100 * 255);
		if (this[1] == 0){
			return [br, br, br];
		} else {
			var hue = this[0] % 360;
			var f = hue % 60;
			var p = Math.round((this[2] * (100 - this[1])) / 10000 * 255);
			var q = Math.round((this[2] * (6000 - this[1] * f)) / 600000 * 255);
			var t = Math.round((this[2] * (6000 - this[1] * (60 - f))) / 600000 * 255);
			switch(Math.floor(hue / 60)){
				case 0: return [br, t, p];
				case 1: return [q, br, p];
				case 2: return [p, br, t];
				case 3: return [p, q, br];
				case 4: return [t, p, br];
				case 5: return [br, p, q];
			}
		}
		return false;
	}

});