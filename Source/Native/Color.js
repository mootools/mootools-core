/*
Script: Color.js
	Class for creating and manipulating colors in JavaScript. Includes HSB «-» RGB «-» HEX conversions.

License:
	MIT-style license.
*/

var Color = new Native('Color', function(color, type){
	if (!type) switch (typeOf(color)){
		case 'color': return color;
		case 'string': type = (type = color.match(/^[rgbhs]{3,4}/)) ? type[0] : 'hex'; break;
		case 'array': type = 'rgb'; break;
		case 'number': type = 'hex'; break;
	}
	this.type = type;
	color = Color['parse' + type.toUpperCase()](color);
	if (color[3] == null) color[3] = 1;
	this.color = color;
	
	return null;
});

Color.extend({
	
	check: function(value){
		var match = value.match(/^(rgb|hsb|#)a?/);
		if (match) return (match[1] == '#') ? 'hex' : match[1];
		return false;
	},
	
	parseHEX: function(color){
		var type = typeOf(color);
		if (type == 'number') color = color.toString(16);
		if (color.length == 1) color = color + color + color;
		return ((type != 'array') ? color.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})(\w{0,2})?$/).slice(1) : color).map(function(bit, i){
			if (i == 3) return (bit) ? parseInt(bit, 16) / 255 : 1;
			return (bit.length == 1) ? bit + bit : bit;
		});
	},
	
	parseRGB: function(color){
		return ((typeOf(color) == 'string') ? color.match(/([-\d.]+)/g) : color).map(function(bit, i){
			return (i < 3) ? Math.round(((bit %= 256) < 0) ? bit + 256 : bit) : Number(bit).limit(0, 1);
		});
	},
	
	parseHSB: function(color){
		return ((typeOf(color) == 'string') ? color.match(/([-\d.]+)/g) : color).map(function(bit, i){
			if (i === 0) return Math.round(((bit %= 360) < 0) ? (bit + 360) : bit);
			else if (i < 3) return Math.round(bit).limit(0, 100);
			else return Number(bit).limit(0, 1);
		});
	},
	
	HEXToRGB: function(hex){
		return hex.map(function(bit){
			return parseInt(bit, 16);
		}).slice(0, 3);
	},

	HEXToHSB: function(hex){
		return Color.RGBToHSB(Color.HEXToRGB(hex));
	},

	RGBToHSB: function(rgb){
		var red = rgb[0], green = rgb[1], blue = rgb[2];
		var max = Math.max(red, green, blue), min = Math.min(red, green, blue), delta = max - min;
		var hue = 0, saturation = (max != 0) ? delta / max : 0, brightness = max / 255;
		if (saturation){
			var rr = (max - red) / delta, gr = (max - green) / delta, br = (max - blue) / delta;
			if (red == max) hue = br - gr;
			else if (green == max) hue = 2 + rr - br;
			else hue = 4 + gr - rr;
			hue /= 6;
			if (hue < 0) hue++;
		}
		return [Math.round(hue * 360), Math.round(saturation * 100), Math.round(brightness * 100)];
	},

	RGBToHEX: function(rgb){
		return rgb.map(function(bit){
			bit = bit.toString(16);
			return (bit.length == 1) ? '0' + bit : bit;
		}).slice(0, 3);
	},

	HSBToRGB: function(hsb){
		var br = Math.round(hsb[2] / 100 * 255);
		if (hsb[1] == 0){
			return [br, br, br];
		} else {
			var hue = hsb[0] % 360;
			var f = hue % 60;
			var p = Math.round((hsb[2] * (100 - hsb[1])) / 10000 * 255);
			var q = Math.round((hsb[2] * (6000 - hsb[1] * f)) / 600000 * 255);
			var t = Math.round((hsb[2] * (6000 - hsb[1] * (60 - f))) / 600000 * 255);
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
	},

	HSBToHEX: function(hsb){
		return Color.RGBToHEX(Color.HSBToRGB(hsb));
	}
	
});

Color.implement({

	set: function(name, value){
		var hsb = ['hue', 'saturation', 'brightness'], rgb = ['red', 'green', 'blue'], index;
		
		if (name == 'alpha'){
			this.color[3] = Number(value).limit(0, 1);
		} else if ((index = hsb.indexOf(name)) > -1){
			var chsb = this.toArray('hsb');
			chsb[index] = value;
			this.color = Color.parseHSB(chsb);
			this.type = 'hsb';
		} else if ((index = rgb.indexOf(name)) > -1){
			var crgb = this.toArray('rgb');
			crgb[index] = value;
			this.color = Color.parseRGB(crgb);
			this.type = 'rgb';
		}
		
		return this;
	},
	
	get: function(name){
		if (name == 'alpha') return this.color[3];
		
		var hsb = ['hue', 'saturation', 'brightness'], rgb = ['red', 'green', 'blue'], index;
		if ((index = hsb.indexOf(name)) > -1) return this.toArray('hsb')[index];
		if ((index = rgb.indexOf(name)) > -1) return this.toArray('rgb')[index];

		return null;
	},
	
	copy: function(){
		return new Color(this.color, this.type);
	},

	toRGB: function(){
		return this.toString('rgb');
	},

	toHSB: function(){
		return this.toString('hsb');
	},

	toHEX: function(){
		return this.toString('hex');
	},
	
	toArray: function(to){
		if (to == this.type) return Object.clone(this.color);
		var color = Color[this.type.toUpperCase() + 'To' + (to || 'rgb').toUpperCase()](this.color);
		color[3] = this.color[3];
		return color;
	}

}).implement('toString', function(type){

	type = type || 'rgb';

	if (type == 'hex'){
		var hex = this.toArray('hex');
		var alpha = hex[3];
		if (alpha != 1){
			alpha = Math.round((alpha * 255)).toString(16);
			if (alpha.length == 1) alpha += alpha;
			hex[3] = alpha;
		}
		else hex = hex.slice(0, 3);
		return '#' + hex.join('');
	}
	var bits = this.toArray(type);
	if (bits[3] == 1) bits = bits.slice(0, 3);
	else type = type + 'a';

	return type + '(' + bits.join(', ') + ')';

});

var hex = Color.hex = function(hex){
	return new Color(hex, 'hex');
};

var hsb = Color.hsb = function(h, s, b, a){
	return new Color([h || 0, s || 0, b || 0, (a == null) ? 1 : a], 'hsb');
};

var rgb = Color.rgb = function(r, g, b, a){
	return new Color([r || 0, g || 0, b || 0, (a == null) ? 1 : a], 'rgb');
};
