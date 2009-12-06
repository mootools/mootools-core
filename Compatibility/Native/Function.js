Function.extend({

    bindAsEventListener: function(bind, args){
		console.warn('Function.bindAsEventListener is deprecated.');
        return this.create({'bind': bind, 'event': true, 'arguments': args});
    }

});

Function.empty = function(){ 
	console.warn('replace Function.empty with $empty');
	return $empty();
};

