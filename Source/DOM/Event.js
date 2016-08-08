/*
---
name: Event
description: Contains the Event Class, to make the event object cross-browser.
requires: [Type, Browser, Array, Function, String, Accessor, $]
provides: Event
...
*/

(function(){

var Event = DOM.Event = new Type('Event', function(event){
	if (!event) event = window.event || {};
	if (event.event) event = event.event;
	this.event = event;
	this.properties = {};
});

Event.extend(new Accessor('KeyCode')).defineKeyCodes({
	13: 'enter', 38: 'up', 40: 'down', 37: 'left', 39: 'right', 27: 'esc', 32: 'space', 8: 'backspace', 9: 'tab', 46: 'delete'
});

Event.extend(new Accessor('Getter'));

Event.defineGetters({

	shift: function(){
		return this.event.shiftKey;
	},

	control: function(){
		return this.event.ctrlKey;
	},

	alt: function(){
		return this.event.altKey;
	},

	meta: function(){
		return this.event.metaKey;
	},

	rightButton: function(){
		var event = this.event;
		return (event.which == 3) || (event.button == 2);
	},

	wheel: function(){
		var event = this.event;
		return (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
	},
	
	key: function(){
		var event = this.event;

		var code = event.which || event.keyCode;

		var name = Event.lookupKeyCode(code);
		if (name) return name;

		if (event.type == 'keydown'){
			var fKey = code - 111;
			if (fKey > 0 && fKey < 13) return 'f' + fKey;
		}

		return String.fromCharCode(code).toLowerCase();
	},
	
	target: function(){
		var event = this.event;
		var target = event.target || event.srcElement;
		while (target && target.nodeType == 3) target = target.parentNode;
		return DOM.$(target);
	},
	
	relatedTarget: function(){
		var event = this.event, related = null;
		switch (event.type){
			case 'mouseover': related = event.relatedTarget || event.fromElement; break;
			case 'mouseout': related = event.relatedTarget || event.toElement;
		}
		var test = function(){
			while (related && related.nodeType == 3) related = related.parentNode;
			return true;
		};
		var hasRelated = (Browser.firefox2) ? Function.attempt(test) : test();
		return (hasRelated) ? DOM.$(related) : null;
	},
	
	client: function(){
		var event = this.event;
		return {
			x: (event.pageX) ? event.pageX - window.pageXOffset : event.clientX,
			y: (event.pageY) ? event.pageY - window.pageYOffset : event.clientY
		};
	},
	
	page: function(){
		var event = this.event, doc = document;
		doc = (!doc.compatMode || doc.compatMode == 'CSS1Compat') ? doc.documentElement : doc.body;
		return {
			x: event.pageX || event.clientX + doc.scrollLeft,
			y: event.pageY || event.clientY + doc.scrollTop
		};
	}

});

Event.implement({
	
	get: function(key){
		if (this.properties.hasOwnProperty(key = key.camelCase())) return this.properties[key];
		var getter = Event.lookupGetter(key);
		return this.properties[key] = (getter) ? getter.call(this) : this.event[key];
	}.overloadGetter(),

	stopPropagation: function(){
		var event = this.event;
		if (event.stopPropagation) event.stopPropagation();
		else event.cancelBubble = true;
		return this;
	},

	preventDefault: function(){
		var event = this.event;
		if (event.preventDefault) event.preventDefault();
		else event.returnValue = false;
		return this;
	}  

});

})();
