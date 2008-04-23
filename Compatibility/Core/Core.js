$A = function(iterable, start, length){
	if (Browser.Engine.trident && $type(iterable) == 'collection'){
		start = start || 0;
		if (start < 0) start = iterable.length + start;
		length = length || (iterable.length - start);
		var array = [];
		for (var i = 0; i < length; i++) array[i] = iterable[start++];
		return array;
	}
	start = (start || 0) + ((start < 0) ? iterable.length : 0);
	var end = ((!$chk(length)) ? iterable.length : length) + start;
	return Array.prototype.slice.call(iterable, start, end);
};

(function(){
	var natives = [Array, Function, String, RegExp, Number];
	for (var i = 0, l = natives.length; i < l; i++) natives[i].extend = natives[i].implement;
})();