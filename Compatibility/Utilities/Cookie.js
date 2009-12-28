
Cookie.set = function(key, value, options){
	console.warn('1.1 > 1.2: Cookie.set is deprecated. Use Cookie.write');
    return new Cookie(key, options).write(value);
};

Cookie.get = function(key){
	console.warn('1.1 > 1.2: Cookie.get is deprecated. Use Cookie.read');
    return new Cookie(key).read();
};

Cookie.remove = function(key, options){
	console.warn('1.1 > 1.2: Cookie.remove is deprecated. Use Cookie.dispose');
    return new Cookie(key, options).dispose();
};
