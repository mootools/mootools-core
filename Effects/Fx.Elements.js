/*
Script: Fx.Elements.js
	Contains <Fx.Elements>

License:
	MIT-style license.
*/

/*
Class: Fx.Elements
	Fx.Elements allows you to apply any number of styles transitions to a collection of Elements.

Extends:
	<Fx>

Syntax:
	>myFx = new Fx.Elements(elements[, options]);

Arguments:
	elements - (array) A collection of Elements the effects will be applied to.
	options - (object, optional) Same as <Fx> options.

Returns:
	(class) A new Fx.Elements instance.

Example:
	[javascript]
		var myFx = new Fx.Elements($$('.myElementClass'), {
			onComplete: function(){
				alert('complete');
			}
		}).start({
			'0': {
				'height': [200, 300],
				'opacity': [0,1]
			},
			'1': {
				'width': [200, 300],
				'opacity': [1,0]
			}
		});
	[/javascript]

Note:
	Includes colors but must be in hex format.
*/

Fx.Elements = new Class({

	Extends: Fx,

	initialize: function(elements, options){
		this.parent(elements, options);
		this.elements = $$(this.element);
	},

	setNow: function(){
		for (var i in this.from){
			var iFrom = this.from[i], iTo = this.to[i], iNow = this.now[i] = {};
			for (var p in iFrom) iNow[p] = Fx.CSS.compute(iFrom[p], iTo[p], this);
		}
	},

	/*
	Method: set
		Applies the passed in style transitions to each object named immediately (see example).

	Syntax:
		>myFx.set(to);

	Arguments:
		to - (object) An object where each item in the collection is refered to as a numerical string ("1" for instance). The first item is "0", the second "1", etc.

	Returns:
		(class) This Fx.Elements instance.

	Example:
		[javascript]
			var myFx = new Fx.Elements($$('.myClass')).set({
				'0': {
					'height': 200,
					'opacity': 0
				},
				'1': {
					'width': 300,
					'opacity': 1
				}
			});
		[/javascript]
	*/
	Method:
	set: function(to){
		var parsed = {};
		this.css = {};
		for (var i in to){
			var iTo = to[i], iParsed = parsed[i] = {};
			for (var p in iTo) iParsed[p] = Fx.CSS.set(iTo[p]);
		}
		return this.parent(parsed);
	},

	/*
	Method: start
		Applies the passed in style transitions to each object named (see example).

	Syntax:
		>myFx.start(obj);

	Arguments:
		obj - (object) An object where each item in the collection is refered to as a numerical string ("1" for instance). The first item is "0", the second "1", etc.

	Returns:
		(class) This Fx.Elements instance.

	Example:
		[javascript]
			var myElementsEffects = new Fx.Elements($$('a'));
			myElementsEffects.start({
				'0': { //let's change the first element's opacity and width
					'opacity': [0,1],
					'width': [100,200]
				},
				'4': { //and the fifth one's opacity
					'opacity': [0.2, 0.5]
				}
			});
		[/javascript]
	*/

	start: function(obj){
		if (this.timer && this.options.wait) return this;
		this.now = {};
		this.css = {};
		var from = {}, to = {};
		for (var i in obj){
			var iProps = obj[i], iFrom = from[i] = {}, iTo = to[i] = {};
			for (var p in iProps){
				var parsed = Fx.CSS.prepare(this.elements[i], p, iProps[p]);
				iFrom[p] = parsed.from;
				iTo[p] = parsed.to;
			}
		}
		return this.parent(from, to);
	},

	increase: function(){
		for (var i in this.now){
			var iNow = this.now[i];
			for (var p in iNow) this.elements[i].setStyle(p, Fx.CSS.serve(iNow[p], this.options.unit));
		}
	}

});