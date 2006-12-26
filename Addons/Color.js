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
	
	isColor: true,

	initialize: function(color, type){
		if (color.isColor) return color;
		type = type || 'rgb';
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
				break;
		}
		rgb.hsb = hsb;
		return Object.extend(rgb, Color.prototype);
	},
	
	mix: function(){
		var colors = $A(arguments);
		var alpha = ($type(colors[colors.length-1]) == 'number') ? colors.pop() : 50;
		var rgb = this.copy();
		colors.each(function(color){
			color = new Color(color);
			for (var i = 0; i < 3; i++) rgb[i] = Math.round((rgb[i] / 100 * (100 - alpha)) + (color[i] / 100 * alpha));
		});
		return new Color(rgb);
	},

	invert: function(){
		return new Color(this.map(function(value){
			return 255 - value;
		}));
	},
	
	setHue: function(value){
		return new Color([value, this.hsb[1], this.hsb[2]], 'hsb');
	},
	
	setSaturation: function(percent){
		return new Color([this.hsb[0], percent, this.hsb[2]], 'hsb');
	},
	
	setBrightness: function(percent){
		return new Color([this.hsb[0], this.hsb[1], percent], 'hsb');
	}

});

function $RGB(color){
	return new Color(color, 'rgb');
};

function $HSB(color){
	return new Color(color, 'hsb');
};

Array.extend({
	
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
	
	hsbToRgb: function(){
		var red, green, blue;
		var hue = Math.round(this[0]), saturation = Math.round(this[1] / 100 * 255), brightness = Math.round(this[2] / 100 * 255);
		if (saturation == 0){
			red = green = blue = brightness;
		} else {
			var t1 = brightness;
			var t2 = (255 - saturation) * brightness / 255;
			var t3 = (t1 - t2) * (hue % 60) / 60;
			if (hue < 60) red = t1, green = t2 + t3, blue = t2;
			else if (hue < 120) red = t1 - t3, green = t1, blue = t2;
			else if (hue < 180) red = t2, green = t1, blue = t2 + t3;
			else if (hue < 240) red = t2, green = t1 - t3, blue = t1;
			else if (hue < 300) red = t2 + t3, green = t2, blue = t1;
			else if (hue < 360) red = t1, green = t2, blue = t1 - t3;
		}
		return [Math.round(red), Math.round(green), Math.round(blue)];
	}

});