
JSON.toString = function(obj){ 
	console.warn('JSON.toString is deprecated. Use JSON.encode');
	return JSON.encode(obj); 
}
JSON.evaluate = function(str){
	console.warn('JSON.evaluate is deprecated. Use JSON.decode');
	return JSON.decode(str); 
}
var Json = JSON;

