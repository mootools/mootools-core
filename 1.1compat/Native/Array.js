describe('Array',{
	
	'Array copy should work' : function(){
		var a = [1,2,3];
		var b = a.copy();
		value_of(b).should_be([1,2,3]);
	},
	
	'Array copy should handle splices' : function(){
		var a = [1,2,3,4,5];
		var b = a.copy(1,3);
		value_of(b).should_be([2,3,4]);
	},
	
	'Array remove should work like erase' : function(){
		var a = [1,2,3,4,5];
		a.remove(3);
		value_of(a).should_be([1,2,4,5]);
	},
	
	'Array merge should work like combine' : function(){
		var a = [1,2,3];
		var b = [4,5];
		a.combine(b);
		value_of(a).should_be([1,2,3,4,5]);
	}
});
