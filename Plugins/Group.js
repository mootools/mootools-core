/*
Script: Group.js
	For Grouping Classes or Elements Events. The Event added to the Group will fire when all of the events of the items of the group are fired.

License:
	MIT-style license.
*/

/*
Class: Group
	An "Utility" Class.

Arguments:
	List of Class instances

Example:
	(start code)
	xhr1 = new Ajax('data.js', {evalScript: true});
	xhr2 = new Ajax('abstraction.js', {evalScript: true});
	xhr3 = new Ajax('template.js', {evalScript: true});

	var group = new Group(xhr1, xhr2, xhr3);
	group.addEvent('onComplete', function(){
		alert('All Scripts loaded');
	});

	xhr1.request();
	xhr2.request();
	xhr3.request();
	(end)

*/

var Group = new Class({

	initialize: function(){
		this.instances = $A(arguments);
		this.events = {};
		this.checker = {};
	},

	/*
	Property: addEvent
		adds an event to the stack of events of the Class instances.

	Arguments:
		type - string; the event name (e.g. 'onComplete')
		fn - function to execute when all instances fired this event
	*/

	addEvent: function(type, fn){
		this.checker[type] = this.checker[type] || {};
		this.events[type] = this.events[type] || [];
		if (this.events[type].contains(fn)) return false;
		else this.events[type].push(fn);
		this.instances.each(function(instance, i){
			instance.addEvent(type, this.check.bind(this, [type, instance, i]));
		}, this);
		return this;
	},

	check: function(type, instance, i){
		this.checker[type][i] = true;
		var every = this.instances.every(function(current, j){
			return this.checker[type][j] || false;
		}, this);
		if (!every) return;
		this.checker[type] = {};
		this.events[type].each(function(event){
			event.call(this, this.instances, instance);
		}, this);
	}

});