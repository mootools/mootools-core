/*
Script: JSSpecSpecs.js
	Failure Examples for JSSpec.js

License:
	MIT-style license.
*/

describe('Failure (these should fail)', {
	
	return_string_diff_failure: function(){
		var value = 'Hello, how are you?';
		value_of(value).should_be('HELLO HOW are you?');
	},
	
	return_object_diff_failure: function(){
		var value = {Hello: 'josh', How: 'are you'};
		value_of(value).should_be({Hello: 'Josh', How: 'are you', Iam: 'fine'});
	},
	
	return_array_diff_failure: function(){
		var value = ['string', null, undefined, [], {}, true, false];
		value_of(value).should_be([null, undefined, 'string', false, true, {}, []]);
	},
	
	return_match_diff_failure: function(){
		var value = 'Hello how are you';
		value_of(value).should_match('hel');
	}

});

describe('Success (these should pass)', {
	
	return_string_diff_success: function(){
		var value = 'Hello, how are you?';
		value_of(value).should_be('Hello, how are you?');
	},
	
	return_object_diff_success: function(){
		var value = {Hello: 'josh', How: 'are you'};
		value_of(value).should_be({Hello: 'josh', How: 'are you'});
	},
	
	return_array_diff_success: function(){
		var value = ['string', null, undefined, [], {}, true, false];
		value_of(value).should_be(['string', null, undefined, [], {}, true, false]);
	},
	
	return_match_diff_success: function(){
		var value = 'Hello how are you';
		value_of(value).should_match('Hel');
	}

});