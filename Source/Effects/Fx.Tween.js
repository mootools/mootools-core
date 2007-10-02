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

	/*
	Method: hide
		Same as <Fx.set>(0). Hides the element immediately without transition.

	Syntax:
		>myFx.hide();

	Returns:
		(class) This Fx.Tween instance.

	Example:
		[javascript]
			var myFx = new Fx.Tween('myElement', 'opacity').hide(); // *poof*
		[/javascript]

	Note:
		Due to inheritance the Event 'onSet' will be fired.
	*/

	hide: function(){
		return this.set(0);
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

Element.implement({
	
	/*
	Method: tween
		Tweens an element property between one or more values.

	Syntax:
		>myElement.morph(property, value[, options]);

	Arguments:
		property - (string) the css property you want to animate.
		value - (mixed) the value you want the property to tween to.
		options - (object, optional) The <Fx.Morph> options parameter.

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
		var tween = this.$attributes.$tween;
		if (tween) tween.stop();
		if (options || !tween) tween = new Fx.Tween(this, property, options);
		this.$attributes.$tween = tween;
		tween.start(value);
		return this;
	},
	
	/*
	Method: fade
		fades an element in or out.

	Syntax:
		>myElement.fade(how[, options]);

	Arguments:
		how - (string, optional) can be in, out, toggle, hide and show. Defaults to toggle.
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
	
	fade: function(){
		var fade = this.$attributes.$fade;
		if (fade) fade.stop();
		var params = Array.link(arguments, {options: Object.type, how: String.type});
		if (params.options || !fade) fade = new Fx.Tween(this, 'opacity', params.options);
		switch(params.how){
			case 'in': fade.start(1); break;
			case 'out': fade.start(0); break;
			case 'show': fade.set(1); break;
			case 'hide': fade.set(0); break;
			default: fade.start((this.getStyle('visibility') == 'hidden') ? 1 : 0);
		}
		this.$attributes.$fade = fade;
		return this;
	}

});