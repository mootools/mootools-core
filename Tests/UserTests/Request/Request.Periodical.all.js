{
	tests: [
		{
			title: "Request.Periodical",
			description: "Times out requests and increases the delay between retries.",
			verify: "Do you see the log? Did the request eventually succeed (after a few seconds)?",
			before: function(){
				var i = 0;
				var r = new Request({
					url: 'UserTests/Request/simple.php',
					method: 'get',
					initialDelay: 100,
					delay: 100,
					limit: 15000,
					onRequest: function(){
						$('log').adopt(new Element('li', {
							html: 'attempt: ' + (i++)
						}))
					},
					onSuccess: function(r){
						$('log').adopt(new Element('li', {
							html: 'success: ' + r
						}))
					}
				}).startTimer({
					sleep: 2
				});
				r.stopTimer.delay(3000, r);
			}
		}
	],
	otherScripts: ['Element']
}