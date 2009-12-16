/*
Script: Core.js
	Public Specs for Core.js 1.1.2

License:
	MIT-style license.
*/

describe('$chk', {

	'should return false on false': function(){
		value_of($chk(false)).should_be_false();
	},

	'should return false on null': function(){
		value_of($chk(null)).should_be_false();
	},

	'should return false on undefined': function(){
		value_of($chk(undefined)).should_be_false();
	},

	'should return true on 0': function(){
		value_of($chk(0)).should_be_true();
	},

	'should return true for any truthsie': function(){
		value_of($chk(1)).should_be_true();
		value_of($chk({})).should_be_true();
		value_of($chk(true)).should_be_true();
	}

});

describe('$clear', {

	'should clear timeouts': function(){
		var timeout = setTimeout(function(){}, 100);
		value_of($clear(timeout)).should_be_null();
	},

	'should clear intervals': function(){
		var interval = setInterval(function(){}, 100);
		value_of($clear(interval)).should_be_null();
	}

});

describe('$defined', {

	'should return true on 0': function(){
		value_of($defined(0)).should_be_true();
	},

	'should return true on false': function(){
		value_of($defined(false)).should_be_true();
	},

	'should return false on null': function(){
		value_of($defined(null)).should_be_false();
	},

	'should return false on undefined': function(){
		value_of($defined(undefined)).should_be_false();
	}

});

describe('$extend', {

	'should extend two objects': function(){
		var obj1 = {a: 1, b: 2};
		var obj2 = {b: 3, c: 4};
		$extend(obj1, obj2);
		value_of(obj1).should_be({a: 1, b: 3, c: 4});
	},

	'should overwrite properties': function(){
		var obj1 = {a: 1, b: 2};
		var obj2 = {b: 3, c: 4, a: 5};
		$extend(obj1, obj2);
		value_of(obj1).should_be({a: 5, b: 3, c: 4});
	},

	'should not extend with null argument': function(){
		var obj1 = {a: 1, b: 2};
		$extend(obj1);
		value_of(obj1).should_be({a: 1, b: 2});
	}

});

describe('$merge', {

	'should dereference objects': function(){
		var obj1 = {a: 1, b: 2};
		var obj2 = $merge(obj1);
		value_of(obj1 === obj2).should_be_false();
	},

	'should merge any arbitrary number of nested objects': function(){
		var obj1 = {a: {a: 1, b: 2, c: 3}, b: 2};
		var obj2 = {a: {a: 2, b: 8, c: 3, d: 8}, b: 3, c: 4};
		var obj3 = {a: {a: 3}, b: 3, c: false};
		value_of($merge(obj1, obj2, obj3)).should_be({a: {a: 3, b: 8, c: 3, d: 8}, b: 3, c: false});
	}

});

describe('$pick', {

	'should return the defined argument': function(){
		value_of($pick(null, false)).should_be_false();
		value_of($pick(false, true)).should_be_false();
	},

	'should return the first defined argument': function(){
		value_of($pick(null, [1,2,3])).should_be([1,2,3]);
		value_of($pick([1,2,3], true)).should_be([1,2,3]);
	}

});

describe('$random', {

	'should return a number between two numbers specified': function(){
		var rand = $random(1, 3);
		value_of((rand <= 3 && rand >= 1)).should_be_true();
	}

});

describe('$native', {

	'should add an extend method to an object': function(){
		var obj1 = {};
		$native(obj1);
		value_of(obj1.extend).should_not_be_undefined();
	},
	
	'should not overwrite a property existent on a native\'s prototype': function(){
		var obj1 = {
			foo: 'bar'
		};
		var proto = function(obj) {
			var f = function(){
				return this;
			};
			f.prototype = obj;
			return f;
		};
		var obj2 = new proto(obj1);
		$native(obj2);
		obj2.extend({
			foo: 'baz'
		});
		var obj3 = new obj2();
		value_of(obj3['foo']).should_not_be('baz');
		value_of(obj3['foo']).should_be('bar');
	},

	'should add a generic method for those extended': function(){
		String.extend({
			foo: function(){ return this + 'bar'; }
		});
		value_of(String.foo('biz')).should_be('bizbar');
	}

});

describe('Abstract', {
	
	'should add an extend method to any object': function(){
		value_of(Abstract({}).extend).should_be($extend);
	},
	
	'Window should have a .extend method': function(){
		value_of(Window.extend).should_be($extend);
	},

	'Document should have a .extend method': function(){
		value_of(Document.extend).should_be($extend);
	}

});

describe('document.head', {
	'document.head should be defined': function(){
		value_of(document.head).should_not_be_undefined();
	}
});

describe('$time', {

	'should return a timestamp': function(){
		value_of($type($time())).should_be('number');
	},
	
	'should be within a reasonable range': function(){
		value_of($time() < 1e13 && $time() > 1e12).should_be_true();
	}

});

describe('$try', {

	'should return the result of the first successful function without executing successive functions': function(){
		var calls = 0;
		var attempt = $try(function(){
			calls++;
			throw new Exception();
		}, function(){
			calls++;
			return 'success';
		}, function(){
			calls++;
			return 'moo';
		});
		value_of(calls).should_be(2);
		value_of(attempt).should_be('success');
	},

	'should return null when no function succeeded': function(){
		var calls = 0;
		var attempt = $try(function(){
			calls++;
			return I_invented_this();
		}, function(){
			calls++;
			return uninstall_ie();
		});
		value_of(calls).should_be(2);
		value_of(attempt).should_be_null();
	}

});

describe('$type', {

	"should return 'array' for Array objects": function(){
		value_of($type([1,2])).should_be('array');
	},

	"should return 'string' for String objects": function(){
		value_of($type('ciao')).should_be('string');
	},

	"should return 'regexp' for RegExp objects": function(){
		value_of($type(/_/)).should_be('regexp');
	},

	"should return 'function' for Function objects": function(){
		value_of($type(function(){})).should_be('function');
	},

	"should return 'number' for Number objects": function(){
		value_of($type(10)).should_be('number');
		//1.2 breaking
		value_of($type(NaN)).should_be('number');
	},

	"should return 'boolean' for Boolean objects": function(){
		value_of($type(true)).should_be('boolean');
		value_of($type(false)).should_be('boolean');
	},

	"should return 'object' for Object objects": function(){
		value_of($type({a:2})).should_be('object');
	},

	"should return 'arguments' for Function arguments": function(){
		value_of($type(arguments)).should_be((window.opera) ? 'array' : 'arguments'); //opera's arguments behave like arrays--which is actually better.
	},

	"should return false for null objects": function(){
		value_of($type(null)).should_be_false();
	},

	"should return false for undefined objects": function(){
		value_of($type(undefined)).should_be_false();
	},

	"should return 'collection' for HTMLElements collections": function(){
		value_of($type(document.getElementsByTagName('*'))).should_be('collection');
	},

	"should return 'element' for an Element": function(){
		var div = document.createElement('div');
		value_of($type(div)).should_be('element');
	},
	
	"should return 'object' for the window object": function(){
		//1.2 breaking
		value_of($type(window)).should_be('object');
	},

	"should return 'object' for the document object": function(){
		//1.2 breaking
		value_of($type(document)).should_be('object');
	}

});