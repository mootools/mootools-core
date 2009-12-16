describe('Element',{
	
	'getTag should would like get("tag")' : function(){
		value_of($(document.body).getTag()).should_be('body');
	},
	
	'getSize should return size.x and size.y' : function(){
		var size = $(document.body).getSize();
		value_of(size).should_include('x');
		value_of(size).should_include('y');
		value_of(size).should_include('size');
		if(size.size){
			value_of(size.x == size.size.x).should_be_true();
			value_of(size.y == size.size.y).should_be_true();
		}
	} 
});

