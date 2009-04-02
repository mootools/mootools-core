//adds the debugger for non FF browsers (or FF w/o firebug)
//sets up the dbug alias; see dbug.js in Clientside lib
window.addEvent('domready', function(){
	try {
		if (!window.debug || !window.debug.path){
			var debug = {
				path: 'assets/moobugger/'
			}; 
			var script = document.createElement('script'); 
			script.id = 'debug-bookmarklet'; 
			script.src = debug.path + 'debugger.js';
			script.onload = function(){
				if (typeof dbug == "undefined") return;
				(function(){
					dbug.firebug = true;
					dbug.enable();
				}).delay(400);
			};
			document.getElementsByTagName('head')[0].appendChild(script);
		}
	} catch(e){
	}
});
