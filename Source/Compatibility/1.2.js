var $clear = Function.clear;
var $chk = check;
var $defined = Type.isDefined;
var $arguments = Function.argument;
var $empty = Function.empty;
var $extend = Object.extend;
var $lambda = Function.from;
var $merge = Object.merge;
var $each = each;
var $pick = pick;
var $random = Number.random;
var $splat = $A = Array.from;
var $time = Date.now;
var $try = Function.stab;
var $type = typeOf;

Class.Mutators.options = Class.Mutators.Options;

Object.type = Type.isObject;
Array.type = Type.isArray;
Number.type = Type.isNumber;
RegExp.type = Type.isRegExp;
String.type = Type.isString;
Function.type = Type.isFunction;

var Hash = new Native('Hash', function(object){
	for (var p in object) this[p] = clone(object[p]);
});

Hash.implement(Object.map(Object, function(method, name){

	return function(){
		return method.apply(null, [this].concat(arguments));
	};

}));

Native.group(Element, Window, Document).alias('dump', 'eliminate');