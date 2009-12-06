/*
Script: JSSpecSpecs.js
	Failure Examples for JSSpec.js

License:
	MIT-style license.

Note:
	All examples should fail to demonstrate the usage and output of all the availible types of specs in JSSpec.
*/

describe('Should be', {
	'Array should be (Array) 1': function() {
		value_of(['ab','cd','ef']).should_be(['ab','bd','ef']);
	},
	'Array should be (Array) 2': function() {
		value_of(['a',2,'4',5]).should_be([1,2,[4,5,6],6,7]);
	},
	'Boolean should be (Boolean)': function() {
		value_of(true).should_be(false);
	},
	'Boolean should be false': function() {
		value_of(true).should_be_false();
	},
	'Boolean should be true': function() {
		value_of(false).should_be_true();
	},
	'Date should be (Date)': function() {
		value_of(new Date(1979, 3, 27)).should_be(new Date(1976, 7, 23));
	},
	'Null should be (String)': function() {
		value_of(null).should_be("Test");
	},
	'Null should be (undefined)': function() {
		value_of(null).should_be(undefined);
	},
	'Number should be (Number)': function() {
		value_of(1+2).should_be(4);
	},
	'Object should be (Object) 1': function() {
		var actual = {a:1, b:2};
		var expected = {a:1, b:2, d:3};
		value_of(actual).should_be(expected);
	},
	'Object should be (Object) 2': function() {
		var actual = {a:1, b:2, c:3, d:4};
		var expected = {a:1, b:2, c:3};
		value_of(actual).should_be(expected);
	},
	'Object should be (Object) 3': function() {
		var actual = {a:1, b:4, c:3};
		var expected = {a:1, b:2, c:3};
		value_of(actual).should_be(expected);
	},
	'String should be (String)': function() {
		value_of("Hello world").should_be("Good-bye world");
	},
	'String should be (undefined)': function() {
		value_of("Test").should_be(undefined);
	}
});

describe('Should be empty', {
	'String should be empty': function() {
		value_of("").should_be_empty();
		value_of("Hello").should_be_empty();
	},
	'String should notbe empty': function() {
		value_of("Hello").should_not_be_empty();
		value_of("").should_not_be_empty();
	},
	'Array should be empty': function() {
		value_of([]).should_be_empty();
		value_of([1,2,3]).should_be_empty();
	},
	'Array should not be empty': function() {
		value_of([1,2,3]).should_not_be_empty();
		value_of([]).should_not_be_empty();
	},
	'Object\'s item should be empty': function() {
		value_of({name:'Alan Kang', email:'jania902@gmail.com', accounts:['A', 'B']}).should_have(0, "accounts");
	},
	'Object\'s item should not be empty': function() {
		value_of({name:'Alan Kang', email:'jania902@gmail.com', accounts:[]}).should_have(2, "accounts");
	}
});

describe('Should have', {
	'Array should have (Number, "items")': function() {
		value_of([1,2,3]).should_have(4, "items");
	},
	'Array should have exactly (Number, "items")': function() {
		value_of([1,2,3]).should_have_exactly(2, "items");
	},
	'Array should have at least (Number, "items")': function() {
		value_of([1,2,3]).should_have_at_least(4, "items");
	},
	'Array should have at most (Number, "items")': function() {
		value_of([1,2,3]).should_have_at_most(2, "items");
	},
	'Object\'s item should have (Number, "[property]s")': function() {
		value_of({name:'Alan Kang', email:'jania902@gmail.com', accounts:['A', 'B']}).should_have(3, "accounts");
	},
	'String should have (Number, "characters")': function() {
		value_of("Hello").should_have(4, "characters");
	},
	'String should have (Number, "[No match]s")': function() {
		value_of("This is a string").should_have(5, "players");
	}
});

describe('Should include', {
	'Array should include (mixed)': function() {
		value_of([1,2,3]).should_include(4);
	},
	'Array should not include (mixed)': function() {
		value_of([1,2,3]).should_not_include(2);
	},
	'Non-Array should include (mixed)': function() {
		value_of(new Date()).should_include(4);
	},
	'Non-Array should not include (mixed)': function() {
		value_of(new Date()).should_not_include(4);
	}
});

describe('Should match', {
	'String should match (RegExp)': function() {
		value_of("Hello").should_match(/x/);
	},
	'String should not match (RegExp)': function() {
		value_of("Hello").should_not_match(/ell/);
	},
	'Array should match (RegExp)': function() {
		value_of([1,2,3]).should_match(/x/);
	},
	'Array should not match (RegExp)': function() {
		value_of([1,2,3]).should_not_match(/x/);
	}
});