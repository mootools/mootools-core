(function(context){
	
context.Sets = {

	'1.1public': [
		'Core/Core',
		'Native/Array', 'Native/Function', 'Native/Number', 'Native/String', 'Native/Element',
		'Class/Class', 'Class/Class.Extras',
		'Element/Element.Dimensions', 'Element/Element.Form', 'Element/Element.Filters',
		'Element/Element.Selectors', 'Element/Element.Event',
		'Remote/Ajax', 'Remote/Cookie', 'Remote/Json', 'Remote/XHR',
		'Remote/Assets', 'Fx/Fx.Transitions',
		'Window/Window.DomReady', 'Window/Window.Size',
		'Plugins/Color', 'Plugins/Group', 'Plugins/Hash', 'Plugins/Hash.Cookie'
	],
	
	'1.2public': [
		'Core/Core', 'Core/Browser',
		'Native/Array', 'Native/String', 'Native/Function', 'Native/Number', 'Native/Hash',
		'Class/Class', 'Class/Class.Extras',
		'Element/Element', 'Element/Element.Style', 'Element/Element.Dimensions'
	],

	'1.2private': [
		'Core/Core', 'Core/Browser'
	],

	'1.3public': [
		'Core/Core',
		'Types/Array', 'Types/Function', 'Types/Object',
		'Class/Class',
		'Browser/Browser',
		'Element/NewElement'
	]

};

})(this.exports || this);