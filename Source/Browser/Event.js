/*
Script: Event.js
	Contains the Browser native event enhancement, to make the event object completely crossbrowser.

License:
	MIT-style license.
*/

function Event(event){
	if ((event = event || window.event).event) event = event.event;
	this.event = event;
	return this;
};

new Native(Event);

(function(){
	
	var properties = {
		
		shift: function(event){
			return event.shiftKey;
		},
		
		control: function(event){
			return event.ctrlKey;
		},
		
		alt: function(event){
			return event.altKey;
		},
		
		meta: function(event){
			return event.metaKey;
		},
		
		rightClick: function(event){
			return (event.which == 3) || (event.button == 2);
		},
		
		wheel: function(event){
			return (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
		}

	};
	
	Event.defineGetter = function(key, fn){
		properties[key] = fn;
	}.asSetter();
	
	var keys = {
		'enter': 13,
		'up': 38,
		'down': 40,
		'left': 37,
		'right': 39,
		'esc': 27,
		'space': 32,
		'backspace': 8,
		'tab': 9,
		'delete': 46
	};
	
	Event.defineKeyCode = function(name, code){
		keys[name] = code;
	};
	
	Event.defineGetter('key', function(event){
		var code = event.which || event.keyCode;

		for (var name in keys){
			if (keys[name] == code) return name;
		}
		if (event.type == 'keydown'){
			var fKey = code - 111;
			if (fKey > 0 && fKey < 13) return 'f' + fKey;
		}
		return String.fromCharCode(code).toLowerCase();
	});
	
	Event.implement('get', function(key){
		var event = this.event;
		var property = properties[key.camelCase()];
		return (property) ? property.call(this, event) : event[key];
	}.asGetter());
	
	//shhh
	Event.Keys = keys;
	
})();

Event.defineGetter('target', function(event){
	var target = event.target || event.srcElement;
	while (target && target.nodeType == 3) target = target.parentNode;
	return $(target);
});

Event.defineGetter('relatedTarget', function(event){
	switch (event.type){
		case 'mouseover': related = event.relatedTarget || event.fromElement; break;
		case 'mouseout': related = event.relatedTarget || event.toElement;
	}
	var test = function(){
		while (related && related.nodeType == 3) related = related.parentNode;
		return true;
	};
	var hasRelated = (Browser.Engine.gecko) ? Function.stab(test) : test();
	return (hasRelated) ? $(related) : null;
});

Event.defineGetter('client', function(event){
	return {
		x: (event.pageX) ? event.pageX - window.pageXOffset : event.clientX,
		y: (event.pageY) ? event.pageY - window.pageYOffset : event.clientY
	};
});

Event.defineGetter('page', function(event){
	var doc = document;
	doc = (!doc.compatMode || doc.compatMode == 'CSS1Compat') ? doc.html : doc.body;
	return {
		x: event.pageX || event.clientX + doc.scrollLeft,
		y: event.pageY || event.clientY + doc.scrollTop
	};
});

Event.implement({

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
	},
	
	stop: function(){
		return this.stopPropagation().preventDefault();
	}

});
