"use strict";

// custom behaviours to test
var assets = {

	flush: function(req, res, src){
		
		var headString = '' +
			'<html>' +
				'<head>' +
					'<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />' +
					'<title>Flushed page scenario</title>' +
					'<script src="' + src + '.js" type="text/javascript"></script>' +
					'<script>' +
						'window.moments = [];' +
						'moments.push(document.readyState);' +
						'function callback(){' +
							'window.callbackFired = true;' +
							'moments.push(document.readyState);' +
						'}' +
						'window.callbackFired = false;' +
						'window.addEvent("domready", callback);' +
					'</script>' +
				'</head>';
		var bodyString = '' +
				'<body>' +
					'<div>body added...</div>' +
					'<script>' +
						'moments.push(document.readyState);' +
					'</script>' +
				'</body>';
		var endString = '</html>';

		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(headString);
		setTimeout(function() { 	
			res.write(bodyString);                                                          
			setTimeout(function() { 
				res.end(endString);
			}, 2000);                                                                      
		}, 2000);
	}
}

module.exports = assets;
