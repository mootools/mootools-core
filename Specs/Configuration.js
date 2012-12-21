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
	},
	'mobile core-1.3': {
		sets: ['core-1.3-base', 'core-1.3-client'],
		source: ['1.3mobile']
	},
	'core-1.4': {
		sets: ['1.2', 'core-1.3-base', 'core-1.3-client', 'core-1.4-base', 'core-1.4-client'],
		source: ['core-1.4-base', 'core-1.4-client']
	},
	'core-1.4-nocompat': {
		sets: ['core-1.3-base', 'core-1.3-client', 'core-1.4-base-nocompat', 'core-1.4-client'],
		source: ['1.4nocompat']
	},
	'core-1.5': {
		sets: ['1.2', 'core-1.3-base', 'core-1.3-client', 'core-1.4-base', 'core-1.4-client', 'core-1.5-base'],
		source: ['core-1.4-base', 'core-1.4-client']
	},
	'core-2.0': {
		sets: ['core-2.0-base', 'core-2.0-client'],
		source: ['core-2.0-base', 'core-2.0-client']
	}
};

Configuration.defaultPresets = {
	browser: 'core-1.4',
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
			'Types/Object',
			'Browser/Browser',
			'Class/Class.Extras',
			'Element/Element',
			'Element/NewElement',
			'Element/Element.Event',
			'Element/Element.Dimensions',
			'Element/Element.Style',
			'Element/IFrame',
			'Request/Request',
			'Request/Request.HTML',
			'Request/Request.JSON',
			'Fx/Fx.Tween',
			'Fx/Fx.Morph',
			'Utilities/Cookie',
			'Utilities/JSON'
		]
	},

	'core-1.4-base': {
		path: '1.4base/',
		files: [
			'Types/Array'
		]
	},

	'core-1.4-base-nocompat': {
		path: '1.4base/',
		files: [
			'Types/Function-nocompat'
		]
	},

	'core-1.4-client': {
		path: '1.4client/',
		files: [
			'Element/Element',
			'Element/Element.Event',
			'Element/Element.Style',
			'Element/Element.Delegation',
			'Element/Element.appendHTML',
			'Fx/Fx.Tween',
			'Fx/Fx.Morph'
		]
	},

	'core-1.5-base': {
		path: '1.5base/',
		files: [
			'Core/Core',
			'Fx/Fx'
		]
	},

	'core-2.0-base': {
		path: '2.0base/',
		files: [
			'Core/Core',

			'Types/Array',
			'Types/Function',
			'Types/Number',
			'Types/String',
			'Types/Object'
		]
	},

	'core-2.0-client': {
		path: '2.0client/',
		files: [
			'Browser/Browser'
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

			'Fx/Fx',
			'Fx/Fx.CSS',
			'Fx/Fx.Tween',
			'Fx/Fx.Morph',
			'Fx/Fx.Transitions',

			'Request/Request',
			'Request/Request.HTML',
			'Request/Request.JSON'
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

			'Fx/Fx.CSS',
			'Fx/Fx.Tween',
			'Fx/Fx.Morph',

			'Request/Request',
			'Request/Request.HTML',
			'Request/Request.JSON'
		]
	},

	'core-1.4-base': {
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

	'core-1.4-client': {
		path: '../Source/',
		files: [
			'Types/DOMEvent',

			'Browser/Browser',

			'Slick/Slick.Parser',
			'Slick/Slick.Finder',

			'Element/Element',
			'Element/Element.Event',
			'Element/Element.Delegation',
			'Element/Element.Style',
			'Element/Element.Dimensions',

			'Utilities/DOMReady',
			'Utilities/JSON',
			'Utilities/Cookie',

			'Fx/Fx.CSS',
			'Fx/Fx.Tween',
			'Fx/Fx.Morph',

			'Request/Request',
			'Request/Request.HTML',
			'Request/Request.JSON'
		]
	},

	'1.3mobile': {
		path: './',
		files: ['mootools-core-mobile']
	},

	'1.4nocompat': {
		path: './',
		files: ['mootools-core-nocompat']
	},

	'core-2.0-base': {
		path: '../Source/',
		files: [
			'Core/Core',

			'Types/Array',
			'Types/Function',
			'Types/Number',
			'Types/String',
			'Types/Object',

			'Utilities/Accessor',
			'Utilities/Color',
			'Utilities/Table',
			'Utilities/JSON',

			'Class/Class',
			'Class/Chain',
			'Class/Events',
			'Class/Options',
			'Class/Store',

			'Fx/Fx'
		]
	},

	'core-2.0-client': {
		path: '../Source/',
		files: [
			'Browser/Browser',

			'Slick/Slick.Parser',
			'Slick/Slick.Finder',

			'Element/Element',

			'Browser/Event',

			'Element/Element.Style',

			'Utilities/DOMReady',

			'Fx/Fx.Morph',

			'Request/Request',
			'Request/Request.HTML',
			'Request/Request.JSON'
		]
	}

};

})(typeof exports != 'undefined' ? exports : this);
