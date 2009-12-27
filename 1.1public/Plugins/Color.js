describe('Color', {

	'Should parse a hex value': function(){
		value_of(new Color('#000')).should_be([0,0,0]);
	},

	
	'Should mix two colors': function(){
		value_of(new Color('#000').mix('#fff', new Color([255,0,255]), 10)).should_be([49,23,49]);
	},
	
	'Should invert a color': function(){
		value_of(new Color('#000').invert()).should_be([255,255,255]);
	},
	
	'Should alter the Hue of a color': function(){
		value_of(new Color('#F00').setHue(55)).should_be([255,234,0]);
	},
	
	'Should alter the Saturation of a color': function(){
		value_of(new Color('#F00').setSaturation(55)).should_be([255,115,115]);
	},
	
	'Should alter the Brightness of a color': function(){
		value_of(new Color('#F00').setBrightness(55)).should_be([140,0,0]);
	},

	'$RGB': function(){
		value_of($RGB(10, 20, 30)).should_be([10, 20, 30]);
	},
	
	'$HSB': function(){
		value_of($HSB(10, 20, 30)).should_be([77, 64, 61]);
	},
	
	'Array.rgbToHsb': function(){
		value_of([10, 20, 30].rgbToHsb()).should_be([210, 67, 12]);
	},

	'Array.hsbToRgb': function(){
		value_of([10, 20, 30].hsbToRgb()).should_be([77, 64, 61]);
	}


});
