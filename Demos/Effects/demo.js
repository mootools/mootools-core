window.addEvent('domready', function() {
	var el = $('myElement');
	
	// MooTools is able to handle effects without the use of a wrapper,
	// so you are able to do effects with just one easy line.
	
	//FIRST EXAMPLE
	
	// There are different ways to add a fading opacity effect to an element click
	
	// Short version
	$('fadeOpacity').addEvent('click', el.fade.bind(el, [0]));
	
	// Long version
	$('tweenOpacity').addEvent('click', function(e) {
		// You often will need to stop propagation of the event
		e.stop();
		el.fade(1);
	});
	
	$('tweenOpacity1').addEvent('click', function(e) {
		e.stop();
		el.fade(0.3);
	});
	
	
	//SECOND EXAMPLE
	var otherEl = $('myOtherElement');
	
	$('heightEffect').addEvent('click', otherEl.tween.bind(otherEl, ['height', '50px']));
	
	// We can also create an Fx.Tween instance and use a wrapper variable
	
	var myEffect = new Fx.Tween(otherEl);
	$('colorEffect').addEvent('click', function(e) {
		e.stop();
		// We change the background-color of the element
		myEffect.start('background-color', '#E6EFC2');
	});
	
	$('borderEffect').addEvent('click', function(e) {
		e.stop();
		otherEl.tween('border', '10px dashed #C6D880');
	});
	
	$('resetEffect').addEvent('click', function(e) {
		e.stop();
		otherEl.erase('style');
	});
	
	
	//THIRD EXAMPLE
	
	var anotherEl = $('anotherElement');
	
	// Again we are able to create a morph instance
	var morph = new Fx.Morph('anotherElement');
	
	$('morphEffect').addEvent('click', function(e) {
		e.stop();
		morph.start({
			width: '200px',
			color: '#C6D880'
		});
	});
	
	// Or we just use Element.morph
	$('CSSmorphEffect').addEvent('click', function(e) {
		e.stop();
		// Changes the element's style to .myClass defined in the CSS
		anotherEl.morph('.myClass');
	});
	
	$('resetEffect1').addEvent('click', function(e) {
		e.stop();
		// You need the same selector defined in the CSS-File
		anotherEl.morph('div.demoElement');
	});
});