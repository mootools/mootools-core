/*
Script: Core.js
	Private Specs for Core.js 1.2

License:
	MIT-style license.
*/

(function(){

var Instrument = new Native({

	name: 'instrument',

	initialize: function(name){
		this.name = name;
	}

});

Instrument.implement({

	method: function(){
		return this.property + ' ' + this.name;
	},

	property: 'stuff'

});

var Car = new Native({

	name: 'car',

	initialize: function(name){
		this.name = name;
	}

});

Car.implement({

	property: 'stuff',

	method: function(){
		return this.name + '_' + this.property;
	}

});

describe('Native (private)', {

	'should allow implementation over existing methods when browser option is not set': function(){
		Instrument.implement({ property: 'staff' });
		var myInstrument = new Instrument('xeelophone');
		expect(myInstrument.method()).toEqual('staff xeelophone');
	},

	'should allow generic calls': function(){
		expect(Car.method({name: 'ciccio', property: 'bello'})).toEqual('ciccio_bello');
	},

	"should have a 'native' type": function(){
		expect(Native.type(Car)).toBeTruthy();
	}

});

})();
