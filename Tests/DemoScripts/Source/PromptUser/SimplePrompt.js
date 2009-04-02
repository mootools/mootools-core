var simplePrompt = function(el, promptQuestion, autoFill, cap){
	var userInput = trim(prompt(promptQuestion, autoFill||''));
	if (cap){ userInput = capitalize(userInput); }
	setHTML(el, userInput);
};