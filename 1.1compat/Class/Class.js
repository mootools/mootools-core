describe('Class',{
	
	'Class should provide empty function' : function(){
		value_of($type(Class.empty)).should_be('function');
	},
	
	'Class implement should handle multiple arguments' : function(){
		var test = new Class();
		test.implement(new Options, new Events);
		var t = new test();
		value_of(t).should_include('setOptions');
		value_of(t).should_include('addEvent');
	}
});
