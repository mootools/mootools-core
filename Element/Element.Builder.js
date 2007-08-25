/*
Script: Element.Builder.js
	Build Elements

License:
	MIT-style license.
*/

/*
Function: $build
	Creating Element on-the-fly with selector notation.
	Optional arguments mean that you can omit them.

Arguments:
	Building Element:
	selector - (string) the selector of the element
	properties - (object, optional) More properties, same as for <Element.initialize>
	text - (string, optional) Text content for the Element, using <Element.setText>
	children - (array, optional) An array of $build arguments to build and adopt those Elements
	callback - (function, optional) An optional callback that gets called with the element and the argument.
	Building Elements:
	Unlimited amount of children arrays

Selector:
	Supports notation for classnames, id, attributes and special pseudo selectors:
	'tag#myId.myClass1.myClass2[attribute1="value"][attribute2="value"]'
	When you use the pseudo selector :ref(name) like 'div.classX:ref(wrap)' the element
	is saved as reference in $build.refs.wrap to target it. $build.refs is emptied on
	every $build call.

Children:
	This array can be a notation for a single element ( ['div', 'Text'] ) for building
	only one Element or an array of notations ( [['div#id-1'], ['a#link-1', 'Link Me'], ['div', 'Footer']] )

Example:
	One Element, with additional properties
	(start code)
	var div = $build('div#id-1.classX', {
		'styles': {'color': 'red'}
	});
	(end)

	... with more children (syntax for one child element and more children)
	(start code)
	var list = $build('ul.menu', [
		['li', 'Item 1', ['img[src="item1.jpg"]']],
		['li', 'Item 2', ['img[src="item2.jpg"]']],
		['li', 'Item 3', ['img[src="item3.jpg"]']]
	]);
	(end)

	Creating a link
	(start code)
	var toggle = $build('a.toggler[href=#][title="Click for more Content"]', {
		'events': {
			'click': function(){
				this.getNext().slideToggle();
				return false;
			}
		}
	}, 'Open').inject(target);
	(end)

	Creating Elements
	(start code)
	var links = $build(
		['a[href=#part-1]', 'Link 1'],
		['a[href=#part-2]', 'Link 2'],
		['a[href=#top]:ref(top)', 'Top']
	); // links is now an instance of Elements
	var topLink = $build.refs.top; // referenced using :ref()
	(end)
*/

var $build = function() {
	var args = Array.associate(arguments, {'inline': 'string', 'properties': 'object', 'text': 'string', 'children': 'array', 'callback': 'function'});
	var element;
	var parent = ($type(this) == 'element') ? this : false;
	if (!$build.root){
		$build.root = parent || true;
		$build.clearRefs();
	}
	if (args.inline){
		var inline = Selectors.$parse(args.inline);
		if (inline.tag == '*') return false;
		var attributes = $merge(args.properties || {});
		if (inline.id) attributes.id = inline.id;
		inline.attributes.each(function(item) {
			attributes[item[0]] = item[2];
		});
		inline.pseudos.each(function(item) {
			if (item.name == 'ref') args.ref = item.argument;
		});
		if (inline.classes.length) attributes['class'] = ((attributes['class'] || '') + ' ' + inline.classes.join(' ')).trim();
		element = new Element(inline.tag, attributes);
		if (args.text) element.appendText(args.text);
		if (args.callback) element = args.callback.call(element, element, args);
		if (args.ref) $build.refs[args.ref] = element;
	}
	if (args.children && args.children.length){
		var children = (element) ? args.children : $A(arguments);
		children.each(function(child) {
			$build.apply(element || parent, child);
		});
		if (!element) return new Elements(collect, true);
	}
	return (parent) ? element.inject(parent) : element;
};

$build.extend({

	refs: {},

	clearRefs: function(){
		for (var p in $build.refs) $build.refs[p] = null;
	}

});