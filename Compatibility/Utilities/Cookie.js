Cookie.set = function(key, value, options){
	return new Cookie(key, options).write(value);
};

Cookie.get = function(key){
	return new Cookie(key).read();
};

Cookie.remove = function(key, options){
	return new Cookie(key, options).dispose();
};