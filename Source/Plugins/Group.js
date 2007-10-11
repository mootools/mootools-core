/*
Script: Group.js
	A "Utility" Class.

License:
	MIT-style license.
*/

/*
Class: Group
	For Grouping Classes or Elements Events. The Event added to the Group will fire when all of the events of the items of the group are fired.

Syntax:
	var myGroup = new Group(class[, arrays[, class2[, ... ]]]);

Arguments:
	Any number of Class instances, or arrays containing class instances.

Returns:
	(object) A new Group instance.

Example:
	[javascript]
		var xhr1 = new Ajax('data.js', {evalScript: true});
		var xhr2 = new Ajax('abstraction.js', {evalScript: true});
		var xhr3 = new Ajax('template.js', {evalScript: true});

		var group = new Group(xhr1, xhr2, xhr3);
		group.addEvent('onComplete', function(){
			alert('All Scripts loaded');
		});

		xhr1.request();
		xhr2.request();
		xhr3.request();
	[/javascript]
*/

var Group = new Class({

	initialize: function(){
		this.instances = Array.flatten(arguments);
		this.events = {};
		this.checker = {};
	},

	/*
	Method: addEvent
		Adds an event to the stack of events of the Class instances.

	Syntax:
		>myGroup.addEvent(type, fn);

	Arguments:
		type - (string) The event name (e.g. 'onComplete') to add.
		fn   - (function) The callback function to execute when all instances fired this event.

	Returns:
		(object) This Group instance.

	Example:
		[javascript]
			var myElements = $('myForm').getElements('input, textarea, select');
			myElements.addEvent('click', function(){
				alert('an individual click');
			});

			var myGroup = new Group(myElements);
			myGroup.addEvent('click', function(){
				alert('all form elements clicked');
			});
		[/javascript]

	See Also:
		<Element.addEvent>
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