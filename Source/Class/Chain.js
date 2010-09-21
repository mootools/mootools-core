/*
---
name: Chain
description: Chain
requires: [Class, Array]
provides: Chain
...
*/

(function(){

this.Chain = new Class({
	
	chain: function(fn){
		if (!this.$chain) this.$chain = [];
		this.$chain.push(fn);
		return this;
	},
	
	callChain: function(){
		return (this.$chain && this.$chain.length) ? this.$chain.shift().apply(this, arguments) : null;
	},
	
	clearChain: function(){
		delete this.$chain;
		return this;
	}
	
});

})();
