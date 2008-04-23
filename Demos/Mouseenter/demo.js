window.addEvent('domready', function(){
	//First Example
	var el = $('myElement'),
		color = el.getStyle('backgroundColor');
	
	// We are setting the opacity of the element to 0.5 and adding two events
	$('myElement').set('opacity', 0.5).addEvents({
		mouseenter: function(){
			// This morphes the opacity and backgroundColor
			this.morph({
				'opacity': 1,
				'background-color': '#c6d880'
			});
		},
		mouseleave: function(){
			// Morphes back to the original style
			this.morph({
				opacity: 0.5,
				backgroundColor: color
			});
		}
	});

	// Second Example
	
	// The same as before: adding events
	$('myOtherElement').addEvents({
		'mouseenter': function(){
			// Always sets the duration of the tween to 1000 ms and a bouncing transition
			// And then tweens the height of the element
			this.set('tween', {
				duration: 1000,
				transition: Fx.Transitions.Bounce.easeOut // This could have been also 'bounce:out'
			}).tween('height', '150px');
		},
		'mouseleave': function(){
			// Resets the tween and changes the element back to its original size
			this.set('tween', {}).tween('height', '20px');
		}
	});
});