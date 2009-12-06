describe('Browser',{
	'window.ie should not be undefined' : function(){
		value_of(window.ie).should_not_be_undefined();
	},
	'window.ie6 should not be undefined' : function(){
		value_of(window.ie6).should_not_be_undefined();
	},
	'window.ie7 should not be undefined' : function(){
		value_of(window.ie7).should_not_be_undefined();
	},
	'window.gecko should not be undefined' : function(){
		value_of(window.gecko).should_not_be_undefined();
	},
	'window.webkit should not be undefined' : function(){
		value_of(window.webkit).should_not_be_undefined();
	},
	'window.webkit419 should not be undefined' : function(){
		value_of(window.webkit419).should_not_be_undefined();
	},
	'window.webkit420 should not be undefined' : function(){
		value_of(window.webkit420).should_not_be_undefined();
	}
});
