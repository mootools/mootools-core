
(function(){

var h = new Hash({
	'one' : 1,
	'two' : 2,
	'three' : 3
});

var a = new Abstract({
	'one' : 1,
	'two' : 2,
	'three' : 3	
});

describe('Hash',{

	'Hash keys should act like getKeys' : function(){
		value_of(h.keys()).should_be(h.getKeys());
	},
	
	'Hash values should act like getValues' : function(){
		value_of(h.values()).should_be(h.getValues());
	},
	
	'Hash hasKey should act like has' : function(){
		value_of(h.hasKey('two')).should_be_true();
	},
	
	'Hash merge should act like combine' : function(){
		h.merge({'four' : 4});
		value_of(h.has('four')).should_be_true();
	},
	
	'Hash remove should act like empty' : function(){
		h.remove('three');
		value_of(h.has('three')).should_be_false();
	}
	
});

describe('Abstract',{

	'Abstract keys should act like Hash.getKeys' : function(){
		value_of(h.keys()).should_be(h.getKeys());
	},
	
	'Abstract values should act like Hash.getValues' : function(){
		value_of(h.values()).should_be(h.getValues());
	},
	
	'Abstract hasKey should act like Hash.has' : function(){
		value_of(h.hasKey('two')).should_be_true();
	},
	
	'Abstract merge should act like Hash.combine' : function(){
		h.merge({'four' : 4});
		value_of(h.has('four')).should_be_true();
	},
	
	'Abstract remove should act like Hash.empty' : function(){
		h.remove('three');
		value_of(h.has('three')).should_be_false();
	}
	
});


})();
