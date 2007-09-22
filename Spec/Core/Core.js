/*
Script: Core.js
	Examples for Core.js

License:
	MIT-style license.
*/

describe('$random', {
	
	return_result_between_scope: function(){
		var rand = $random(1, 3);
		value_of((rand <= 3 && rand >= 1)).should_be_true();
	}

});

describe('$try', {
	
	return_function_result_when_successful: function(){
		var k = $try(function(){
			return 'success';
		});
		
		value_of(k).should_be('success');
	},
	
	return_false_when_failed: function(){
		var k = $try(function(){
			return me_invented_this();
		});
		
		value_of(k).should_be_false();
	}

});

describe('$extend', {
	
	extend_objects: function(){
		var ob1 = {a: 1, b: 2};
		var ob2 = {b: 3, c: 4};
		$extend(ob1, ob2);
		value_of(ob1).should_be({a: 1, b: 3, c: 4});
	}

});

describe('$merge', {
	
	merge_with_3_objects: function(){
		var ob1 = {a: {a: 1, b: 2, c: 3}, b: 2};
		var ob2 = {a: {a: 2, b: 8, c: 3, d: 8}, b: 3, c: 4};
		var ob3 = {a: {a: 3}, b: 3, c: false};
		value_of($merge(ob1, ob2, ob3)).should_be({a: {a: 3, b: 8, c: 3, d:8}, b: 3, c: false});
	}

});

describe('$clear', {
	
	clear_timeouts_and_periodicals: function(){
		var timeout = setTimeout(function(){}, 100);
		var periodical = setTimeout(function(){}, 100);
		
		value_of($clear(timeout)).should_be_null();
		value_of($clear(periodical)).should_be_null();
	}

});

describe('$splat', {
	
	transform_non_array_to_array: function(){
		value_of($splat(1)).should_be([1]);
	},
	
	transform_undefined_and_null_to_empty_array: function(){
		value_of($splat(null)).should_be([]);
		value_of($splat(undefined)).should_be([]);
	},
	
	leave_arrays_alone: function(){
		value_of($splat([1,2,3])).should_be([1,2,3]);
	}

});

describe('$pick', {
	
	choose_false_out_of_null_and_undefined: function(){
		var picked1 = $pick(null, undefined, false, [1,2,3], {});
		value_of(picked1).should_be_false();
	},
	
	choose_the_first_defined_value: function(){
		var picked1 = $pick(null, undefined, null, [1,2,3], {});
		value_of(picked1).should_be([1,2,3]);
	}

});

describe('$chk', {
	
	return_false_on_false: function(){
		value_of($chk(false)).should_be_false();
	},
	
	return_false_on_null: function(){
		value_of($chk(null)).should_be_false();
	},
	
	return_false_on_undefined: function(){
		value_of($chk(undefined)).should_be_false();
	},
	
	return_true_on_0: function(){
		value_of($chk(0)).should_be_true();
	}

});

describe('$defined', {
	
	return_true_on_false: function(){
		value_of($defined(false)).should_be_true();
	},
	
	return_false_on_null: function(){
		value_of($defined(null)).should_be_false();
	},
	
	return_false_on_undefined: function(){
		value_of($defined(undefined)).should_be_false();
	},
	
	return_true_on_0: function(){
		value_of($defined(0)).should_be_true();
	}

});

describe('$type', {
	
	for_arrays: function(){
		value_of($type([1,2])).should_be('array');
		value_of($type.array([1,2])).should_be_true();
		value_of($type.array({})).should_be_false();
	},
	
	for_strings: function(){
		value_of($type('ciao')).should_be('string');
	},
	
	for_regexps: function(){
		value_of($type(/_/)).should_be('regexp');
	},
	
	for_functions: function(){
		value_of($type(function(){})).should_be('function');
	},
	
	for_numbers: function(){
		value_of($type(10)).should_be('number');
		value_of($type(NaN)).should_not_be('number');
	},
	
	for_booleans: function(){
		value_of($type(true)).should_be('boolean');
		value_of($type(false)).should_be('boolean');
	},
	
	for_objects: function(){
		value_of($type({a:2})).should_be('object');
	},
	
	for_arguments: function(){
		value_of($type(arguments)).should_be((window.opera) ? 'array' : 'arguments'); //opera's arguments behave like arrays--which is actually better.
	},
	
	for_nulls: function(){
		value_of($type(null)).should_be_false();
	},
	
	for_undefineds: function(){
		value_of($type(undefined)).should_be_false();
	},
	
	for_elements_collections: function(){
		value_of($type(document.getElementsByTagName('*'))).should_be('collection');
	},
	
	for_elements: function(){
		var div = document.createElement('div');
		value_of($type(div)).should_be('element');
	},
	
	for_window: function(){
		value_of($type(window)).should_be('window');
	},
	
	for_document: function(){
		value_of($type(document)).should_be('document');
	}

});

describe('Native', {
	
	before_all: function(){
		
		this.local.Instrument = new Native({

			name: 'instrument',

			initialize: function(name){
				this.name = name;
			}

		});

		this.local.Instrument.implement({

			method: function(){
				return this.property + ' ' + this.name;
			},

			property: 'stuff'

		});
		
		this.local.Car = new Native({
			
			name: 'car',
			
			browser: true,
			
			initialize: function(name){
				this.name = name;
			}
			
		});
		
		this.local.Car.implement({
			
			property: 'stuff',
			
			method: function(){
				return this.name + '_' + this.property;
			}
			
		});
		
	},
	
	allow_implementation_over_existing_methods_when_browser_option_is_not_set: function(){
		
		this.local.Instrument.implement({
			
			property: 'staff'
			
		});
		
		var myInstrument = new this.local.Instrument('xeelophone');
		
		value_of(myInstrument.method()).should_be('staff xeelophone');
	},
	
	not_allow_implementation_over_existing_methods_when_browser_option_is_set: function(){
		
		this.local.Car.implement({
			
			property: 'staff'
			
		});
		
		var myCar = new this.local.Car('smart');
		
		value_of(myCar.method()).should_be('smart_stuff');
	},
	
	allow_generic_calls: function(){
		
		value_of(this.local.Car.method({name: 'ciccio', property: 'bello'})).should_be('ciccio_bello');
		
	},
	
	type_should_be_native: function(){
		value_of($type(this.local.Car)).should_be('native');
	}

});