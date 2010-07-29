(function(context){

var Configuration = context.Configuration = {};

Configuration.name = 'MooTools Core';

Configuration.presets = [
	{
		version: '1.2',
		specs: ['1.2']
	},
	{
		version: '1.3',
		specs: ['1.2', '1.3base', '1.3client']
	}
];

Configuration.sets = {

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

Configuration.source = {

	'1.2': {
		'client': [
			'Core/Core',
			'Core/Browser',

			'Native/Array',
			'Native/Function',
			'Native/Number',
			'Native/String',
			'Native/Hash',
			'Native/Event',

			'Class/Class',
			'Class/Class.Extras',

			'Element/Element',
			'Element/Element.Event',
			'Element/Element.Style',
			'Element/Element.Dimensions',

			'Utilities/Selectors',
			'Utilities/DomReady',
			'Utilities/JSON',
			'Utilities/Cookie',
			'Utilities/Swiff',

			'Fx/Fx',
			'Fx/Fx.CSS',
			'Fx/Fx.Tween',
			'Fx/Fx.Morph',
			'Fx/Fx.Transitions',

			'Request/Request',
			'Request/Request.HTML',
			'Request/Request.JSON',
		]
	},

	'1.3': {
		'base': [
			'Core/Core',

			'Types/Array',
			'Types/Function',
			'Types/Number',
			'Types/String',
			'Types/Object',

			'Class/Class',
			'Class/Class.Extras'
		],
		'client': [
			'Types/Event',

			'Browser/Browser',

			'Slick/Slick.Parser',
			'Slick/Slick.Finder',

			'Element/Element',
			'Element/Element.Event',
			'Element/Element.Style',
			'Element/Element.Dimensions',

			'Utilities/DomReady',
			'Utilities/JSON',
			'Utilities/Cookie',
			'Utilities/Swiff',

			'Fx/Fx',
			'Fx/Fx.CSS',
			'Fx/Fx.Tween',
			'Fx/Fx.Morph',
			'Fx/Fx.Transitions',

			'Request/Request',
			'Request/Request.HTML',
			'Request/Request.JSON'
		]
	}

};

})(typeof exports != 'undefined' ? exports : this);
