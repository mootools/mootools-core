/*
---
name: DOM
description: The base DOM Class
provides: DOM
requires: [Class, Events, Store, Slick.parse]
...
*/


(function(){

var nodeOf = function(item){
	return (item != null && item.toNode) ? item.toNode() : item;
};

var html = document.documentElement;

var wrappers = {};

var DOM = this.DOM = new Class({
	
	implement: [Events, Store],
	
	initialize: function(node){
		node = this.node = nodeOf(node);
		var uid = DOM.uidOf(node);
		return (wrappers[uid] || (wrappers[uid] = this));
	},

	toNode: function(){
		return this.node;
	},

	addEventListener: ((html.addEventListener) ? function(type, fn){
		this.node.addEventListener(type, fn, false);
		return this;
	} : function(type, fn){
		this.node.attachEvent('on' + type, fn);
		return this;
	}),

	removeEventListener: ((html.removeEventListener) ? function(type, fn){
		this.node.removeEventListener(type, fn, false);
		return this;
	} : function(type, fn){
		this.node.detachEvent('on' + type, fn);
		return this;
	})

});

DOM.prototype.log = DOM.prototype.toNode;

})();
