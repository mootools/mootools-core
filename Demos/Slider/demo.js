//First Example
window.addEvent('domready', function(){
	var el = $('myElement'),
		font = $('fontSize');
	
	// Create the new slider instance
	new Slider(el, el.getElement('.knob'), {
		steps: 40,	// There are 40 steps
		range: [8],	// Minimum value is 8
		onChange: function(value){
			// Everytime the value changes, we change the font of an element
			font.setStyle('font-size', value+'px');
		}
	}).set(font.getStyle('font-size').toInt());
	

	// Second Example
	var el = $('setColor'),	slider = [], color = [];
	
	// We define a function to call after every change
	var fn = function(){
		// Based on the Slider values we create a RGB color array
		// or set it based on slider steps
		color = (slider.length == 3) ? slider.map(function(value){
			return value.step;
		}) : [0, 0, 0];
		
		el.setStyle('color', color).set('text', color.rgbToHex());
	}
	
	document.getElements('div.slider.advanced').each(function(el, i){
		slider[i] = new Slider(el, el.getElement('.knob'), {
			steps: 255,		//Steps from 0 to 255
			wheel: true,	// Using the mousewheel is possible too 
			onChange: fn
		}).set(0);
	});
	
	// We call that function to initially set up the color
	fn();
});