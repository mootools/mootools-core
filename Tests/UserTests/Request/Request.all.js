{
	tests: [
		{
			title: "Request",
			description: "Sends an AJAX request to the server.",
			verify: "Did the ajax log to the screen a success?",
			before: function(){
				new Request({
					url: 'UserTests/Request/simple.php',
					method: 'get',
					onRequest: function(){
						$('log').adopt(new Element('li', {
							html: 'attempting request...'
						}))
					},
					onSuccess: function(r){
						$('log').adopt(new Element('li', {
							html: 'success: ' + r
						}))
					}
				}).send();
			}
		}
	],
	otherScripts: ['Element']
}