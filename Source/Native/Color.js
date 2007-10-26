/*
Script: Color.js
	Contains the Color class.

License:
	MIT-style license.
*/

/*
Class: Color
	Creates a new Color Class, which is an array with some color specific methods.

Syntax:
	>var myColor = new Color(color[, type]);

Arguments:
	color - (mixed) A string or an array representation of a color.
	type  - (string, optional) A string representing the type of the color to create.

	color (continued):
		There are three typical representations of color: String, RGB, and HSB. For String representation see <Element.setStyle> for more information.

		Examples:
			String Representation:
			[javascript]
				'#fff'
				//or
				'#ffffff'
			[/javascript]

			RGB and HSB Representation:
			[javascript]
				[255, 255, 255]
				//or
				[255, 255, 255, 1] // for the transparency
			[javascript]

Returns:
	(array) A new Color instance.

Example:
	[javascript]
		var black = new Color('#000');
		var purple = new Color([255,0,255]);
	[/javascript]

Note:
	For HSB colors, you need to specify the second argument.
*/

var Color = new Native({
  
  name: 'Color',
  
  browser: false,
  
  initialize: function(color, type){
		type = type || ($type(color) == 'array') ? 'rgb' : 'hex';
		var rgb, hsb;
		switch (type){
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
		return $extend(rgb, this);
	}

});

Color.implement({

	/*
	Method: mix
		Mixes two or more colors with the Color.

	Syntax:
		>var myMix = myColor.mix(color[, color2[, color3[, ...][, alpha]);

	Arguments:
		color - (mixed) A single or many colors, in hex or rgb representation, to mix with this Color.
		alpha - (number, optional) If the last argument is a number, it will be treated as the amount of the color to mix.

	Returns:
		(array) A new Color instance.

	Example:
		[javascript]
			// mix black with white and purple, each time at 10% of the new color
			var darkpurple = new Color('#000').mix('#fff', [255, 0, 255], 10);

			$('myDiv').setStyle('background-color', darkpurple);
		[/javascript]
	*/

	mix: function(){
		var colors = $A(arguments);
		var alpha = ($type(colors.getLast()) == 'number') ? colors.pop() : 50;
		var rgb = this.slice();
		colors.each(function(color){
			color = new Color(color);
			for (var i = 0; i < 3; i++) rgb[i] = Math.round((rgb[i] / 100 * (100 - alpha)) + (color[i] / 100 * alpha));
		});
		return new Color(rgb, 'rgb');
	},

	/*
	Method: invert
		Inverts the Color.

	Syntax:
		>var myInvert = myColor.invert();

	Returns:
		(array) A new Color instance.

	Example:
		[javascript]
			var white = new Color('#fff');
			var black = white.invert();
		[/javascript]
	*/

	invert: function(){
		return new Color(this.map(function(value){
			return 255 - value;
		}));
	},

	/*
	Method: setHue
		Modifies the hue of the Color, and returns a new one.

	Syntax:
		>var hue = myColor.setHue(value);

	Arguments:
		value - (number) The hue to set.

	Returns:
		(array) A new Color instance.

	Example:
		[javascript]
			var myColor = new Color('#f00');
			var myElement = $('myElement');

			(function(){
				myElement.setStyle('color', myColor.setHue(myColor.hsb[0]++)));
			}).periodical(250);
		[/javascript]
	*/

	setHue: function(value){
		return new Color([value, this.hsb[1], this.hsb[2]], 'hsb');
	},

	/*
	Method: setSaturation
		Changes the saturation of the Color, and returns a new one.

	Syntax:
		>var saturate = myColor.setSaturation(percent);

	Arguments:
		percent - (number) The percentage of the saturation to set.

	Returns:
		(array) A new Color instance.

	Example:
		[javascript]
			var myColor = new Color('#f00');
			$('myElement').addEvent('mouseenter', function(){
				this.setStyle('background-color', myColor.setSaturation(myColor.hsb[1]++));
			});
		[/javascript]
	*/

	setSaturation: function(percent){
		return new Color([this.hsb[0], percent, this.hsb[2]], 'hsb');
	},

	/*
	Method: setBrightness
		Changes the brightness of the Color, and returns a new one.

	Syntax:
		>var brighten = myColor.setBrightness(percent);

	Arguments:
		percent - (number) The percentage of the brightness to set.

	Returns:
		(array) A new Color instance.

	Example:
		[javascript]
			var myColor = new Color('#000');
			$('myElement').addEvent('mouseenter', function(){
				this.setStyle('background-color', myColor.setBrightness(myColor.hsb[2]++));
			});
		[/javascript]
	*/

	setBrightness: function(percent){
		return new Color([this.hsb[0], this.hsb[1], percent], 'hsb');
	}

});

/*
Function: $RGB
	Shortcut to create a new color, based on red, green, blue values.

Syntax:
	>var myColor = $RGB(r, g, b);

Arguments:
	r - (number) A red value from 0 to 255.
	g - (number) A green value from 0 to 255.
	b - (number) A blue value from 0 to 255.

Returns:
	(array) A new Color instance.

Example:
	[javascript]
		var myColor = $RGB($random(0,255), $random(0,255), $random(0,255));
	[/javascript]
*/

function $RGB(r, g, b){
	return new Color([r, g, b], 'rgb');
};

/*
Function: $HSB
	Shortcut to create a new color, based on: hue, saturation, brightness values.

Syntax:
	>var myColor = $HSB(h, s, b);

Arguments:
	h - (number) A hue value from 0 to 359.
	s - (number) A saturation value from 0 to 100.
	b - (number) A brightness value from 0 to 100.

Returns:
	(array) A new Color instance.

Example:
	[javascript]
		var myColor = $HSB(50, 50, 100);
	[/javascript]
*/

function $HSB(h, s, b){
	return new Color([h, s, b], 'hsb');
};


/*
Native: String
	Contains String prototypes.

See Also:
	<http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:String>
*/

String.implement({
  
  /*
	Method: hexToRgb
		Converts a hexidecimal color value to RGB. Input string must be in one of the following hexidecimal color formats (with or without the hash).
		>'#ffffff', #fff', 'ffffff', or 'fff'

	Syntax:
		>myString.hexToRgb([array]);

	Arguments:
		array - (boolean, optional) If true is passed, will output an array (eg. ['ff','33','00']) instead of a string (eg. "#ff3300").

	Returns:
		(mixed) A string representing the color in RGB. If the array flag is set, an array will be returned instead.

	Example:
		[javascript]
			"#123".hexToRgb(); //returns "rgb(17,34,51)"
			"112233".hexToRgb(); //returns "rgb(17,34,51)"
			"#112233".hexToRgb(true); //returns [17,34,51]
		[/javascript]

	See Also:
		 <Array.hexToRgb>
	*/

	hexToRgb: function(array){
		var hex = this.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
		return (hex) ? hex.slice(1).hexToRgb(array) : null;
	},

	/*
	Method: rgbToHex
		Converts an RGB color value to hexidecimal. Input string must be in one of the following RGB color formats.
		>"rgb(255,255,255)", or "rgba(255,255,255,1)"

	Syntax:
		>myString.rgbToHex([array]);

	Arguments:
		array - (boolean, optional) If true is passed, will output an array (eg. ['ff','33','00']) instead of a string (eg. "#ff3300").

	Returns:
		(mixed) A string representing the color in hexadecimal,
		or transparent if the fourth value of rgba in the input string is 0. If the array flag is set, an array will be returned instead.

	Example:
		[javascript]
			"rgb(17,34,51)".rgbToHex(); //returns "#112233"
			"rgb(17,34,51)".rgbToHex(true); //returns ['11','22','33']
			"rgba(17,34,51,0)".rgbToHex(); //returns "transparent"
		[/javascript]

	See Also:
		 <Array.rgbToHex>
	*/

	rgbToHex: function(array){
		var rgb = this.match(/\d{1,3}/g);
		return (rgb) ? rgb.rgbToHex(array) : null;
	}
  
});

/*
Native: Array
	Contains Array prototypes.

See Also:
	<http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array>
*/

Array.implement({

	/*
	Method: hexToRgb
		Converts a hexidecimal color value to RGB. Input array must be in one of the following hexidecimal color formats.
		>['ff', 'ff', 'ff'], or ['f', 'f', 'f']

	Syntax:
		myArray.hexToRgb([array]);

	Arguments:
		array - (boolean, optional) If true is passed, will output an array (eg. ['ff','33','00']) instead of a string (eg. "#ff3300").

	Returns:
		(mixed) A string representing the color in RGB. If the array flag is set, an array will be returned instead.

	Example:
		[javascript]
			["1", "2", "3"].hexToRgb(); //returns "rgb(17,34,51)"
			["11", "22", "33"].hexToRgb(); //returns "rgb(17,34,51)"
			["11", "22", "33"].hexToRgb(true); //returns [17,34,51]
		[/javascript]

	See Also:
		 <String.hexToRgb>
	*/

	hexToRgb: function(array){
		if (this.length != 3) return null;
		var rgb = [];
		for (var i = 0; i < 3; i++){
			rgb.push(((this[i].length == 1) ? this[i] + this[i] : this[i]).toInt(16));
		}
		return array ? rgb : 'rgb(' + String(rgb) + ')';
	},

	/*
	Method: rgbToHex
		Converts an RGB color value to hexidecimal. Input array must be in one of the following RGB color formats.
		>[255,255,255], or [255,255,255,1]

	Syntax:
		>myArray.rgbToHex([array]);

	Arguments:
		array - (boolean, optional) If true is passed, will output an array (eg. ['ff','33','00']) instead of a string (eg. "#ff3300").

	Returns:
		(mixed) A string representing the color in hexadecimal, or transparent if the fourth value of rgba in the input array is 0.
		If the array flag is set, an array will be returned instead.

	Example:
		[javascript]
			[17,34,51].rgbToHex(); //returns "#112233"
			[17,34,51].rgbToHex(true); //returns ['11','22','33']
			[17,34,51,0].rgbToHex(); //returns "transparent"
		[/javascript]

	See Also:
		 <String.rgbToHex>
	*/

	rgbToHex: function(array){
		if (this.length < 3) return null;
		if (this.length == 4 && this[3] == 0 && !array) return 'transparent';
		var hex = [];
		for (var i = 0; i < 3; i++){
			var bit = (this[i] - 0).toString(16);
			hex.push((bit.length == 1) ? '0' + bit : bit);
		}
		return array ? hex : '#' + hex.join('');
	},
	
	/*
	Method: rgbToHsb
		Converts a RGB array to an HSB array.

	Syntax:
		>var myHSB = myRGBArray.rgbToHsb();

	Returns:
		(array) An array with HSB values.

	Example:
		[javascript]
			var myHSB = [255, 0, 0].rgbToHsb(); //myHSB = [0, 100, 100]
		[/javascript]
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
	Method: rgbToHsb
		Converts a HSB array to an RGB array.

	Syntax:
		>var myRGB = myHSBArray.hsbToRgb();

	Returns:
		(array) An array with RGB values.

	Example:
		[javascript]
			var myRGB = [0, 100, 100].hsbToRgb(); //myRGB = [255, 0, 0]
		[/javascript]
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
			switch (Math.floor(hue / 60)){
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
