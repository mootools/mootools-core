(function(context){
	
context.Sets = {

	'1.2': [
		'Core/Core', 'Core/Native', 'Core/Browser',
		'Native/Array', 'Native/String', 'Native/Function', 'Native/Number', 'Native/Hash',
		'Class/Class', 'Class/Class.Extras',
		'Element/Element', 'Element/Element.Style', 'Element/Element.Dimensions'
	],

	'1.3base': [
		'Core/Core',
		'Types/Array', 'Types/Function', 'Types/Object',
		'Class/Class'
	],

	'1.3client': [
		'Core/Core',
		'Browser/Browser',
		'Element/NewElement'
	]

};

})(typeof exports != 'undefined' ? exports : this);