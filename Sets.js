(function(context){
	
context.Sets = {

	'1.1public': [
		'Core/Core.js',
		'Native/Array.js', 'Native/Function.js', 'Native/Number.js', 'Native/String.js', 'Native/Element.js',
		'Class/Class.js', 'Class/Class.Extras.js',
		'Element/Element.Dimensions.js', 'Element/Element.Form.js', 'Element/Element.Filters.js',
		'Element/Element.Selectors.js', 'Element/Element.Event.js',
		'Remote/Ajax.js', 'Remote/Cookie.js', 'Remote/Json.js', 'Remote/XHR.js'
		'Remote/Assets.js', 'Fx/Fx.Transitions.js'
	],
	
	'1.1compat': [
		'Core/Browser.js', 'Class/Class.js',
		'Native/Array.js', 'Native/Function.js', 'Native/Hash.js',
		'Element/Element.js'
	],

	
	'1.2public': [
		'Core/Core.js', 'Core/Browser.js',
		'Native/Array.js', 'Native/String.js', 'Native/Function.js', 'Native/Number.js', 'Native/Hash.js',
		'Class/Class.js', 'Class/Class.Extras.js',
		'Element/Element.js', 'Element/Element.Style.js', 'Element/Element.Dimensions.js'
	],

	'1.2private': [
		'Core/Core.js', 'Core/Browser.js'
	],

	'1.3public': [
		'Core/Core.js', 'Core/Utils.js',
		'Types/Array.js', 'Types/Function.js', 'Types/Hash.js',
		'Class/Class.js', 'Element/Element.js'
	]

};

})(this.exports || this);