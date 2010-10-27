(function(context){

var Configuration = context.Configuration = {};

Configuration.name = 'MooTools Core';

Configuration.presets = {
	'core-1.2': {
		sets: ['1.2'],
		source: ['1.2']
	},
	'core-1.3-base': {
		sets: ['core-1.3-base'],
		source: ['core-1.3-base']
	},
	'core-1.3-client': {
		sets: ['core-1.3-base', 'core-1.3-client'],
		source: ['core-1.3-base', 'core-1.3-client']
	},
	'core-1.3 + core-1.2': {
		sets: ['1.2', 'core-1.3-base', 'core-1.3-client'],
		source: ['core-1.3-base', 'core-1.3-client']
	}
};

Configuration.defaultPresets = {
	browser: 'core-1.3 + core-1.2',
	nodejs: 'core-1.3-base',
	jstd: 'core-1.3 + core-1.2'
};

Configuration.sets = {

	'1.2': {
		path: '1.2/',
		files: [
			'Core/Core', 'Core/Native', 'Core/Browser',
			'Native/Array', 'Native/String', 'Native/Function', 'Native/Number', 'Native/Hash',
			'Class/Class', 'Class/Class.Extras',
			'Element/Element', 'Element/Element.Style', 'Element/Element.Dimensions'
		]
	},

	'core-1.3-base': {
		path: '1.3base/',
		files: [
			'Core/Core',
			'Types/Array', 'Types/Function', 'Types/Object',
			'Class/Class',
			'Fx/Fx'
		]
	},

	'core-1.3-client': {
		path: '1.3client/',
		files: [
			'Core/Core',
			'Browser/Browser',
			'Class/Class.Extras',
			'Element/Element',
			'Element/NewElement',
			'Element/Element.Event',
			'Element/Element.Dimensions',
			'Element/IFrame',
			'Request/Request',
			'Request/Request.HTML',
			'Request/Request.JSON',
			'Fx/Fx.Tween',
			'Fx/Fx.Morph',
			'Utilities/Cookie',
			'Utilities/JSON'
		]
	}
};


Configuration.source = {

	'1.2': {
		path: '../Source/',
		files: [
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

	'core-1.3-base': {
		path: '../Source/',
		files: [
			'Core/Core',

			'Types/Array',
			'Types/Function',
			'Types/Number',
			'Types/String',
			'Types/Object',

			'Class/Class',
			'Class/Class.Extras',

			'Fx/Fx',
			'Fx/Fx.Transitions'
		]
	},

	'core-1.3-client': {
		path: '../Source/',
		files: [
			'Types/Event',

			'Browser/Browser',

			'Slick/Slick.Parser',
			'Slick/Slick.Finder',

			'Element/Element',
			'Element/Element.Event',
			'Element/Element.Style',
			'Element/Element.Dimensions',

			'Utilities/DOMReady',
			'Utilities/JSON',
			'Utilities/Cookie',
			'Utilities/Swiff',

			'Fx/Fx.CSS',
			'Fx/Fx.Tween',
			'Fx/Fx.Morph',

			'Request/Request',
			'Request/Request.HTML',
			'Request/Request.JSON'
		]
	}

};

})(typeof exports != 'undefined' ? exports : this);
