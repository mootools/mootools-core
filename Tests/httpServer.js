"use strict";

var fs = require('fs');
var path = require('path');
var http = require('http');
var assets = require('./assets.js');

function getQuery(path){
	var match = path.match(/=(\w+)/);
	return match ? match[1] : null;
}

module.exports = function(build){
	http.createServer(function(req, res){

		var src = '/base/mootools-' + build;
		var customFunction = getQuery(req.url);

		if (customFunction) return assets[customFunction].call(null, req, res, src);
		var filePath = path.join(__dirname, req.url);
		fs.readFile(filePath, 'utf-8', function (err, content){
			if (err) return console.log(err);
			content = content.replace('mootoolsPath', src);
			res.end(content);
		});
	}).listen(9000);
}
