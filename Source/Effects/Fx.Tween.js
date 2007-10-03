/*
Script: Fx.Tween.js
	Contains <Fx.Tween>, and the Element shortcut <Element.tween>

License:
	MIT-style license.
*/

/*
Class: Fx.Tween
	The Style effect, used to transition any css property from one value to another. Includes colors.

Syntax:
	>var myFx = new Fx.Tween(element, property[, options]);

Arguments:
	el       - (mixed) A string ID of the Element or an Element to apply the style transitions to.
	property - (string) The property to transition.
	options  - (object, optional) The <Fx> options object.

Properties:
	All the properties in <Fx> in addition to:
	property - (string) The property being transitioned.

Returns:
	(object) A new Fx.Tween instance.

Example:
	[javascript]
		var marginFx = new Fx.Tween('myElement', 'margin-top', {duration:500}).start(10, 100);
	[/javascript]

Note:
	Colors must be in hex format.

See Also:
	<Fx>
*/

Fx.Tween = new Class({

	Extends: Fx,

	initialize: function(element, property, options){
		arguments.callee.parent($(element), options);
		this.property = property;
	},

	setNow: function(){
		this.now = Fx.CSS.compute(this.from, this.to, this);
	},

	/*
	Method: set
		Sets the Element's css property to the specified value immediately.

	Syntax:
		>myFx.set(to);

	Arguments:
		to - (mixed) Sets the Element to the value.

	Returns:
		(class) This Fx.Tween instance.

	Example:
		[javascript]
			var marginFx = new Fx.Tween('myElement', 'margin-top').set(10); //margin-top is set to 10px immediately
		[/javascript]
	*/

	set: function(to){
		return arguments.callee.parent(Fx.CSS.set(to));
	},

	/*
	Method: start
		Displays the transition to the value/values passed in

	Syntax:
		>myFx.start([from,] to);

	Arguments:
		from - (integer, optional: defaults to the current style value) The starting value for the transition.
		to   - (integer) The ending value for the transition.

	Returns:
		(class) This Fx.Tween instance.

	Example:
		[javascript]
			var marginFx = new Fx.Tween('myElement', 'margin-top').start(10); //tries to read current margin top value and goes from current to 10
		[/javascript]

	Note:
		If you provide only one argument, the transition will use the current css value for its starting value.
	*/

	start: function(from, to){
		if (this.timer && this.options.wait) return this;
		var parsed = Fx.CSS.prepare(this.element, this.property, [from, to]);
		return arguments.callee.parent(parsed.from, parsed.to);
	},

	increase: function(){
		this.element.setStyle(this.property, Fx.CSS.serve(this.now, this.options.unit));
	}

});

/*
Native: Element
	Custom Native to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

Element.Set.extend({
	
	/*
	Element Setter: tween
		sets a default Fx.Tween instance for an element

	Syntax:
		>el.set('tween'[, options]);

	Arguments: 
		options - (object) the Fx.Tween options.

	Returns:
		(element) this element

	Example:
		[javascript]
			el.set('tween', {duration: 'long', transition: 'bounce:out'});
			el.tween('opacity', 0);
		[/javascript]
	*/

	tween: function(options){
		if (this.$attributes.$tween) this.$attributes.$tween.stop();
		this.$attributes.$tween = new Fx.Tween(this, null, options);
		return this;
	},
	
	/*
	Element Setter: fade
		sets a default Fx.Tween instance for an element (with opacity set as its property)

	Syntax:
		>el.set('fade'[, options]);

	Arguments: 
		options - (object) the Fx.Tween options.

	Returns:
		(element) this element

	Example:
		[javascript]
			el.set('fade', {duration: 'long', transition: 'bounce:out'});
			el.fade('out');
		[/javascript]
	*/
	
	fade: function(options){
		if (this.$attributes.$fade) this.$attributes.$fade.stop();
		this.$attributes.$fade = new Fx.Tween(this, 'opacity', options);
		return this;
	}

});


Element.Get.extend({
	
	/*
	Element Getter: tween
		gets the previously setted Fx.Tween instance or a new one with default options.

	Syntax:
		>el.get('tween');
		
	Arguments:
		property - (string) the Fx.Tween property you want to associate with the instance.

	Returns:
		(object) the Fx.Tween instance

	Example:
		[javascript]
			el.set('tween', {duration: 'long', transition: 'bounce:out'});
			el.tween('height', 0);

			el.get('tween', 'height'); //the Fx.Tween instance, with height as property
		[/javascript]
	*/
	
	tween: function(property){
		if (!this.$attributes.$tween) this.set('tween');
		this.$attributes.$tween.property = property;
		return this.$attributes.$tween;
	},
	
	/*
	Element Getter: fade
		gets the previously setted Fx.Tween (with 'opacity' set) instance or a new one with default options.

	Syntax:
		>el.get('fade');

	Returns:
		(object) the Fx.Tween instance

	Example:
		[javascript]
			el.set('fade', {duration: 'long', transition: 'bounce:out'});
			el.fade('in');

			el.get('fade'); //the Fx.Tween instance (with opacity option)
		[/javascript]
	*/
	
	fade: function(){
		if (!this.$attributes.$fade) this.set('fade');
		return this.$attributes.$fade;
	}

});

Element.implement({
	
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
	
	tween: function(property, value, options){
		if (options) this.set('tween', options);
		this.get('tween', property).stop().start(value);
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
	
	fade: function(how, options){
		how = how || 'toggle';
		if (options) this.set('fade', options);
		var fade = this.get('fade').stop();
		switch(how){
			case 'in': fade.start(1); break;
			case 'out': fade.start(0); break;
			case 'show': fade.set(1); break;
			case 'hide': fade.set(0); break;
			case 'toggle': fade.start((this.getStyle('visibility') == 'hidden') ? 1 : 0);
		}
		return this;
	}

});