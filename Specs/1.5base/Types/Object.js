/*
---
name: Object Specs
description: n/a
requires: [Core/Object]
provides: [Object.Specs]
...
*/
(function(){

var object = {
	a: 'a',
	one: {
		b: 'b',
		two: {
			c: 'c',
			three: 'three'
		}
	}
}

describe("Object Methods", {

	// Object set
	
	"should set the last position of the object path to the specified value": function(){
		Object.set(object, 'one.two.three', 'three');
		Object.set(object, 'one.b', 2);
		Object.set(object, 'x.y.z', 'z');
	},
	
	// Object get
	
	"should return the correct value for the object path": function(){
		expect(Object.get(object, 'one.two')).toEqual({ c: 'c', three: 3 });
		expect(Object.get(object, 'one.b')).toEqual(2);
		expect(Object.get(object, 'x.y')).toEqual({ z: 'z' });
	},

});

})();