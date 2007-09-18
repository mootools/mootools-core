Class.prototype = $extend(Class.prototype, {
	extend: function(properties){
		return new Class(Class.Extends(this, properties));
	}
});