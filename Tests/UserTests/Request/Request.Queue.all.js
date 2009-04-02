{
	tests: [
		{
			title: "Request.Queue",
			description: "Stacks up request calls.",
			verify: "Look in the console, you should see the requests log out numbers 1-5 in <b>reverse</b> order.",
			before: function(){
				var events = {};
/*				['onRequest', 'onComplete', 'onCancel', 'onSuccess', 'onFailure', 'onException'].each(function(evt){
					events[evt] = function(){
						dbug.log(evt + ': ', arguments);
					}
				}); */
				['onSuccess', 'onFailure', 'onException'].each(function(evt){
					events[evt] = function(a){
						$('responses').adopt(new Element('li', {
								html: evt + ': ' + a
							})
						);
					}
				});
				var q = new Request.Queue();
				var reqs = [];
				var sleep = 4;
				(5).times(function(num){
					var r = new Request({
						url: 'UserTests/Request/simple.php',
						method: 'get',
						data: {
							num: num+1,
							sleep: sleep
						}
					});
					sleep = sleep - 1;
					reqs.push(r);
					r.addEvents(events);
					q.addRequest(num.toString(), r);
				});
				reqs.each(function(r){
					r.send();
				});
			}
		}
	],
	otherScripts: ['Element']
}