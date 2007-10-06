/*
Script: Array.js
	Specs for Array.js

License:
	MIT-style license.
*/

describe('Array', {

	before_all: function(){
		this.local.array = [1,2,3,0,0,0];

		this.local.comparator = function(item){
			return Number.type(item);
		};

		this.local.adder = function(a, b){
			return a + b;
		}
	},

	should_return_a_filtered_array: function(){
		var arr = this.local.array.concat([false, null, 4]).filter(this.local.comparator);
		value_of(arr).should_be(this.local.array.concat(4));
	},

	should_return_a_mapping_of_an_array: function(){
		var arr = this.local.array.map(function(item){
			return (item + 1);
		});

		value_of(arr).should_be([2,3,4,1,1,1]);
	},

	every_should_return_true_if_all_items_match: function(){
		var every = this.local.array.every(this.local.comparator);
		value_of(every).should_be_true();
	},

	every_should_return_false_if_at_least_one_item_does_not_match: function(){
		var every = ['1',2,3,0].every(this.local.comparator);
		value_of(every).should_be_false();
	},

	some_should_return_false_if_all_items_do_not_match: function(){
		var some = this.local.array.map(String).some(this.local.comparator);
		value_of(some).should_be_false();
	},

	some_should_return_true_if_at_least_one_item_matches: function(){
		var some = ['1',2,3,0].some(this.local.comparator);
		value_of(some).should_be_true();
	},

	indexOf_should_return_the_index_of_an_item: function(){
		value_of(this.local.array.indexOf(0)).should_be(3);
	},

	'indexOf should return -1 if the item index of the item is not found': function(){
		value_of(this.local.array.indexOf('not found')).should_be(-1);
	},

	should_reduce_an_array_to_single_value: function(){
		value_of(this.local.array.reduce(this.local.adder)).should_be(6);
	},

	should_reduce_an_array_to_a_single_value_with_an_initial_value: function(){
		var reduction = ['answer', 'is', 42].reduce(function(a, b) {
			return a.concat(' ', b);
		}, 'The');
		value_of(reduction).should_be('The answer is 42');
	},

	reduce_should_return_undefined_for_an_empty_array: function(){
		value_of([].reduce(this.local.adder)).should_be_undefined();
	},

	should_remove_all_items_that_match: function(){
		var array = $A(this.local.array).remove(0);
		value_of(array).should_be([1,2,3]);
	},

	should_return_true_if_the_array_contains_an_item: function(){
		value_of(this.local.array.contains(0)).should_be_true();
	},

	should_return_false_if_the_array_does_not_contain_an_item: function(){
		value_of(this.local.array.contains('not found')).should_be_false();
	},

	should_associate_an_array_with_an_array: function(){
		var assoc = this.local.array.associate(['a', 'b', 'c', 'd']);
		value_of(assoc).should_be({a:1, b:2, c:3, d:0});
	},

	link_should_assign_values_according_to_matchers: function(){
		var el = document.createElement('div');
		var assoc2 = [100, 'Hello', {foo: 'bar'}, el, false].link({
			myNumber: Number.type,
			myElement: Element.type,
			myObject: Object.type,
			myString: String.type,
			myBoolean: $defined
		});

		value_of(assoc2).should_be({
			myNumber: 100,
			myElement: el,
			myObject: {foo: 'bar'},
			myString: 'Hello',
			myBoolean: false
		});
	},

	should_extend_an_array: function(){
		var arr = [1,2,3,4].extend([1,2,3,4,5,6,7]);
		value_of(arr).should_be([1,2,3,4,1,2,3,4,5,6,7]);
	},

	should_merge_an_array: function(){
		var arr = [1,2,3,4].merge([1,2,3,4,5,6,7]);
		value_of(arr).should_be([1,2,3,4,5,6,7]);
	},

	should_include_only_new_items: function(){
		var arr = [1,2,3,4];
		arr.include(1);
		arr.include(5);

		value_of(arr).should_be([1,2,3,4,5]);
	},

	getLast_should_return_the_last_item: function(){
		value_of(this.local.array.getLast()).should_be(0);
	},

	empty_should_return_an_empty_array: function(){
		value_of([1,2,3,4].empty()).should_be([]);
	}

});