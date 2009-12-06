describe('Function',{
	
	'bindWithEvent should work' : function(){
		var v,
			c = new Class({
			initialize : function(){
				this.addEvent('trigger', this.done.bindWithEvent(this,'passed'));
				this.fireEvent('trigger');
			},
			done : function(evt,val){
				v = val;
			}
		});
		c.implement(new Events);

		new c();
		value_of(v).should_be('passed');
	},
	
	'Function.empty should act like $empty' : function(){
		value_of(Function.empty).should_be($empty);		
	}
});
