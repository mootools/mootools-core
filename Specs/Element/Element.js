/*
Script: Element.js
	Specs for Element.js

License:
	MIT-style license.
*/

describe('Element constructor', {

	"should return an 'element' Element": function(){
		var type = $type(new Element('div'));
		value_of(type).should_be('element');
	},

	'should return an Element with the correct tag': function(){
		var myElement = new Element('div');
		value_of(myElement.tagName.toLowerCase()).should_be('div');
	},

	'should return an Element with for attribute': function(){
		var label = new Element('label', { 'for': 'myId' });
		value_of(label.htmlFor).should_be('myId');
	},

	'should return an Element with all class attributes': function(){
		var div1 = new Element('div', { 'class': 'myClass' });
		value_of(div1.className).should_be('myClass');

		var div2 = new Element('div', { 'class': 'myClass myOtherClass' });
		value_of(div2.className).should_be('myClass myOtherClass');
	},

	'should return an Element with various attributes': function(){
		var element1 = new Element('div', { 'id': 'myDiv', 'title': 'myDiv' });
		value_of(element1.id).should_be('myDiv');
		value_of(element1.title).should_be('myDiv');
	},

	'should return Element inputs with and type attributes': function(){
		var username = new Element('input', { type: 'text', name: 'username', value: 'username' });
		value_of(username.type).should_be('text');
		value_of(username.name).should_be('username');
		value_of(username.value).should_be('username');

		var password = new Element('input', { type: 'password', name: 'password', value: 'password' });
		value_of(password.type).should_be('password');
		value_of(password.name).should_be('password');
		value_of(password.value).should_be('password');
	},

	'should return an Element with Element prototypes': function(){
		var div = new Element('div');
		value_of($defined(div.addEvent)).should_be_true();
	}

});

describe('TextNode.constructor', {

	'should return a new textnode element': function(){
		var text = new TextNode('yo');
		value_of($type(text)).should_be('textnode');
	}

});

var test, Container;

describe('TextNode.inject', {

	'before all': function(){
		var html = [
			'<div id="first"></div>',
			'<div id="second">',
				'<div id="first-child"></div>',
				'<div id="second-child"></div>',
			'</div>'
		].join('');
		Container = new Element('div', {style: 'position:absolute;top:0;left:0;visibility:hidden;', html: html});
		document.body.appendChild(Container);

		test = new TextNode('test');
	},

	'after all': function(){
		document.body.removeChild(Container);
		Container.set('html', '');
		Container = null;
		test = null;
	},

	'should `inject` the TextNode before an Element': function(){
		test.inject($('first'), 'before');
		value_of(Container.childNodes[0]).should_be(test);

		test.inject($('second-child'), 'before');
		value_of(Container.childNodes[1].childNodes[1]).should_be(test);
	},

	'should `inject` the TextNode after an Element': function(){
		test.inject($('first'), 'after');
		value_of(Container.childNodes[1]).should_be(test);

		test.inject($('first-child'), 'after');
		value_of(Container.childNodes[1].childNodes[1]).should_be(test);
	},

	'should `inject` the TextNode at bottom of an Element': function(){
		var first = $('first');
		test.inject(first, 'bottom');
		value_of(first.childNodes[0]).should_be(test);

		var second = $('second');
		test.inject(second, 'bottom');
		value_of(second.childNodes[2]).should_be(test);

		test.inject(Container, 'bottom');
		value_of(Container.childNodes[2]).should_be(test);
	},

	'should `inject` the TextNode inside an Element': function(){
		var first = $('first');
		test.inject(first, 'inside');
		value_of(first.childNodes[0]).should_be(test);

		var second = $('second');
		test.inject(second, 'inside');
		value_of(second.childNodes[2]).should_be(test);

		test.inject(Container, 'inside');
		value_of(Container.childNodes[2]).should_be(test);
	},

	'should `inject` the TextNode at the top of an Element': function(){
		test.inject(Container, 'top');
		value_of(Container.childNodes[0]).should_be(test);

		var second = $('second');
		test.inject(second, 'top');
		value_of(second.childNodes[0]).should_be(test);
	},

	'should inject the TextNode in an Element': function(){
		var first = $('first');
		test.inject(first);
		value_of(first.childNodes[0]).should_be(test);

		var second = $('second');
		test.inject(second);
		value_of(second.childNodes[2]).should_be(test);

		test.inject(Container);
		value_of(Container.childNodes[2]).should_be(test);
	}

});

describe('TextNode.dispose | TextNode.remove', {

	'before all': function(){
		Container = new Element('div').inject(document.body);
	},

	'after all': function(){
		document.body.removeChild(Container);
		Container.set('html', '');
		Container = null;
	},

	'should `dispose` the Element from the DOM': function(){
		var child = new TextNode('div').inject(Container);
		child.dispose();
		value_of(Container.childNodes.length).should_be(0);
	}

});

describe('IFrame constructor', {

	'should return a new iframe': function(){
		var diframe = document.createElement('iframe');
		var miframe = new IFrame();
		value_of(miframe.tagName).should_be(diframe.tagName);
	},

	'should return the same iframe if passed': function(){
		var diframe = document.createElement('iframe');
		var miframe = new IFrame(diframe);
		value_of(miframe).should_be(diframe);
	},

	'should call onload once the iframe loads': function(){

	},

	"should extend the iframe's window and document with the same domain": function(){

	}

});

var myElements = new Elements([
	new Element('div'),
	document.createElement('a'),
	new Element('div', {id: 'el-' + $time()})
]);

describe('Elements constructor', {

	'should return an array type': function(){
		value_of(Array.type(myElements)).should_be_true();
	},

	'should return an array of Elements': function(){
		value_of(myElements.every(Element.type)).should_be_true();
	},

	'should apply Element prototypes to the returned array': function(){
		value_of($defined(myElements.addEvent)).should_be_true();
	}

});

describe('Elements.filterBy', {

	'should return all Elements that match the string matcher': function(){
		value_of(myElements.filterBy('div')).should_be([myElements[0], myElements[2]]);
	},

	'should return all Elements that match the comparator': function(){
		var elements = myElements.filterBy(function(element){
			return element.match('a');
		});
		value_of(elements).should_be([myElements[1]]);
	}

});

describe('$', {

	'before all': function(){
		Container = document.createElement('div');
		Container.innerHTML = '<div id="dollar"></div>';
		document.body.appendChild(Container);
	},

	'after all': function(){
		document.body.removeChild(Container);
		Container = null;
	},

	'should return the element by the string id': function(){
		var dt = document.getElementById('dollar');
		value_of($('dollar')).should_be(dt);
	},

	'should return an extended element': function(){
		var defined = $defined($('dollar').clone);
		value_of(defined).should_be_true();
	},

	'should return the window element if passed': function(){
		value_of($(window)).should_be(window);
	},

	'should return the document element if passed': function(){
		value_of($(document)).should_be(document);
	},

	'should return null if string not found or type mismatch': function(){
		value_of($(1)).should_be_null();
		value_of($('nonexistant')).should_be_null();
	}

});

describe('$$', {

	'should return all Elements of a specific tag': function(){
		var divs1 = $$('div');
		var divs2 = Array.flatten(document.getElementsByTagName('div'));
		value_of(divs1).should_be(divs2);
	},

	'should return multiple Elements for each specific tag': function(){
		var headers = $$('h3', 'h4');
		var headers2 = Array.flatten([document.getElementsByTagName('h3'), document.getElementsByTagName('h4')]);
		value_of(headers).should_be(headers2);
	},

	'should return an empty array if not is found': function(){
		value_of($$('not_found')).should_be([]);
	}

});

describe('Native:getDocument', {
	
	'should return the owner document for elements': function(){
		var doc = document.newElement('div').getDocument();
		value_of(doc).should_be(document);
	},
	
	'should return the owned document for window': function(){
		var doc = window.getDocument();
		value_of(doc).should_be(document);
	},
	
	'should return self for document': function(){
		var doc = document.getDocument();
		value_of(doc).should_be(document);
	}
	
});

describe('Native:getWindow', {
	
	'should return the owner window for elements': function(){
		var win = document.newElement('div').getWindow();
		value_of(win).should_be(window);
	},
	
	'should return the owner window for document': function(){
		var win = document.getWindow();
		value_of(win).should_be(window);
	},
	
	'should return self for window': function(){
		var win = window.getWindow();
		value_of(win).should_be(window);
	}
	
});

describe('Element.getElement', {

	'before all': function(){
		Container = new Element('div');
		Container.innerHTML = '<div id="first"></div><div id="second"></div><p></p><a></a>';
	},

	'after all': function(){
		Container = null;
	},

	'should return the first Element to match the tag, otherwise null': function(){
		var child = Container.getElement('div');
		value_of(child.id).should_be('first');
		value_of(Container.getElement('iframe')).should_be_null();
	}

});

describe('Element.getElements', {

	'before all': function(){
		Container = new Element('div');
		Container.innerHTML = '<div id="first"></div><div id="second"></div><p></p><a></a>';
	},

	'after all': function(){
		Container = null;
	},

	'should return all the elements that match the tag': function(){
		var children = Container.getElements('div');
		value_of(children).should_have(2, 'items');
	},

	'should return all the elements that match the tags': function(){
		var children = Container.getElements('div,a');
		value_of(children).should_have(3, 'items');
		value_of(children[2].tagName.toLowerCase()).should_be('a');
	}

});

describe('Document.getElement', {

	'should return the first Element to match the tag, otherwise null': function(){
		var div = document.getElement('div');
		var ndiv = document.getElementsByTagName('div')[0];
		value_of(div).should_be(ndiv);

		var notfound = document.getElement('canvas');
		value_of(notfound).should_be_null();
	}

});

describe('Document.getElements', {

	'should return all the elements that match the tag': function(){
		var divs = document.getElements('div');
		var ndivs = $A(document.getElementsByTagName('div'));
		value_of(divs).should_be(ndivs);
	},

	'should return all the elements that match the tags': function(){
		var headers = document.getElements('h3,h4');
		var headers2 = Array.flatten([document.getElementsByTagName('h3'), document.getElementsByTagName('h4')]);
		value_of(headers.length).should_be(headers2.length);
	}

});

describe('Element.getElementById', {

	'before all': function(){
		Container = new Element('div');
		Container.innerHTML = '<div id="first"></div><div id="second"></div><p></p><a></a>';
		document.body.appendChild(Container);
	},

	'after all': function(){
		document.body.removeChild(Container);
		Container = null;
	},

	'should `getElementById` that matches the id, otherwise null': function(){
		value_of(Container.getElementById('first')).should_be(Container.childNodes[0]);
		value_of(Container.getElementById('not_found')).should_be_null();
	}

});

describe('Element.set `style`', {

	'should set the cssText of an Element': function(){
		var style = 'color: rgb(255, 255, 255); font-size: 12px;';
		var myElement = new Element('div').set('style', style);
		value_of(myElement.style.cssText).should_be(style);
	}

});

describe('Element.set `html`', {

	'should set the innerHTML of an Element': function(){
		var html = '<a href="#">Link</a>';
		var parent = new Element('div').set('html', html);
		value_of(parent.innerHTML).should_be(html);
	},

	'should set the innerHTML of an Element with multiple arguments': function(){
		var html = ['<p>Paragraph</p>', '<a href="#">Link</a>'];
		var parent = new Element('div').set('html', html);
		value_of(parent.innerHTML).should_be(html.join(''));
	}

});

describe('Element.set', {

	"should `set` an Element's property": function(){
		var myElement = new Element('a').set('id', 'test').set('title', 'testing');
		value_of(myElement.id).should_be('test');
		value_of(myElement.title).should_be('testing');
	},

	"should `set` an Element's properties": function(){
		var myElement = new Element('script').set({ type: 'text/javascript', defer: 'defer' });
		value_of(myElement.type).should_be('text/javascript');
		value_of(myElement.defer).should_be_true();
	}

});

describe('Element.get `style`', {

	"should return a CSS string representing the Element's styles": function(){
		var style = 'color: rgb(255, 255, 255); font-size: 12px;';
		var myElement = new Element('div').set('style', style);
		value_of(myElement.get('style')).should_be(style);
	}

});

describe('Element.get `value`', {

	'should return the selected options for a select Element': function(){
		var select = new Element('select').adopt(
			new Element('option', {value: 'volvo', html: 'Volvo'}),
			new Element('option', {value: 'saab', html: 'Saab', selected: true})
		);
		value_of(select.get('value')).should_be('saab');
	},

	'should return all the selected options for a select Element with multiple attribute': function(){
		var select = new Element('select', {multiple: true}).adopt(
			new Element('option', {value: 'volvo', html: 'Volvo'}),
			new Element('option', {value: 'saab', html: 'Saab', selected: true}),
			new Element('option', {value: 'opel', html: 'Opel', selected: true}),
			new Element('option', {value: 'bmw', html: 'BMW'})
		);
		value_of(select.get('value')).should_be(['saab', 'opel']);
	},

	'should return false as the value of a checkbox input Element if the Element is not checked': function(){
		var input = new Element('input', {type: 'checkbox', value: 'checked'});
		value_of(input.get('value')).should_be_false();
	},

	'should return the value of a checkbox input Element': function(){
		var input = new Element('input', {type: 'checkbox', checked: true, value: 'checked'});
		value_of(input.get('value')).should_be('checked');
	},

	'should return false as the value of an input Element if the Element is not checked': function(){
		var input = new Element('input', {type: 'radio', value: 'checked'});
		value_of(input.get('value')).should_be_false();
	},

	'should return the value of radio input Element': function(){
		var input = new Element('input', {type: 'radio', checked: true, value: 'checked'});
		value_of(input.get('value')).should_be('checked');
	},

	'should return value of the value property of an Element if the Element is not an input or select Element, otherwise false': function(){
		var div = new Element('div', {value: 'my value'});
		var a = new Element('a');
		value_of(div.get('value')).should_be('my value');
		value_of(a.get('value')).should_be_false();
	}

});

describe('Element.get `tag`', {

	"should return the Element's tag": function(){
		var myElement = new Element('div');
		value_of(myElement.get('tag')).should_be('div');
	}

});

describe('Element.get', {

	"should `get` an Element's property, otherwise null": function(){
		var myElement = new Element('a', {href: 'http://mootools.net/', title: 'mootools!'});
		value_of(myElement.get('href')).should_be('http://mootools.net/');
		value_of(myElement.get('title')).should_be('mootools!');
		value_of(myElement.get('rel')).should_be_null();
	}

});

describe('Element.erase `style`', {

	"should remove all of the Element's styles": function(){
		var style = 'color: rgb(255, 255, 255); font-size: 12px;';
		var myElement = new Element('div', {style: style});

		myElement.erase('style');

		value_of(myElement.get('style')).should_not_be(style);
		value_of(myElement.get('style')).should_be('');
	}

});

describe('Element.erase', {

	"should erase an Element's property": function(){
		var myElement = new Element('a', {href: 'http://mootools.net/', title: 'mootools!'});
		myElement.erase('title');
		value_of(myElement.get('title')).should_not_be('mootools!');
		value_of(myElement.get('title')).should_be_null();
	}

});

describe('Element.match', {

	'before all': function(){
		Container = new Element('div');
		Container.innerHTML = '<div id="first"></div><div id="second"></div><p></p><a></a>';
	},

	'after all': function(){
		Container.set('html', '');
		Container = null;
	},

	'should return true if tag is not provided': function(){
		value_of(Container.match()).should_be_true();
	},

	"should return true if the Element's tag matches, otherwise false": function(){
		value_of(Container.match('div')).should_be_true();
		value_of(Container.match('canvas')).should_be_false();
	}

});

describe('Element.inject', {

	'before all': function(){
		var html = [
			'<div id="first"></div>',
			'<div id="second">',
				'<div id="first-child"></div>',
				'<div id="second-child"></div>',
			'</div>'
		].join('');
		Container = new Element('div', {style: 'position:absolute;top:0;left:0;visibility:hidden;', html: html});
		document.body.appendChild(Container);

		test = new Element('div', {id:'inject-test'});
	},

	'after all': function(){
		document.body.removeChild(Container);
		Container.set('html', '');
		Container = null;
		test = null;
	},

	'should `inject` the Element before an Element': function(){
		test.inject($('first'), 'before');
		value_of(Container.childNodes[0]).should_be(test);

		test.inject($('second-child'), 'before');
		value_of(Container.childNodes[1].childNodes[1]).should_be(test);
	},

	'should `inject` the Element after an Element': function(){
		test.inject($('first'), 'after');
		value_of(Container.childNodes[1]).should_be(test);

		test.inject($('first-child'), 'after');
		value_of(Container.childNodes[1].childNodes[1]).should_be(test);
	},

	'should `inject` the Element at bottom of an Element': function(){
		var first = $('first');
		test.inject(first, 'bottom');
		value_of(first.childNodes[0]).should_be(test);

		var second = $('second');
		test.inject(second, 'bottom');
		value_of(second.childNodes[2]).should_be(test);

		test.inject(Container, 'bottom');
		value_of(Container.childNodes[2]).should_be(test);
	},

	'should `inject` the Element inside an Element': function(){
		var first = $('first');
		test.inject(first, 'inside');
		value_of(first.childNodes[0]).should_be(test);

		var second = $('second');
		test.inject(second, 'inside');
		value_of(second.childNodes[2]).should_be(test);

		test.inject(Container, 'inside');
		value_of(Container.childNodes[2]).should_be(test);
	},

	'should `inject` the Element at the top of an Element': function(){
		test.inject(Container, 'top');
		value_of(Container.childNodes[0]).should_be(test);

		var second = $('second');
		test.inject(second, 'top');
		value_of(second.childNodes[0]).should_be(test);
	},

	'should inject the Element in an Element': function(){
		var first = $('first');
		test.inject(first);
		value_of(first.childNodes[0]).should_be(test);

		var second = $('second');
		test.inject(second);
		value_of(second.childNodes[2]).should_be(test);

		test.inject(Container);
		value_of(Container.childNodes[2]).should_be(test);
	}

});

describe('Element.replaces', {

	'should replace an Element with the Element': function(){
		var parent = new Element('div');
		var div = new Element('div', {id: 'original'}).inject(parent);
		var el = new Element('div', {id: 'replaced'});
		el.replaces(div);
		value_of(parent.childNodes[0]).should_be(el);
	}

});

describe('Element.grab', {

	'before all': function(){
		var html = [
			'<div id="first"></div>',
			'<div id="second">',
				'<div id="first-child"></div>',
				'<div id="second-child"></div>',
			'</div>'
		].join('');
		Container = new Element('div', {style: 'position:absolute;top:0;left:0;visibility:hidden;', html: html}).inject(document.body);

		test = new Element('div', {id:'grab-test'});
	},

	'after all': function(){
		document.body.removeChild(Container);
		Container.set('html', '');
		Container = null;
		test = null;
	},

	'should `grab` the Element before this Element': function(){
		$('first').grab(test, 'before');
		value_of(Container.childNodes[0]).should_be(test);

		$('second-child').grab(test, 'before');
		value_of(Container.childNodes[1].childNodes[1]).should_be(test);
	},

	'should `grab` the Element after this Element': function(){
		$('first').grab(test, 'after');
		value_of(Container.childNodes[1]).should_be(test);

		$('first-child').grab(test, 'after');
		value_of(Container.childNodes[1].childNodes[1]).should_be(test);
	},

	'should `grab` the Element at the bottom of this Element': function(){
		var first = $('first');
		first.grab(test, 'bottom');
		value_of(first.childNodes[0]).should_be(test);

		var second = $('second');
		second.grab(test, 'bottom');
		value_of(second.childNodes[2]).should_be(test);

		Container.grab(test, 'bottom');
		value_of(Container.childNodes[2]).should_be(test);
	},

	'should `grab` the Element inside this Element': function(){
		var first = $('first');
		first.grab(test, 'inside');
		value_of(first.childNodes[0]).should_be(test);

		var second = $('second');
		second.grab(test, 'inside');
		value_of(second.childNodes[2]).should_be(test);

		Container.grab(test, 'inside');
		value_of(Container.childNodes[2]).should_be(test);
	},

	'should `grab` the Element at the top of this Element': function(){
		Container.grab(test, 'top');
		value_of(Container.childNodes[0]).should_be(test);

		var second = $('second');
		second.grab(test, 'top');
		value_of(second.childNodes[0]).should_be(test);
	},

	'should grab an Element in the Element': function(){
		var first = $('first').grab(test);
		value_of(first.childNodes[0]).should_be(test);

		var second = $('second').grab(test);
		value_of(second.childNodes[2]).should_be(test);

		Container.grab(test);
		value_of(Container.childNodes[2]).should_be(test);
	}

});

describe('Element.wraps', {

	'should replace and adopt the Element': function(){
		var div = new Element('div');
		var child = new Element('p').inject(div);

		var wrapper = new Element('div', {id: 'wrapper'}).wraps(div.childNodes[0]);
		value_of(div.childNodes[0]).should_be(wrapper);
		value_of(wrapper.childNodes[0]).should_be(child);
	}

});

describe('Element.appendText', {

	'before all': function(){
		Container = new Element('div', {style: 'position:absolute;top:0;left:0;visibility:hidden;'}).inject(document.body);
	},

	'before each': function(){
		var html = [
			'<div id="first"></div>',
			'<div id="second">',
				'<div id="first-child"></div>',
				'<div id="second-child"></div>',
			'</div>'
		].join('');
		Container.set('html', html);
	},

	'after all': function(){
		document.body.removeChild(Container);
		Container.set('html', '');
		Container = null;
		test = null;
	},

	'should append a TextNode before this Element': function(){
		$('first').appendText('test', 'before');
		value_of(Container.childNodes[0].nodeValue).should_be('test');

		$('second-child').appendText('test', 'before');
		value_of(Container.childNodes[2].childNodes[1].nodeValue).should_be('test');
	},

	'should append a TextNode the Element after this Element': function(){
		$('first').appendText('test', 'after');
		value_of(Container.childNodes[1].nodeValue).should_be('test');

		$('first-child').appendText('test', 'after');
		value_of(Container.childNodes[2].childNodes[1].nodeValue).should_be('test');
	},

	'should append a TextNode the Element at the bottom of this Element': function(){
		var first = $('first');
		first.appendText('test', 'bottom');
		value_of(first.childNodes[0].nodeValue).should_be('test');

		var second = $('second');
		second.appendText('test', 'bottom');
		value_of(second.childNodes[2].nodeValue).should_be('test');

		Container.appendText('test', 'bottom');
		value_of(Container.childNodes[2].nodeValue).should_be('test');
	},

	'should append a TextNode the Element inside this Element': function(){
		var first = $('first');
		first.appendText('test', 'inside');
		value_of(first.childNodes[0].nodeValue).should_be('test');

		var second = $('second');
		second.appendText('test', 'inside');
		value_of(second.childNodes[2].nodeValue).should_be('test');

		Container.appendText('test', 'inside');
		value_of(Container.childNodes[2].nodeValue).should_be('test');
	},

	'should append a TextNode the Element at the top of this Element': function(){
		Container.appendText('test', 'top');
		value_of(Container.childNodes[0].nodeValue).should_be('test');

		var second = $('second');
		second.appendText('test', 'top');
		value_of(second.childNodes[0].nodeValue).should_be('test');
	},

	'should append a TextNode an Element in the Element': function(){
		var first = $('first').appendText('test');
		value_of(first.childNodes[0].nodeValue).should_be('test');

		var second = $('second').appendText('test');
		value_of(second.childNodes[2].nodeValue).should_be('test');

		Container.appendText('test');
		value_of(Container.childNodes[2].nodeValue).should_be('test');
	}

});

describe('Element.adopt', {

	'before all': function(){
		Container = new Element('div').inject(document.body);
	},

	'after all': function(){
		document.body.removeChild(Container);
		Container.set('html', '');
		Container = null;
	},

	'before each': function(){
		Container.empty();
	},

	'should `adopt` an Element by its id': function(){
		var child = new Element('div', {id: 'adopt-me'});
		document.body.appendChild(child);
		Container.adopt('adopt-me');
		value_of(Container.childNodes[0]).should_be(child);
	},

	'should `adopt` an Element': function(){
		var child = new Element('p');
		Container.adopt(child);
		value_of(Container.childNodes[0]).should_be(child);
	},

	'should `adopt` any number of Elements or ids': function(){
		var children = [];
		(4).times(function(i){ children[i] = new Element('span', {id: 'child-' + i}); });
		Container.adopt(children);
		value_of(Container.childNodes).should_have(4, 'items');
		value_of(Container.childNodes[3]).should_be(children[3]);
	}

});

describe('Element.dispose | Element.remove', {

	'before all': function(){
		Container = new Element('div').inject(document.body);
	},

	'after all': function(){
		document.body.removeChild(Container);
		Container.set('html', '');
		Container = null;
	},

	'should `dispose` the Element from the DOM': function(){
		var child = new Element('div').inject(Container);
		child.dispose();
		value_of(Container.childNodes.length).should_be(0);
	}

});

describe('Element.clone', {

	'should return a clone': function(){
		var div = new Element('div');
		var clone = div.clone();
		value_of(div).should_not_be(clone);
	},

	'should remove all IDs': function(){
		var div = new Element('div', {id: 'div-id'});
		var clone = div.clone();
		var id = clone.id;
		value_of(id).should_be('');
	},

	'should remove all custom attributes': function(){
		var div = new Element('div', {custom: 'attribute'});
		var clone  = div.clone();
		var custom = clone.custom;
		value_of(custom).should_be_undefined();
	}

});

describe('Element.hasClass', {

	'should return true if the Element has the given class, otherwise false': function(){
		var div = new Element('div', {'class': 'header bold'});
		value_of(div.hasClass('header')).should_be_true();
		value_of(div.hasClass('bold')).should_be_true();
		value_of(div.hasClass('random')).should_be_false();
	}

});

describe('Element.addClass', {

	'should add the class to the Element': function(){
		var div = new Element('div');
		div.addClass('myclass');
		value_of(div.hasClass('myclass')).should_be_true();
	},

	'should append classes to the Element': function(){
		var div = new Element('div', {'class': 'myclass'});
		div.addClass('aclass');
		value_of(div.hasClass('aclass')).should_be_true();
	}

});

describe('Element.removeClass', {

	'should remove the class in the Element': function(){
		var div = new Element('div', {'class': 'myclass'});
		div.removeClass('myclass');
		value_of(div.hasClass('myclass')).should_be_false();
	},

	'should only remove the specific class': function(){
		var div = new Element('div', {'class': 'myclass aclass'});
		div.removeClass('myclass');
		value_of(div.hasClass('myclass')).should_be_false();
	},

	'should not remove any class if the class is not found': function(){
		var div = new Element('div', {'class': 'myclass'});
		div.removeClass('extra');
		value_of(div.hasClass('myclass')).should_be_true();
	}

});

describe('Element.toggleClass', {

	'should add the class if the Element does not have the class': function(){
		var div = new Element('div');
		div.toggleClass('myclass');
		value_of(div.hasClass('myclass')).should_be_true();
	},

	'should remove the class if the Element does have the class': function(){
		var div = new Element('div', {'class': 'myclass'});
		div.toggleClass('myclass');
		value_of(div.hasClass('myclass')).should_be_false();
	}

});

describe('Element.empty', {

	'should remove all children': function(){
		var children = [];
		(5).times(function(i){ children[i] = new Element('p'); });
		var div = new Element('div').adopt(children);
		div.empty();
		value_of(div.get('html')).should_be('');
	}

});

describe('Element.destroy', {

	'should obliterate the Element from the universe': function(){
		var div = new Element('div', {id: 'destroy-test'}).inject(document.body);
		var result = div.destroy();
		value_of(result).should_be_null();
		value_of($('destroy-test')).should_be_null();
	}

});

describe('Element.toQueryString', {

	'should return an empty string for an Element that does not have form Elements': function(){
		var div = new Element('div');
		value_of(div.toQueryString()).should_be('');
	},

	'should ignore any form Elements that do not have a name, disabled, or whose value is false': function(){
		var form = new Element('form').adopt(
			new Element('input', {name: 'input', disabled: true, type: 'checkbox', checked: true, value: 'checked'}),
			new Element('select').adopt(
				new Element('option', {name: 'volvo', value: false, html: 'Volvo'}),
				new Element('option', {value: 'saab', html: 'Saab', selected: true})
			),
			new Element('textarea', {name: 'textarea', disabled: true, value: 'textarea-value'})
		);
		value_of(form.toQueryString()).should_be('');
	},

	"should return a query string from the Element's form Elements": function(){
		var form = new Element('form').adopt(
			new Element('input', {name: 'input', type: 'checkbox', checked: true, value: 'checked'}),
			new Element('select', {name: 'select', multiple: true}).adopt(
				new Element('option', {name: 'volvo', value: 'volvo', html: 'Volvo'}),
				new Element('option', {name: 'saab', value: 'saab', html: 'Saab', selected: true}),
				new Element('option', {name: 'opel', value: 'opel', html: 'Opel', selected: true}),
				new Element('option', {name: 'bmw', value: 'bmw', html: 'BMW'})
			),
			new Element('textarea', {name: 'textarea', value: 'textarea-value'})
		);
		value_of(form.toQueryString()).should_be('input=checked&select=saab&select=opel&textarea=textarea-value');
	}

});

describe('Element.getProperty', {

	'should `getProperty` from an Element': function(){
		var anchor1 = new Element('a');
		anchor1.href = 'http://mootools.net';
		value_of(anchor1.getProperty('href')).should_be('http://mootools.net');

		var anchor2 = new Element('a');
		anchor2.href = '#someLink';
		value_of(anchor2.getProperty('href')).should_be('#someLink');
	},

	'should `getProperty` type of an input Element': function(){
		var input1 = new Element('input');
		input1.type = 'text';
		value_of(input1.getProperty('type')).should_be('text');

		var input2 = new Element('input');
		input2.type = 'checkbox';
		value_of(input2.getProperty('type')).should_be('checkbox');
	},

	'should `getPropety` checked from an input Element': function(){
		var checked1 = new Element('input', { type: 'checkbox' });
		checked1.checked = 'checked';
		value_of(checked1.getProperty('checked')).should_be_true();

		var checked2 = new Element('input', { type: 'checkbox' });
		checked2.checked = true;
		value_of(checked2.getProperty('checked')).should_be_true();

		var checked3 = new Element('input', { type: 'checkbox' });
		checked3.checked = false;
		value_of(checked3.getProperty('checked')).should_be_false();
	},

	'should `getProperty` disabled from an input Element': function(){
		var disabled1 = new Element('input', { type: 'text' });
		disabled1.disabled = 'disabled';
		value_of(disabled1.getProperty('disabled')).should_be_true();

		var disabled2 = new Element('input', { type: 'text' });
		disabled2.disabled = true;
		value_of(disabled2.getProperty('disabled')).should_be_true();

		var disabled3 = new Element('input', { type: 'text' });
		disabled3.disabled = false;
		value_of(disabled3.getProperty('disabled')).should_be_false();
	},

	'should `getProperty` readonly from an input Element': function(){
		var readonly1 = new Element('input', { type: 'text' });
		readonly1.readOnly = 'readonly';
		value_of(readonly1.getProperty('readonly')).should_be_true();

		var readonly2 = new Element('input', { type: 'text' });
		readonly2.readOnly = true;
		value_of(readonly2.getProperty('readonly')).should_be_true();

		var readonly3 = new Element('input', { type: 'text' });
		readonly3.readOnly = false;
		value_of(readonly3.getProperty('readonly')).should_be_false();
	}

});

describe('Element.setProperty', {

	'should `setProperty` from an Element': function(){
		var anchor1 = new Element('a').setProperty('href', 'http://mootools.net');
		value_of(anchor1.getProperty('href')).should_be('http://mootools.net');

		var anchor2 = new Element('a').setProperty('href', '#someLink');
		value_of(anchor2.getProperty('href')).should_be('#someLink');
	},

	'should `setProperty` type of an input Element': function(){
		var input1 = new Element('input').setProperty('type', 'text');
		value_of(input1.getProperty('type')).should_be('text');

		var input2 = new Element('input').setProperty('type', 'checkbox');
		value_of(input2.getProperty('type')).should_be('checkbox');
	},

	'should `setProperty` checked from an input Element': function(){
		var checked1 = new Element('input', { type: 'checkbox' }).setProperty('checked', 'checked');
		value_of(checked1.getProperty('checked')).should_be_true();

		var checked2 = new Element('input', { type: 'checkbox' }).setProperty('checked', true);
		value_of(checked2.getProperty('checked')).should_be_true();

		var checked3 = new Element('input', { type: 'checkbox' }).setProperty('checked', false);
		value_of(checked3.getProperty('checked')).should_be_false();
	},

	'should `setProperty` disabled of an input Element': function(){
		var disabled1 = new Element('input', { type: 'text' }).setProperty('disabled', 'disabled');
		value_of(disabled1.getProperty('disabled')).should_be_true();

		var disabled2 = new Element('input', { type: 'text' }).setProperty('disabled', true);
		value_of(disabled2.getProperty('disabled')).should_be_true();

		var disabled3 = new Element('input', { type: 'text' }).setProperty('disabled', false);
		value_of(disabled3.getProperty('disabled')).should_be_false();
	},

	'should `setProperty` readonly of an input Element': function(){
		var readonly1 = new Element('input', { type: 'text' }).setProperty('readonly', 'readonly');
		value_of(readonly1.getProperty('readonly')).should_be_true();

		var readonly2 = new Element('input', { type: 'text' }).setProperty('readonly', true);
		value_of(readonly2.getProperty('readonly')).should_be_true();

		var readonly3 = new Element('input', { type: 'text' }).setProperty('readonly', false);
		value_of(readonly3.getProperty('readonly')).should_be_false();
	}

});

describe('Element.getProperties', {

	'should return an object associate with the properties passed': function(){
		var readonly = new Element('input', { type: 'text', readonly: 'readonly' });
		var props = readonly.getProperties('type', 'readonly');
		value_of(props).should_be({ type: 'text', readonly: true });
	}

});

describe('Element.setProperties', {

	'should set each property to the Element': function(){
		var readonly = new Element('input').setProperties({ type: 'text', readonly: 'readonly' });
		var props = readonly.getProperties('type', 'readonly');
		value_of(props).should_be({ type: 'text', readonly: true });
	}

});

describe('Element.removeProperty', {

	'should `removeProperty` from an Element': function () {
		var readonly = new Element('input', { type: 'text', readonly: 'readonly' });
		readonly.removeProperty('readonly');
		var props = readonly.getProperties('type', 'readonly');
		value_of(props).should_be({ type: 'text', readonly: false });
	}

});

describe('Element.removeProperties', {

	'should remove each property from the Element': function(){
		var anchor = new Element('a', {href: '#', title: 'title', rel: 'left'});
		anchor.removeProperties('title', 'rel');
		value_of(anchor.getProperties('href', 'title', 'rel')).should_be({ href: '#' });
	}

});

describe('Element.getPrevious', {

	'should return the previous Element, otherwise null': function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('div'), new Element('div')];
		container.adopt(children);
		value_of(children[1].getPrevious()).should_be(children[0]);
		value_of(children[0].getPrevious()).should_be_null();
	},

	'should return the previous Element that matches, otherwise null': function(){
		var container = new Element('div');
		var children = [new Element('a'), new Element('div'), new Element('div'), new Element('div')];
		container.adopt(children);
		value_of(children[1].getPrevious('a')).should_be(children[0]);
		value_of(children[1].getPrevious('span')).should_be_null();
	}

});

describe('Element.getAllPrevious', {

	'should return all the previous Elements, otherwise an empty array': function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('div'), new Element('div')];
		container.adopt(children);
		value_of(children[2].getAllPrevious()).should_be([children[1], children[0]]);
		value_of(children[0].getAllPrevious()).should_be([]);
	},

	'should return all the previous Elements that match, otherwise an empty array': function(){
		var container = new Element('div');
		var children = [new Element('a'), new Element('div'), new Element('a'), new Element('div')];
		container.adopt(children);
		value_of(children[3].getAllPrevious('a')).should_be([children[2], children[0]]);
		value_of(children[1].getAllPrevious('span')).should_be([]);
	}

});

describe('Element.getNext', {

	'should return the next Element, otherwise null': function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('div'), new Element('div')];
		container.adopt(children);
		value_of(children[1].getNext()).should_be(children[2]);
		value_of(children[2].getNext()).should_be_null();
	},

	'should return the previous Element that matches, otherwise null': function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('div'), new Element('div'), new Element('a')];
		container.adopt(children);
		value_of(children[1].getNext('a')).should_be(children[3]);
		value_of(children[1].getNext('span')).should_be_null();
	}

});

describe('Element.getAllNext', {

	'should return all the next Elements, otherwise an empty array': function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('div'), new Element('div')];
		container.adopt(children);
		value_of(children[0].getAllNext()).should_be(children.slice(1));
		value_of(children[2].getAllNext()).should_be([]);
	},

	'should return all the next Elements that match, otherwise an empty array': function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('a'), new Element('div'), new Element('a')];
		container.adopt(children);
		value_of(children[0].getAllNext('a')).should_be([children[1], children[3]]);
		value_of(children[0].getAllNext('span')).should_be([]);
	}

});

describe('Element.getFirst', {

	'should return the first Element in the Element, otherwise null': function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('a'), new Element('div')];
		container.adopt(children);
		value_of(container.getFirst()).should_be(children[0]);
		value_of(children[0].getFirst()).should_be_null();
	},

	'should return the first Element in the Element that matches, otherwise null': function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('a'), new Element('div')];
		container.adopt(children);
		value_of(container.getFirst('a')).should_be(children[1]);
		value_of(container.getFirst('span')).should_be_null();
	}

});

describe('Element.getLast | Element.getLastChild', {

	'should return the last Element in the Element, otherwise null': function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('a'), new Element('div')];
		container.adopt(children);
		value_of(container.getLast()).should_be(children[2]);
		value_of(children[0].getLast()).should_be_null();
	},

	'should return the last Element in the Element that matches, otherwise null': function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('a'), new Element('div'), new Element('a')];
		container.adopt(children);
		value_of(container.getLast('a')).should_be(children[3]);
		value_of(container.getLast('span')).should_be_null();
	}

});

describe('Element.getParent', {

	'should return the parent of the Element, otherwise null': function(){
		var container = new Element('p');
		var children = [new Element('div'), new Element('div'), new Element('div')];
		container.adopt(children);
		value_of(children[1].getParent()).should_be(container);
		value_of(container.getParent()).should_be_null();
	},

	'should return the parent of the Element that matches, otherwise null': function(){
		var container = new Element('p');
		var children = [new Element('div'), new Element('div'), new Element('div')];
		container.adopt(new Element('div').adopt(children));
		value_of(children[1].getParent('p')).should_be(container);
		value_of(children[1].getParent('table')).should_be_null();
	}

});

describe('Element.getParents', {

	'should return the parents of the Element, otherwise returns an empty array': function(){
		var container = new Element('p');
		var children = [new Element('div'), new Element('div'), new Element('div')];
		container.adopt(new Element('div').adopt(new Element('div').adopt(children)));
		value_of(children[1].getParents()).should_be([container.getFirst().getFirst(), container.getFirst(), container]);
		value_of(container.getParents()).should_be([]);
	},

	'should return the parents of the Element that match, otherwise returns an empty array': function(){
		var container = new Element('p');
		var children = [new Element('div'), new Element('div'), new Element('div')];
		container.adopt(new Element('div').adopt(new Element('div').adopt(children)));
		value_of(children[1].getParents('div')).should_be([container.getFirst().getFirst(), container.getFirst()]);
		value_of(children[1].getParents('table')).should_be([]);
	}

});

describe('Element.getChildren', {

	"should return the Element's children, otherwise returns an empty array": function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('div'), new Element('div')];
		container.adopt(children);
		value_of(container.getChildren()).should_be(children);
		value_of(children[0].getChildren()).should_be([]);
	},

	"should return the Element's children that match, otherwise returns an empty array": function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('a'), new Element('a')];
		container.adopt(children);
		value_of(container.getChildren('a')).should_be([children[1], children[2]]);
		value_of(container.getChildren('span')).should_be([]);
	}

});

describe('Element.hasChild', {

	'should return true if the Element has the child, otherwise false': function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('div'), new Element('div')];
		container.adopt(children);
		value_of(container.hasChild(children[0])).should_be_true();
		value_of(container.hasChild('span')).should_be_false();
	}

});