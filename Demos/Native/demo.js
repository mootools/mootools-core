// We add the "invoke"-Method to Arrays
Array.implement({
	
	invoke: function(fn, args){
		var result = [];
		
		for (var i = 0, l = this.length; i < l; i++){
			if(this[i] && this[i][fn])
				result.push(args ? this[i][fn].pass(args, this[i])() : this[i][fn]());
		}
		return result;
	}
	
});


window.addEvent('domready', function(){
	
	var els = $$('div.element');
	
	var myArray = [
		new Fx.Tween(els[0]),
		new Fx.Tween(els[1]),
		new Fx.Tween(els[2]),
		new Fx.Tween(els[3]),
	];
	
	var i = false;
	
	$('link').addEvent('click', function(e){
		e.stop();
		
		i = !i;
		myArray.invoke('start', ['height', i ? '120px' : '50px']);
	});
});