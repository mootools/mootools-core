/*
---
name: Class.Thenable
requires: ~
provides: ~
...
*/

describe('Class.Thenable', function(){

	var aplusAdapter = {

		resolved: Class.Thenable.resolve,

		rejected: Class.Thenable.reject,

		deferred: function(){
			var thenable = new Class.Thenable();

			return {
				promise: thenable,
				resolve: thenable.resolve.bind(thenable),
				reject: thenable.reject.bind(thenable)
			};
		}

	};

	it('should have specs', function(){
		throw new Error('No specs for Class.Thenable.');
	});

});
