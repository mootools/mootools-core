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

	protect: true,

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
		value_of(myInstrument.method()).should_be('staff xeelophone');
	},

	'should not override existing methods when browser option is set': function(){
		Car.implement({ property: 'staff' });
		var myCar = new Car('smart');
		value_of(myCar.method()).should_be('smart_stuff');
	},

	'should allow generic calls': function(){
		value_of(Car.method({name: 'ciccio', property: 'bello'})).should_be('ciccio_bello');
	},

	"should have a 'native' type": function(){
		value_of(Native.type(Car)).should_be_true();
	}

});

})();