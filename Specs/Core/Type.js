/*
---
name: Type
requires: ~
provides: ~
...
*/

(function(){

var Instrument = new Type('Instrument', function(name){
	this.name = name;
});

Instrument.implement({

	method: function(){
		return this.property + ' ' + this.name;
	},

	property: 'stuff'

});

var Car = new Type('Car', function(name){
	this.name = name;
});

Car.implement({

	property: 'stuff',

	method: function(){
		return this.name + '_' + this.property;
	}

});

describe('Type (private)', function(){

	it('should allow implementation over existing methods when browser option is not set', function(){
		Instrument.implement({ property: 'staff' });
		var myInstrument = new Instrument('xeelophone');
		expect(myInstrument.method()).to.equal('staff xeelophone');
	});

	it('should allow generic calls', function(){
		expect(Car.method({name: 'ciccio', property: 'bello'})).to.equal('ciccio_bello');
	});

	it('should have a "native" type', function(){
		expect(Type.isType(Car)).to.equal(true);
	});

});

})();
