var UnitTester = {
	site: 'MooTools 1.11', //title of your site
	title: 'Unit Tests', //title of this test group
	path: 'UnitTester/',
	ready: function(UnitTester){
		new UnitTester({
			core: '../../' //path to Source/scripts.json
		}, {
			DemoScripts: 'Tests_1.12/' //path to tests.json
		}, {
			appendSource: false
		});
	}
};