Class: Fx.Tween {#Fx.Tween}
===========================

Contains <Fx.Tween>, and the Element shortcut <Element.tween>

### Extends:

<Fx>



Fx.Tween Method: constructor {#Fx.Tween:constructor}
----------------------------------------------------

The Tween effect, used to transition any CSS property from one value to another.

### Syntax:

var myFx = new Fx.Tween(element, property[, options]);

### Arguments:

* element  - (mixed) An Element or the string id of an Element to apply the transition to.
* property - (string) The CSS property to transition.
* options  - (object, optional) The <Fx> options object.

### Properties:

* property - (string) The property being transitioned.

### Notes:

* Colors must be in hex format.

### See Also:

<Fx>



Fx.Tween Method: set {#Fx.Tween:set}
------------------------------------

Sets the Element's CSS property to the specified value immediately.

### Syntax:

	myFx.set(to);

### Arguments:

1. value - (mixed) The value to set this instances CSS property to.

### Returns:

(object) This Fx.Tween instance.

### Example:

	var marginFx = new Fx.Tween('myElement', 'margin-top').set(10); //margin-top is set to 10px immediately

	/*
	Method: start
		Displays the transition to the value/values passed in

	Syntax:
		>myFx.start([from,] to);

	Arguments:
		from - (integer, optional: defaults to the current style value) The starting value for the transition.
		to   - (integer) The ending value for the transition.

	Returns:
		(object) This Fx.Tween instance.

	Example:
		[javascript]
			var marginFx = new Fx.Tween('myElement', 'margin-top').start(10); //tries to read current margin top value and goes from current to 10
		[/javascript]

	Note:
		If you provide only one argument, the transition will use the current css value for its starting value.
	*/

});

/*
Native: Element
	Custom Native to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/


/*
Element Property: tween
	sets and gets a default Fx.Tween instance for an element

Set Syntax:
	>el.set('tween'[, options]);

Set Arguments:
	options - (object) the Fx.Tween options.

Set Returns:
	(element) this element

Set Example:
	[javascript]
		el.set('tween', {duration: 'long'});
		el.tween('opacity', 0);
	[/javascript]

Get Syntax:
	>el.get('tween', property[, options]);

Get Arguments:
	property - (string) the Fx.Tween property argument.
	options - (object) the Fx.Tween options.
	
Get Returns:
	(object) The Fx.Tween instance

Get Example:
	[javascript]
		el.get('tween', 'opacity', {duration: 'long'}).start(0);
	[/javascript]
*/

Element.Properties.tween = {
	
	set: function(options){
		var tween = this.retrieve('tween');
		if (tween) tween.cancel();
		return this.store('tween', new Fx.Tween(this, null, $extend({link: 'cancel'}, options)));
	},
	
	get: function(property, options){
		if (options || !this.retrieve('tween')) this.set('tween', options);
		var tween = this.retrieve('tween');
		tween.property = property;
		return tween;
	}
	
};

Element.implement({

	highlight: function(color){
		this.get('tween', 'background-color').start(color || '#face8f', function(){
			var style = this.getStyle('background-color');
			return (style == 'transparent') ? '#ffffff' : style;
		}.bind(this));
		return this;
	},

	/*
	Method: tween
		Tweens an element property between one or more values.

	Syntax:
		>myElement.morph(property, value[, options]);

	Arguments:
		property - (string) the css property you want to animate.
		value - (mixed) the value you want the property to tween to.
		options - (object, optional) The <Fx.Tween> options parameter.

	Returns:
		(element) this Element.

	Example:
		[javascript]
			$('myElement').tween('opacity', 0);
		[/javascript]

	See Also:
		<Fx.Tween>
	*/

	tween: function(property, value){
		this.get('tween', property).start(value);
		return this;
	},

	/*
	Method: fade
		fades an element in or out.

	Syntax:
		>myElement.fade(how[, options]);

	Arguments:
		how - (string) can be in, out, toggle, hide and show. defaults to 'toggle'.
		options - (object, optional) The <Fx.Tween> options parameter.

	Returns:
		(element) this Element.

	Example:
		[javascript]
			$('myElement').fade('in');
		[/javascript]

	See Also:
		<Fx.Tween>, <Element.slide>
	*/

	fade: function(how){
		var fade = this.get('tween', 'opacity');
		how = $pick(how, 'toggle');
		switch (how){
			case 'in': fade.start(1); break;
			case 'out': fade.start(0); break;
			case 'show': fade.set(1); break;
			case 'hide': fade.set(0); break;
			case 'toggle': fade.start((function(){
				return (this.getStyle('visibility') == 'hidden') ? 1 : 0;
			}).bind(this)); break;
			default: fade.start(how);
		}
		return this;
	}

});
