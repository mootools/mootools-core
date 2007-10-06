/*
Script: Function.js
	Specs for Function.js

License:
	MIT-style license.
*/

describe('Function', {

	before_all: function(){
		this.local.fn = function(){
			return $A(arguments);
		};

		this.local.thisRules = function(){
			return this + ' rules';
		};

		this.local.thisArgs = function(){
			return [this].concat($A(arguments));
		}
	},

	should_create_a_new_function: function(){
		var fn = $empty.create();
		value_of($empty === fn).should_be_false();
	},

	should_create_a_new_function_with_specified_argument: function(){
		var fn = this.local.fn.create({'arguments': 'rocks'});
		value_of(fn()).should_be(['rocks']);
	},

	should_create_a_new_function_with_specified_multiple_arguments: function(){
		var fn = this.local.fn.create({'arguments': ['MooTools', 'rocks']});
		value_of(fn()).should_be(['MooTools', 'rocks']);
	},

	should_create_a_new_function_bound_to_an_object: function(){
		var fn = this.local.thisRules.create({'bind': 'MooTools'});
		value_of(fn()).should_be('MooTools rules');
	},

	should_create_a_new_function_as_an_event: function(){
		var fn = this.local.fn.create({'arguments': [0, 1], 'event': true});
		value_of(fn('an Event occurred')).should_be(['an Event occurred', 0, 1]);
	},

	should_bind_a_function_to_an_object: function(){
		var fn = this.local.thisRules.bind('MooTools');
		value_of(fn()).should_be('MooTools rules');
	},

	should_bind_a_function_to_an_object_with_specified_argument: function(){
		var fn = this.local.thisArgs.bind('MooTools', 'rocks');
		value_of(fn()).should_be(['MooTools', 'rocks']);
	},

	should_bind_a_function_to_an_object_with_specified_multiple_arguments: function(){
		var fn = this.local.thisArgs.bind('MooTools', ['rocks', 'da house']);
		value_of(fn()).should_be(['MooTools', 'rocks', 'da house']);
	},

	should_bind_a_function_to_an_object_and_make_the_function_event_listener: function(){
		var thisArgs = function(){
			return [this].concat($A(arguments));
		};
		var fn = thisArgs.bindWithEvent('MooTools');
		value_of(fn('an Event ocurred')).should_be(['MooTools', 'an Event ocurred']);
	},

	should_bind_a_function_to_an_object_and_make_the_function_event_listener_with_specified_arguments: function(){
		var fn = this.local.thisArgs.bindWithEvent('MooTools', ['rocks', 'da house']);
		value_of(fn('an Event ocurred')).should_be(['MooTools', 'an Event ocurred', 'rocks', 'da house']);
	},

	should_pass_the_specified_arguments_when_the_function_is_called: function(){
		var fn = this.local.fn.pass('MooTools is beautiful and elegant');
		value_of(fn()).should_be(['MooTools is beautiful and elegant']);
	},

	should_pass_the_specified_arguments_and_bind_the_function_to_an_object: function(){
		var fn = this.local.thisArgs.pass(['rocks', 'da house'], 'MooTools');
		value_of(fn()).should_be(['MooTools', 'rocks', 'da house']);
	},

	should_run_the_function_with_the_specified_arguments: function(){
		var result = this.local.fn.run(['MooTools', 'beautiful', 'elegant']);
		value_of(result).should_be(['MooTools', 'beautiful', 'elegant']);
	},

	should_run_the_function_with_the_specified_arguments_and_bind_the_function_to_an_object: function(){
		var result = this.local.thisArgs.run(['beautiful', 'elegant'], 'MooTools');
		value_of(result).should_be(['MooTools', 'beautiful', 'elegant']);
	}

});