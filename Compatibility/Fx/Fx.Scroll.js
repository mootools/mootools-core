Fx.Scroll.implement({

	scrollTo: function(y, x){
		console.warn('1.1 > 1.2: Fx.Scroll\'s .scrollTo is deprecated; use .start.');
		return this.start(y, x);
	}

});