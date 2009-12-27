{
	tests: [
		{
			title: "Json.Remote",
			description: "Sends an AJAX request to the server to retrieve a JSON response.",
			verify: "Did the ajax log to the screen a success?",
			before: function(){
				new Json.Remote('Tests/Remote/example.json', {
					onRequest: function(){
						new Element('hr').inject($('log'));
						new Element('li').setHTML('attempting request...').inject($('log'));
					},
					onComplete: function(data){
						new Element('li').setHTML(data.message).inject($('log'));
					}
				}).send();
			}
		}
	],
	otherScripts: ['Element']
}