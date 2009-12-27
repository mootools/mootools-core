describe('Group', {

	'Should group together a collection of classes, waiting for them all to fire an event': function(){
		var Test = new Class({});
		Test.implement(new Events);
		var instances = [];
		(3).times(function(i){
			instances.push(new Test());
		});
		var testgroup = new Group(instances[0], instances[1], instances[2]);
		var success;
		testgroup.addEvent('success', function(){
			success = true;
		});
		instances.each(function(instance) {
			instance.fireEvent('success');
		});
		value_of(success).should_be(true);
	}

});
