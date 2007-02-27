/*
Script: Group.js
	For Grouping Classes or Elements Events. The Event added to the Group will fire when all of the events of the items of the group are fired.

License:
	MIT-style license.
*/

/*
Class: Group
	An "Utility" Class.
*/

var Group = new Class({

	initialize: function(){
		this.instances = $A(arguments);
		this.events = {};
		this.checker = {};
	},

	addEvent: function(type, fn){
		this.checker[type] = this.checker[type] || {};
		this.events[type] = this.events[type] || [];
		if (this.events[type].test(fn)) return false;
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
		this.instances.each(function(current, j){
			this.checker[type][j] = false;
		}, this);
		this.events[type].each(function(event){
			event.call(this, this.instances, instance);
		}, this);
	}

});