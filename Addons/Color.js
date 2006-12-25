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
		var hsb = [], rgb = [];
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
		var max = Math.max(red, green, blue);
		var min = Math.min(red, green, blue);
		brightness = max / 255;
		if (max != 0) saturation = (max - min) / max;
		else saturation = 0;
		if (saturation == 0){
			hue = 0;
		} else {
			var rr = (max - red) / (max - min);
			var gr = (max - green) / (max - min);
			var br = (max - blue) / (max - min);
			if (red == max) hue = br - gr;
			else if (green == max) hue = 2 + rr - br;
			else hue = 4 + gr - rr;
			hue /= 6;
			if (hue < 0) hue++;
		}
		return [Math.round(hue * 360), Math.round(saturation * 100), Math.round(brightness * 100)];
	},
	
	hsbToRgb: function(){
		var red = 0, green = 0, blue = 0;
		var hue = this[0], saturation = this[1], brightness = this[2];
		hue = Math.round(hue);
		saturation = Math.round(saturation / 100 * 255);
		brightness = Math.round(brightness / 100 * 255);
		if (saturation == 0){
			red = green = blue = brightness;
		} else {
			var t1 = brightness;
			var t2 = (255 - saturation) * brightness / 255;
			var t3 = hue % 60;
			t3 = (t1 - t2) * t3 / 60;
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