var UnitTester = {
	site: 'MooTools Core',
	title: 'Unit Tests',
	path: 'UnitTester/',
	ready: function(){
		var sources = {
			mootoolsCore: '..'
		};
		new UnitTester(sources, {
			'mootools-core': 'UserTests'
		}, {
			autoplay: true
		});
	}
};