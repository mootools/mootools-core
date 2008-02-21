// We define a custom event called "keyenter" which is based und the keyup-Event
Element.Events.keyenter = {
	base: 'keyup',
	condition: function(e){
		// We can basically put any logic here.
		// In this example we return true, when the pressed key is the
		// Enter-Button so the keyenter event gets fired.
		return e.key=='enter';
	}
};

window.addEvent('domready', function(){
	// First Example
	
	// Here we add the custom event to the input-element
	$('myElement').addEvent('keyenter', function(e){
		// We can do everything here: submitting a form, sending an AJAX-Request and so on
		// because it only fires when the user presses the Enter-Button
		e.stop();
		
		// But instead we only change the text of an element.
		$('myDivElement').set('text', 'You pressed enter').highlight(); 
	});
	
	
	// Second Example
	var el = $('myScrollElement'),
		color = new Color(el.getStyle('background-color')).hsb;
	
	el.addEvent('mousewheel', function(e){
		// Again we just set the text of an element and highlight it
		$('myOtherDivElement').set('text', 'Wheel '+(e.wheel<0 ? 'down' : 'up')).highlight();
		
		// But we add some nice logic to it and change do some color stuff
		
		var hue = color[0];
		if (e.wheel<0) {
			hue -= 5;
			if(hue < 0) hue = 360;
		} else {
			hue += 5;
			if (hue > 360) hue = 0;
		}
		
		color[0] = hue;
		
		this.setStyle('background-color', color.hsbToRgb());
	});
});