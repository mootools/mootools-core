Class.empty = function(){ 
	console.warn('replace Class.empty with $empty');
	return $empty;
};

//legacy .extend support

Class.prototype.extend = function(properties){
	console.warn('1.1 > 1.2: Class.extend is deprecated. See the class Extend mutator.');
	properties.Extends = this;
	return new Class(properties);
};

(function(){
	var __implement = Class.prototype.implement;
	Class.prototype.implement = function(){
		if (arguments.length > 1 && Array.every(arguments, Object.type)){
			console.warn('1.1 > 1.2: Class.implement no longer takes more than one thing at a time, either MyClass.implement(key, value) or MyClass.implement(object) but NOT MyClass.implement(new Foo, new Bar, new Baz). See also: the class Implements mutator.');
			Array.each(arguments, function(argument){
				__implement.call(this, argument);
			});
			return this;
		}
		return __implement.apply(this, arguments);
	};
})();