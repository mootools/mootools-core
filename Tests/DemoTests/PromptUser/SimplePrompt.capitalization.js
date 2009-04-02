{
	tests: [
		{
			title: "Simple Prompt :: capitalization enabled", //the title of the test
			description: "Prompts the user to enter their name and then capitalizes it for them.", //a one liner description of the test
			verify: "Was your name added to the test frame capitalized?", //the question the user should answer
																																		//"yes" to that signifies success
			before: function(){
				simplePrompt(get("usersName"), "Enter your name (lower case):", "fred flintstone", true);
			}
		}
	],
	otherScripts: ["getElement"] //getElement isn't in our dependency chain, but I use it in the test itself
}
