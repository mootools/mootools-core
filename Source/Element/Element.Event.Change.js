/*
---

name: Element.Event.Change

description: Contains Element methods for normalizing change events across browsers.

license: MIT-style license.

requires: [Element, Event]

provides: Element.Event.Change

...
*/

(function(){

var hasListener = window.addEventListener;
var getValue = function(element){
	var type = element.get('type');
	return element[(type == 'radio' || type == 'checkbox') ? 'checked' : 'value'];
}
var storeChange = function(event){
	event.target.store('$change', {
		type: event.type,
		value: getValue(event.target)
	});
};
var hasChanged = function(element){
	var value =  element.retrieve('$change').value;
	return (value != null && value != getValue(element));
};

Element.Events.keychange = {
	base: 'keyup',
	condition: function(event){
		var target = event.target;
		if (!hasChanged(target)) return false;
		if (target.get('tag') == 'select') return true;
		if (!hasListener) switch(event.key){
			case 'up': case 'down': case 'left': case 'right': return target.get('type') == 'radio';
			case 'space': return target.get('type') == 'checkbox';
		}
	}
};

Element.Events.change = {
	base: function(){
		var type = this.get('type');
		return (!hasListener && (type == 'checkbox' || type == 'radio')) ? 'click' : 'change';
	},
	condition: function(event){
		var target = event.target;
		if (hasListener && event.type == 'change' && target.get('tag') == 'select' && target.retrieve('$change').type == 'keydown') return false;
		return (target.get('type') == 'radio') ? ((event.type == 'keyup') ? !target.checked : target.checked) : true;
	},
	onAdd: function(fn){
		this.addEvents({
			keychange: fn,
			focus: storeChange,
			keydown: storeChange
		});
	},
	onRemove: function(fn){
		this.removeEvents({
			keychange: fn,
			focus: storeChange,
			keydown: storeChange
		});
	}
}

})();
