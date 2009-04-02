//this is just a template for reference.
{
	tests: [
		{
			title: "", //the title of the test
			description: "", //a one liner description of the test
			verify: "", //the question the user should answer "yes" to that signifies success
			before: function(){}, //any code to execute when the test begins
			post: function(){}, //any code to execute after the body is evaluated; if it returns false, the test fails
			body: "" //any code you want the user to be able to see/modify; optional
		}
	],
	otherScripts: [] //other script that should be loaded for your test to work ("Selectors", "Request", etc)
}