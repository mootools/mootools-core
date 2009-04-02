UnitTester.site = 'MooTools Core';
UnitTester.title = 'Unit Tests';

window.addEvent('load', function(){
	var sources = {
		mootoolsCore: '../'
	};

	new UnitTester(sources, {
		'mootools-core': 'UserTests/'
	}, {
		autoplay: true
	});
});
