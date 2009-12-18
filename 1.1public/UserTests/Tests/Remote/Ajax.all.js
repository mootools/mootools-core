{
	tests: [
		{
			title: "Ajax",
			description: "Sends an AJAX request to the server.",
			verify: "Did the ajax log to the screen a success?",
			before: function(){
				new Ajax('Tests/Remote/simple.php', {
					method: 'get',
					onRequest: function(){
						new Element('hr').inject($('log'));
						new Element('li').setHTML('attempting request...').inject($('log'));
					},
					onSuccess: function(r){
						new Element('li').setHTML('SUCCESS: ' + r).inject($('log'));
					}
				}).request();
			}
		},
		{
			title: "Ajax: failure handling",
			description: "Sends an AJAX request to the server. Requests a 404 url.",
			verify: "Did the ajax log to the screen a success?",
			before: function(){
				new Ajax('Tests/Remote/simplxe.php', {
					method: 'get',
					onRequest: function(){
						new Element('hr').inject($('log'));
						new Element('li').setHTML('attempting request...').inject($('log'));
					},
					onSuccess: function(r){
						new Element('li').setHTML('FAILURE: the ajax responded with: ' + r).inject($('log'));
					},
					onFailure: function(r){
						new Element('li').setHTML('SUCCESS: the ajax url 404ed, and this callback was executed.').inject($('log'));
					}
				}).request();
			}
		},
		{
			title: "Ajax: cancel",
			description: "Sends an AJAX request to the server and cancels it.",
			verify: "Did the ajax log to the screen a success?",
			before: function(){
				new Ajax('Tests/Remote/simple.php', {
					method: 'get',
					onRequest: function(){
						new Element('hr').inject($('log'));
						new Element('li').setHTML('attempting request...').inject($('log'));
					},
					onSuccess: function(r){
						new Element('li').setHTML('FAILURE: the ajax responded with: ' + r).inject($('log'));
					},
					onCancel: function(){
						new Element('li').setHTML('SUCCESS: the ajax was canceled').inject($('log'));
					}
				}).request().cancel();
			}
		},
		{
			title: "Ajax: chain",
			description: "Sends an AJAX request to the server and chains a function to fire after success.",
			verify: "Did the ajax log to the screen a success?",
			before: function(){
				new Ajax('Tests/Remote/simple.php', {
					method: 'get',
					onRequest: function(){
						new Element('hr').inject($('log'));
						new Element('li').setHTML('attempting request...').inject($('log'));
					},
					onSuccess: function(r){
						new Element('li').setHTML('ajax response: ' + r).inject($('log'));
					}
				}).request().chain(function(){
					new Element('li').setHTML('SUCCESS: this function was chained.').inject($('log'));
				});
			}
		},
		{
			title: "Ajax: eval scripts",
			description: "Fetches a script from the server and evaluates it.",
			verify: "Did the ajax log to the screen a success?",
			before: function(){
				new Element('hr').inject($('log'));
				new Ajax('Tests/Remote/ajax.evalscripts.js', {
					method: 'get',
					onRequest: function(){
						new Element('li').setHTML('attempting request for js file...').inject($('log'));
					},
					evalResponse: true
				}).request();
			}
		},
		{
			title: "Ajax: Element.send",
			description: "Sends a form.",
			verify: "Did the ajax log to the screen a success?",
			before: function(){
				new Element('hr').inject($('log'));
				var form = new Element('form', {
					action: 'Tests/Remote/simple.php'
				});
				var input = new Element('input', {type: 'text', name: 'num'}).set({value: '1'}).inject(form);
				form.send({
					onRequest: function(){
						new Element('li').setHTML('attempting to submit form with .send method ...').inject($('log'));
					},
					onSuccess: function(r) {
						var msg = 'FAILURE: input values not sent';
						if (r == 'requested: 1') msg = 'SUCCESS: input values successfully posted and response received';
						new Element('li').setHTML(msg).inject($('log'));
					}
				})
			}
		}
	],
	otherScripts: ['Element']
}