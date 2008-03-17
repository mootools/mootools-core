Class: Fx.Elements {#Fx-Elements}
=================================

Fx.Elements allows you to apply any number of styles transitions to a collection of Elements.

### Extends:

[Fx][]

### Syntax:

	new Fx.Elements(elements[, options]);

### Arguments:

1. elements - (*array*) A collection of Elements the effects will be applied to.
2. options  - (*object*, optional) Same as [Fx][] options.


### Returns:

* (*object*) A new Fx.Elements instance.

### Examples:

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

### Notes:

- Includes colors but must be in hex format.



Fx.Elements Method: set {#Fx-Elements:set}
------------------------------------------

Applies the passed in style transitions to each object named immediately (see example).

###	Syntax:

	myFx.set(to);

### Arguments:

1. to - (*object*) An object where each item in the collection is refered to as a numerical string ("1" for instance). The first item is "0", the second "1", etc.

###	Returns:

* (*object*) This Fx.Elements instance.

###	Examples:

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



Fx.Elements Method: start {#Fx-Elements:start}
----------------------------------------------

Applies the passed in style transitions to each object named (see example).

###	Syntax:

	myFx.start(obj);

###	Arguments:

1. obj - (*object*) An object where each item in the collection is refered to as a numerical string ("1" for instance). The first item is "0", the second "1", etc.

###	Returns:

* (*object*) This Fx.Elements instance.

###	Examples:

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



[Fx]: /Fx/Fx