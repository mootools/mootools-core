Function.extend({

    bindAsEventListener: function(bind, args){
		console.warn('1.1 > 1.2: Function.bindAsEventListener is deprecated.');
        return this.create({'bind': bind, 'event': true, 'arguments': args});
    }

});

Function.empty = function(){
	console.warn('1.1 > 1.2: Function.empty is now just $empty.');
};