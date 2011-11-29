/*
Script: Element.js
	Specs for Element.js

License:
	MIT-style license.
*/

describe('Element constructor', {

	"should return an Element with the correct tag": function(){
		var element = new Element('div');
		expect($type(element)).toEqual('element');
		expect($defined(element.addEvent)).toBeTruthy();
		expect(element.tagName.toLowerCase()).toEqual('div');
	},

	'should return an Element with various attributes': function(){
		var element = new Element('div', { 'id': 'divID', 'title': 'divTitle' });
		expect(element.id).toEqual('divID');
		expect(element.title).toEqual('divTitle');
	},

	'should return an Element with for attribute': function(){
		var label = new Element('label', { 'for': 'myId' });
		expect(label.htmlFor).toEqual('myId');
	},

	'should return an Element with class attribute': function(){
		var div1 = new Element('div', { 'class': 'class' });
		var div2 = new Element('div', { 'class': 'class1 class2 class3' });

		expect(div1.className).toEqual('class');
		expect(div2.className).toEqual('class1 class2 class3');
	},

	'should return input Elements with name and type attributes': function(){
		var username = new Element('input', { type: 'text', name: 'username', value: 'username' });
		var password = new Element('input', { type: 'password', name: 'password', value: 'password' });
		expect(username.type).toEqual('text');
		expect(username.name).toEqual('username');
		expect(username.value).toEqual('username');

		expect(password.type).toEqual('password');
		expect(password.name).toEqual('password');
		expect(password.value).toEqual('password');

		var dad = new Element('div');
		dad.adopt(username, password);
		dad.inject(document.body);
		expect(document.getElementsByName('username')[0]).toEqual(username);
		expect(document.getElementsByName('password')[0]).toEqual(password);
		dad.dispose();
	},

	'should be able to use all kinds of silly characters in your name attribute values': function(){
		["foo","bar[]","b'a'z",'b"a"ng','boi ng'].each(function(name){
			var input = new Element('input', { type: 'text', name: name, value: name });
			expect(input.type).toEqual('text');
			expect(input.name).toEqual(name);
			expect(input.value).toEqual(name);
			var dad = new Element('div');
			dad.adopt(input);
			dad.inject(document.body);
			expect(document.getElementsByName(name)[0]).toEqual(input);
			dad.dispose();
		});
	},

	'should return input Elements that are checked': function(){
		var check1 = new Element('input', { type: 'checkbox' });
		var check2 = new Element('input', { type: 'checkbox', checked: true });
		var check3 = new Element('input', { type: 'checkbox', checked: 'checked' });

		expect(check1.checked).toBeFalsy();
		expect(check2.checked).toBeTruthy();
		expect(check3.checked).toBeTruthy();
	},

	"should return a select Element that retains it's selected options": function(){
		var div = new Element('div', { 'html':
			'<select multiple="multiple" name="select[]">' +
				'<option value="" name="none">--</option>' +
				'<option value="volvo" name="volvo">Volvo</option>' +
				'<option value="saab" name="saab" selected="selected">Saab</option>' +
				'<option value="opel" name="opel" selected="selected">Opel</option>' +
				'<option value="bmw" name="bmw">BMW</option>' +
			'</select>'
		});

		var select1 = div.getFirst();
		var select2 = new Element('select', { name: 'select[]', multiple: true }).adopt(
			new Element('option', { name: 'none', value: '', html: '--' }),
			new Element('option', { name: 'volvo', value: 'volvo', html: 'Volvo' }),
			new Element('option', { name: 'saab', value: 'saab', html: 'Saab', selected: true }),
			new Element('option', { name: 'opel', value: 'opel', html: 'Opel', selected: 'selected' }),
			new Element('option', { name: 'bmw', value: 'bmw', html: 'BMW' })
		);

		expect(select1.multiple).toBeTruthy();
		expect(select2.multiple).toBeTruthy();

		expect(select1.name).toEqual(select2.name);
		expect(select1.options.length).toEqual(select2.options.length);
		expect(select1.toQueryString()).toEqual(select2.toQueryString());
	}

});

describe('Element.set', {

	"should set a single attribute of an Element": function(){
		var div = new Element('div').set('id', 'some_id');
		expect(div.id).toEqual('some_id');
	},

	"should set the checked attribute of an Element": function(){
		var input1 = new Element('input', {type: 'checkbox'}).set('checked', 'checked');
		var input2 = new Element('input', {type: 'checkbox'}).set('checked', true);
		expect(input1.checked).toBeTruthy();
		expect(input2.checked).toBeTruthy();
	},

	"should set the class name of an element": function(){
		var div = new Element('div').set('class', 'some_class');
		expect(div.className).toEqual('some_class');
	},

	"should set the for attribute of an element": function(){
		var input = new Element('label', {type: 'text'}).set('for', 'some_element');
		expect(input.htmlFor).toEqual('some_element');
	},

	"should set the html of an Element": function(){
		var html = '<a href="http://mootools.net/">Link</a>';
		var parent = new Element('div').set('html', html);
		expect(parent.innerHTML.toLowerCase()).toEqual(html.toLowerCase());
	},

	"should set the html of an Element with multiple arguments": function(){
		var html = ['<p>Paragraph</p>', '<a href="http://mootools.net/">Link</a>'];
		var parent = new Element('div').set('html', html);
		expect(parent.innerHTML.toLowerCase()).toEqual(html.join('').toLowerCase());
	},

	"should set the html of a select Element": function(){
		var html = '<option>option 1</option><option selected="selected">option 2</option>';
		var select = new Element('select').set('html', html);
		expect(select.getChildren().length).toEqual(2);
		expect(select.options.length).toEqual(2);
		expect(select.selectedIndex).toEqual(1);
	},

	"should set the html of a table Element": function(){
		var html = '<tbody><tr><td>cell 1</td><td>cell 2</td></tr><tr><td class="cell">cell 1</td><td>cell 2</td></tr></tbody>';
		var table = new Element('table').set('html', html);
		expect(table.getChildren().length).toEqual(1);
		expect(table.getFirst().getFirst().getChildren().length).toEqual(2);
		expect(table.getFirst().getLast().getFirst().className).toEqual('cell');
	},

	"should set the html of a tbody Element": function(){
		var html = '<tr><td>cell 1</td><td>cell 2</td></tr><tr><td class="cell">cell 1</td><td>cell 2</td></tr>';
		var tbody = new Element('tbody').inject(new Element('table')).set('html', html);
		expect(tbody.getChildren().length).toEqual(2);
		expect(tbody.getLast().getFirst().className).toEqual('cell');
	},

	"should set the html of a tr Element": function(){
		var html = '<td class="cell">cell 1</td><td>cell 2</td>';
		var tr = new Element('tr').inject(new Element('tbody').inject(new Element('table'))).set('html', html);
		expect(tr.getChildren().length).toEqual(2);
		expect(tr.getFirst().className).toEqual('cell');
	},

	"adopting should not change the parent of the element doing the adopting": function(){
		var baldGuy = new Element('div');
		var annie = new Element('span');

		gramps = baldGuy.getParent();
		baldGuy.adopt(annie);
		expect(baldGuy.getParent()).toEqual(gramps)
	},

	"should set the html of a td Element": function(){
		var html = '<span class="span">Some Span</span><a href="#">Some Link</a>';
		var td = new Element('td').inject(new Element('tr').inject(new Element('tbody').inject(new Element('table')))).set('html', html);
		expect(td.getChildren().length).toEqual(2);
		expect(td.getFirst().className).toEqual('span');
	},

	"should set the style attribute of an Element": function(){
		var style = 'font-size:12px;line-height:23px;';
		var div = new Element('div').set('style', style);
		expect(div.style.lineHeight).toEqual('23px');
		expect(div.style.fontSize).toEqual('12px');
	},

	"should set the text of an element": function(){
		var div = new Element('div').set('text', 'some text content');
		expect(div.get('text')).toEqual('some text content');
		expect(div.innerHTML).toEqual('some text content');
	},

	"should set multiple attributes of an Element": function(){
		var div = new Element('div').set({ id: 'some_id', 'title': 'some_title', 'html': 'some_content' });
		expect(div.id).toEqual('some_id');
		expect(div.title).toEqual('some_title');
		expect(div.innerHTML).toEqual('some_content');
	},

	"should set various attributes of a script Element": function(){
		var script = new Element('script').set({ type: 'text/javascript', defer: 'defer' });
		expect(script.type).toEqual('text/javascript');
		expect(script.defer).toBeTruthy();
	},

	"should set various attributes of a table Element": function(){
		var table1 = new Element('table').set({ border: '2', cellpadding: '3', cellspacing: '4', align: 'center' });
		var table2 = new Element('table').set({ cellPadding: '3', cellSpacing: '4' });
		expect(table1.border == 2).toBeTruthy();
		expect(table1.cellPadding == 3).toBeTruthy();
		expect(table2.cellPadding == 3).toBeTruthy();
		expect(table1.cellSpacing == 4).toBeTruthy();
		expect(table2.cellSpacing == 4).toBeTruthy();
		expect(table1.align).toEqual('center');
	}

});

var myElements = new Elements([
	new Element('div'),
	document.createElement('a'),
	new Element('div', {id: 'el-' + $time()})
]);

describe('Elements', {

	'should return an array type': function(){
		expect(Array.type(myElements)).toBeTruthy();
	},

	'should return an array of Elements': function(){
		expect(myElements.every(Element.type)).toBeTruthy();
	},

	'should apply Element prototypes to the returned array': function(){
		expect($defined(myElements.addEvent)).toBeTruthy();
	},

	'should return all Elements that match the string matcher': function(){
		var filter = myElements.filter('div');

		expect(filter[0] == myElements[0] && filter[1] == myElements[2] && filter.length == 2).toBeTruthy();
	},

	'should return all Elements that match the comparator': function(){
		var elements = myElements.filter(function(element){
			return element.match('a');
		});
		expect(elements[0] == myElements[1] && elements.length == 1).toBeTruthy();
	}

});

describe('TextNode.constructor', {

	'should return a new textnode element': function(){
		var text = document.newTextNode('yo');
		expect($type(text)).toEqual('textnode');
	}

});

describe('IFrame constructor', {

	'should return a new IFrame': function(){
		var iFrame1 = document.createElement('iframe');
		var iFrame2 = new IFrame();
		expect(iFrame1.tagName).toEqual(iFrame2.tagName);
	},

	'should return the same IFrame if passed': function(){
		var iFrame1 = document.createElement('iframe');
		var iFrame2 = new IFrame(iFrame1);
		expect(iFrame1).toEqual(iFrame2);
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

	'should return an extended Element by string id': function(){
		var dollar1 = document.getElementById('dollar');
		var dollar2 = $('dollar');

		expect(dollar1).toEqual(dollar2);
		expect($defined(dollar1.addEvent)).toBeTruthy();
	},

	'should return the window if passed': function(){
		var win = $(window);
		expect(win == window).toBeTruthy();
	},

	'should return the document if passed': function(){
		expect($(document)).toEqual(document);
	},

	'should return null if string not found or type mismatch': function(){
		expect($(1)).toBeNull();
		expect($('nonexistant')).toBeNull();
	}

});

describe('$$', {

	'should return all Elements of a specific tag': function(){
		var divs1 = $$('div');
		var divs2 = new Elements($A(document.getElementsByTagName('div')));
		expect(divs1).toEqual(divs2);
	},

	'should return multiple Elements for each specific tag': function(){
		var uidOf = (typeof $uid != 'undefined') ? $uid : Slick.uidOf;
		var sortBy = function(a, b){
			a = uidOf(a); b = uidOf(b);
			return a > b ? 1 : -1;
		};
		var headers1 = $$('h3', 'h4').sort(sortBy);
		var headers2 = new Elements(Array.flatten([document.getElementsByTagName('h3'), document.getElementsByTagName('h4')])).sort(sortBy);
		expect(headers1).toEqual(headers2);
	},

	'should return an empty array if not is found': function(){
		expect($$('not_found')).toEqual(new Elements([]));
	}

});

describe('getDocument', {

	'should return the owner document for elements': function(){
		var doc = document.newElement('div').getDocument();
		expect(doc).toEqual(document);
	},

	'should return the owned document for window': function(){
		var doc = window.getDocument();
		expect(doc).toEqual(document);
	},

	'should return self for document': function(){
		var doc = document.getDocument();
		expect(doc).toEqual(document);
	}

});

describe('getWindow', {

	'should return the owner window for elements': function(){
		var win = document.newElement('div').getWindow();
		expect(win == window).toBeTruthy();
	},

	'should return the owner window for document': function(){
		var win = document.getWindow();
		expect(win == window).toBeTruthy();
	},

	'should return self for window': function(){
		var win = window.getWindow();
		expect(win == window).toBeTruthy();
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
		expect(child.id).toEqual('first');
		expect(Container.getElement('iframe')).toBeNull();
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
		expect(children.length).toEqual(2);
	},

	'should return all the elements that match the tags': function(){
		var children = Container.getElements('div,a');
		expect(children.length).toEqual(3);
		expect(children[2].tagName.toLowerCase()).toEqual('a');
	}

});

describe('Document.getElement', {

	'should return the first Element to match the tag, otherwise null': function(){
		var div = document.getElement('div');
		var ndiv = document.getElementsByTagName('div')[0];
		expect(div).toEqual(ndiv);

		var notfound = document.getElement('canvas');
		expect(notfound).toBeNull();
	}

});

describe('Document.getElements', {

	'should return all the elements that match the tag': function(){
		var divs = document.getElements('div');
		var ndivs = new Elements(document.getElementsByTagName('div'));
		expect(divs).toEqual(ndivs);
	},

	'should return all the elements that match the tags': function(){
		var headers = document.getElements('h3,h4');
		var headers2 = new Elements(Array.flatten([document.getElementsByTagName('h3'), document.getElementsByTagName('h4')]));
		expect(headers.length).toEqual(headers2.length);
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

	'should getElementById that matches the id, otherwise null': function(){
		expect(Container.getElementById('first')).toEqual(Container.childNodes[0]);
		expect(Container.getElementById('not_found')).toBeNull();
	}

});

describe('Element.get style', {

	"should return a CSS string representing the Element's styles": function(){
		var style = 'font-size:12px;color:rgb(255,255,255)';
		var myElement = new Element('div').set('style', style);
		expect(myElement.get('style').toLowerCase().replace(/\s/g, '').replace(/;$/, '')).toMatch(/(font-size:12px;color:rgb\(255,255,255\))|(color:rgb\(255,255,255\);font-size:12px)/);
		//I'm replacing these characters (space and the last semicolon) as they are not vital to the style, and browsers sometimes include them, sometimes not.
	}

});

describe('Element.get tag', {

	"should return the Element's tag": function(){
		var myElement = new Element('div');
		expect(myElement.get('tag')).toEqual('div');
	}

});

describe('Element.get', {

	"should get an absolute href": function(){
		var link = new Element('a', {href: "http://google.com/"});
		expect(link.get('href')).toEqual("http://google.com/");
	},

	"should get an absolute href to the same domain": function(){
		var link = new Element('a', {href: window.location.href});
		expect(link.get('href')).toEqual(window.location.href);
	},

	"should get a relative href": function(){
		var link = new Element('a', {href: "../index.html"});
		expect(link.get('href')).toEqual("../index.html");
	},

	"should get a host absolute href": function(){
		var link = new Element('a', {href: "/developers"});
		expect(link.get('href')).toEqual("/developers");
	},

	"should return null when attribute is missing": function(){
		var link = new Element('a');
		expect(link.get('href')).toBeNull();
	}

});

describe('Element.erase', {

	"should erase an Element's property": function(){
		var myElement = new Element('a', {href: 'http://mootools.net/', title: 'mootools!'});
		expect(myElement.get('title')).toEqual('mootools!');
		expect(myElement.erase('title').get('title')).toBeNull();
	},

	"should erase an Element's style": function(){
		var myElement = new Element('div', {style: "color:rgb(255, 255, 255); font-size:12px;"});
		myElement.erase('style');
		expect(myElement.get('style')).toEqual('');
	}

});

describe('Element.match', {

	'should return true if tag is not provided': function(){
		var element = new Element('div');
		expect(element.match()).toBeTruthy();
	},

	"should return true if the Element's tag matches": function(){
		var element = new Element('div');
		expect(element.match('div')).toBeTruthy();
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

	'should inject the Element before an Element': function(){
		test.inject($('first'), 'before');
		expect(Container.childNodes[0]).toEqual(test);

		test.inject($('second-child'), 'before');
		expect(Container.childNodes[1].childNodes[1]).toEqual(test);
	},

	'should inject the Element after an Element': function(){
		test.inject($('first'), 'after');
		expect(Container.childNodes[1]).toEqual(test);

		test.inject($('first-child'), 'after');
		expect(Container.childNodes[1].childNodes[1]).toEqual(test);
	},

	'should inject the Element at bottom of an Element': function(){
		var first = $('first');
		test.inject(first, 'bottom');
		expect(first.childNodes[0]).toEqual(test);

		var second = $('second');
		test.inject(second, 'bottom');
		expect(second.childNodes[2]).toEqual(test);

		test.inject(Container, 'bottom');
		expect(Container.childNodes[2]).toEqual(test);
	},

	'should inject the Element inside an Element': function(){
		var first = $('first');
		test.inject(first, 'inside');
		expect(first.childNodes[0]).toEqual(test);

		var second = $('second');
		test.inject(second, 'inside');
		expect(second.childNodes[2]).toEqual(test);

		test.inject(Container, 'inside');
		expect(Container.childNodes[2]).toEqual(test);
	},

	'should inject the Element at the top of an Element': function(){
		test.inject(Container, 'top');
		expect(Container.childNodes[0]).toEqual(test);

		var second = $('second');
		test.inject(second, 'top');
		expect(second.childNodes[0]).toEqual(test);
	},

	'should inject the Element in an Element': function(){
		var first = $('first');
		test.inject(first);
		expect(first.childNodes[0]).toEqual(test);

		var second = $('second');
		test.inject(second);
		expect(second.childNodes[2]).toEqual(test);

		test.inject(Container);
		expect(Container.childNodes[2]).toEqual(test);
	}

});

describe('Element.replaces', {

	'should replace an Element with the Element': function(){
		var parent = new Element('div');
		var div = new Element('div', {id: 'original'}).inject(parent);
		var el = new Element('div', {id: 'replaced'});
		el.replaces(div);
		expect(parent.childNodes[0]).toEqual(el);
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

	'should grab the Element before this Element': function(){
		$('first').grab(test, 'before');
		expect(Container.childNodes[0]).toEqual(test);

		$('second-child').grab(test, 'before');
		expect(Container.childNodes[1].childNodes[1]).toEqual(test);
	},

	'should grab the Element after this Element': function(){
		$('first').grab(test, 'after');
		expect(Container.childNodes[1]).toEqual(test);

		$('first-child').grab(test, 'after');
		expect(Container.childNodes[1].childNodes[1]).toEqual(test);
	},

	'should grab the Element at the bottom of this Element': function(){
		var first = $('first');
		first.grab(test, 'bottom');
		expect(first.childNodes[0]).toEqual(test);

		var second = $('second');
		second.grab(test, 'bottom');
		expect(second.childNodes[2]).toEqual(test);

		Container.grab(test, 'bottom');
		expect(Container.childNodes[2]).toEqual(test);
	},

	'should grab the Element inside this Element': function(){
		var first = $('first');
		first.grab(test, 'inside');
		expect(first.childNodes[0]).toEqual(test);

		var second = $('second');
		second.grab(test, 'inside');
		expect(second.childNodes[2]).toEqual(test);

		Container.grab(test, 'inside');
		expect(Container.childNodes[2]).toEqual(test);
	},

	'should grab the Element at the top of this Element': function(){
		Container.grab(test, 'top');
		expect(Container.childNodes[0]).toEqual(test);

		var second = $('second');
		second.grab(test, 'top');
		expect(second.childNodes[0]).toEqual(test);
	},

	'should grab an Element in the Element': function(){
		var first = $('first').grab(test);
		expect(first.childNodes[0]).toEqual(test);

		var second = $('second').grab(test);
		expect(second.childNodes[2]).toEqual(test);

		Container.grab(test);
		expect(Container.childNodes[2]).toEqual(test);
	}

});

describe('Element.wraps', {

	'should replace and adopt the Element': function(){
		var div = new Element('div');
		var child = new Element('p').inject(div);

		var wrapper = new Element('div', {id: 'wrapper'}).wraps(div.childNodes[0]);
		expect(div.childNodes[0]).toEqual(wrapper);
		expect(wrapper.childNodes[0]).toEqual(child);
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
		expect(Container.childNodes[0].nodeValue).toEqual('test');

		$('second-child').appendText('test', 'before');
		expect(Container.childNodes[2].childNodes[1].nodeValue).toEqual('test');
	},

	'should append a TextNode the Element after this Element': function(){
		$('first').appendText('test', 'after');
		expect(Container.childNodes[1].nodeValue).toEqual('test');

		$('first-child').appendText('test', 'after');
		expect(Container.childNodes[2].childNodes[1].nodeValue).toEqual('test');
	},

	'should append a TextNode the Element at the bottom of this Element': function(){
		var first = $('first');
		first.appendText('test', 'bottom');
		expect(first.childNodes[0].nodeValue).toEqual('test');

		var second = $('second');
		second.appendText('test', 'bottom');
		expect(second.childNodes[2].nodeValue).toEqual('test');

		Container.appendText('test', 'bottom');
		expect(Container.childNodes[2].nodeValue).toEqual('test');
	},

	'should append a TextNode the Element inside this Element': function(){
		var first = $('first');
		first.appendText('test', 'inside');
		expect(first.childNodes[0].nodeValue).toEqual('test');

		var second = $('second');
		second.appendText('test', 'inside');
		expect(second.childNodes[2].nodeValue).toEqual('test');

		Container.appendText('test', 'inside');
		expect(Container.childNodes[2].nodeValue).toEqual('test');
	},

	'should append a TextNode the Element at the top of this Element': function(){
		Container.appendText('test', 'top');
		expect(Container.childNodes[0].nodeValue).toEqual('test');

		var second = $('second');
		second.appendText('test', 'top');
		expect(second.childNodes[0].nodeValue).toEqual('test');
	},

	'should append a TextNode an Element in the Element': function(){
		var first = $('first').appendText('test');
		expect(first.childNodes[0].nodeValue).toEqual('test');

		var second = $('second').appendText('test');
		expect(second.childNodes[2].nodeValue).toEqual('test');

		Container.appendText('test');
		expect(Container.childNodes[2].nodeValue).toEqual('test');
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

	'should adopt an Element by its id': function(){
		var child = new Element('div', {id: 'adopt-me'});
		document.body.appendChild(child);
		Container.adopt('adopt-me');
		expect(Container.childNodes[0]).toEqual(child);
	},

	'should adopt an Element': function(){
		var child = new Element('p');
		Container.adopt(child);
		expect(Container.childNodes[0]).toEqual(child);
	},

	'should adopt any number of Elements or ids': function(){
		var children = [];
		(100).times(function(i){ children[i] = new Element('span', {id: 'child-' + i}); });
		Container.adopt(children);
		expect(Container.childNodes.length).toEqual(100);
		expect(Container.childNodes[10]).toEqual(children[10]);
	}

});

describe('Element.dispose', {

	'before all': function(){
		Container = new Element('div').inject(document.body);
	},

	'after all': function(){
		document.body.removeChild(Container);
		Container.set('html', '');
		Container = null;
	},

	'should dispose the Element from the DOM': function(){
		var child = new Element('div').inject(Container);
		child.dispose();
		expect(Container.childNodes.length).toEqual(0);
	}

});

describe('Element.clone', {

	'before all': function(){
		Container = new Element('div', {'id': 'outer', 'class': 'moo'});
		Container.innerHTML = '<span class="foo" id="inner1"><div class="movie" id="sixfeet">under</div></span><span id="inner2"></span>';
	},

	'after all': function(){
		Container = null;
	},

	'should return a clone': function(){
		var div = new Element('div');
		var clone = div.clone();
		expect(div).not.toEqual(clone);
		expect($type(div)).toEqual('element');
		expect($type(clone)).toEqual('element');
	},

	'should remove id from clone and clone children by default': function(){
		var clone = Container.clone();
		expect(clone.getElementsByTagName('*').length).toEqual(3);
		expect(clone.className).toEqual('moo');
		expect(clone.id).toEqual('');
		expect(Container.id).toEqual('outer');
	},

	'should remove all ids': function(){
		var clone = Container.clone(true);
		expect(clone.id).toEqual('');
		expect(clone.childNodes.length).toEqual(2);
		expect(clone.childNodes[0].id).toEqual('');
		expect(clone.childNodes[0].childNodes[0].id).toEqual('');
		expect(clone.childNodes[0].className).toEqual('foo');
	},

	'should keep id if specified': function(){
		var clone = Container.clone(true, true);
		expect(clone.id).toEqual('outer');
		expect(clone.childNodes.length).toEqual(2);
		expect(clone.childNodes[0].id).toEqual('inner1');
		expect(clone.childNodes[0].childNodes[0].id).toEqual('sixfeet');
		expect(clone.childNodes[0].className).toEqual('foo');
	},

	'should clone empty href attribute': function(){
		var clone = new Element('div', {
			html: '<a href="">empty anchor</a>'
		}).getFirst().clone();

		expect(clone.getAttribute('href', 2)).toEqual('');
	},

	'should not clone Element Storage': function(){
		Container.store('drink', 'milk');
		var clone = Container.clone();
		expect(clone.retrieve('drink')).toBeNull();
		expect(Container.retrieve('drink')).toEqual('milk');
	},

	'should clone child nodes and not copy their uid': function(){
		var cloned = Container.clone(true).getElements('*');
		var old = Container.getElements('*');
		expect(cloned.length).toEqual(3);
		expect(old.length).toEqual(3);
		expect($$(old, cloned).length).toEqual(6);
	},

	'should clone a text input and retain value': function(){
		var inputs = new Element('div', { 'html': '' +
			'<input id="input1" type="text" value="Some Value" />' +
			'<input id="input2" type="text" />'
		}).getChildren();

		var input1 = inputs[0].clone();
		var input2 = inputs[1].clone(false, true);

		expect(!input1.id).toBeTruthy();
		expect(input2.id).toEqual('input2');
		expect(input1.value).toEqual('Some Value');
		expect(input2.value).toEqual('');
	},

	'should clone a textarea and retain value': function(){
		var textareas = new Element('div', { 'html': '' +
			'<textarea id="textarea1"></textarea>' +
			'<textarea id="textarea2">Some-Text-Here</textarea>'
		}).getChildren();

		var textarea1 = textareas[0].clone();
		var textarea2 = textareas[1].clone(false, true);

		expect(!textarea1.id).toBeTruthy();
		expect(textarea2.id).toEqual('textarea2');
		expect(textarea1.value).toEqual('');
		expect(textarea2.value).toEqual('Some-Text-Here');
	},

	'should clone a checkbox and retain checked state': function(){
		var checks = new Element('div', { 'html': '' +
			'<input id="check1" type="checkbox" />' +
			'<input id="check2" type="checkbox" checked="checked" />'
		}).getChildren();

		var check1 = checks[0].clone();
		var check2 = checks[1].clone(false, true);

		expect(!check1.id).toBeTruthy();
		expect(check2.id).toEqual('check2');
		expect(check1.checked).toBeFalsy();
		expect(check2.checked).toBeTruthy();
	},

	'should clone a select and retain selected state': function(){
		var selects = new Element('div', { 'html': '' +
			'<select name="select" id="select1">' +
				'<option>--</option>' +
				'<option value="volvo">Volvo</option>' +
				'<option value="saab">Saab</option>' +
				'<option value="opel" selected="selected">Opel</option>' +
				'<option value="bmw">BMW</option>' +
			'</select>' +
			'<select name="select[]" id="select2" multiple="multiple">' +
				'<option>--</option>' +
				'<option value="volvo">Volvo</option>' +
				'<option value="saab">Saab</option>' +
				'<option value="opel" selected="selected">Opel</option>' +
				'<option value="bmw" selected="selected">BMW</option>' +
			'</select>'
		}).getChildren();

		var select1 = selects[0].clone(true);
		var select2 = selects[1].clone(true, true);

		expect(!select1.id).toBeTruthy();
		expect(select2.id).toEqual('select2');
		expect(select1.selectedIndex).toEqual(3);
		expect(select2.options[3].selected).toBeTruthy();
		expect(select2.options[4].selected).toBeTruthy();
	},

	'should clone custom attributes': function(){
		var div = new Element('div');
		div.setAttribute('foo', 'FOO');

		expect(div.clone().getAttribute('foo')).toEqual('FOO');
	}

});

describe('Element className methods', {

	'should return true if the Element has the given class': function(){
		var div = new Element('div', {'class': 'header bold'});
		expect(div.hasClass('header')).toBeTruthy();
		expect(div.hasClass('bold')).toBeTruthy();
		expect(div.hasClass('random')).toBeFalsy();
	},

	'should add the class to the Element': function(){
		var div = new Element('div');
		div.addClass('myclass');
		expect(div.hasClass('myclass')).toBeTruthy();
	},

	'should append classes to the Element': function(){
		var div = new Element('div', {'class': 'myclass'});
		div.addClass('aclass');
		expect(div.hasClass('aclass')).toBeTruthy();
	},

	'should remove the class in the Element': function(){
		var div = new Element('div', {'class': 'myclass'});
		div.removeClass('myclass');
		expect(div.hasClass('myclass')).toBeFalsy();
	},

	'should only remove the specific class': function(){
		var div = new Element('div', {'class': 'myclass aclass'});
		div.removeClass('myclass');
		expect(div.hasClass('myclass')).toBeFalsy();
	},

	'should not remove any class if the class is not found': function(){
		var div = new Element('div', {'class': 'myclass'});
		div.removeClass('extra');
		expect(div.hasClass('myclass')).toBeTruthy();
	},

	'should add the class if the Element does not have the class': function(){
		var div = new Element('div');
		div.toggleClass('myclass');
		expect(div.hasClass('myclass')).toBeTruthy();
	},

	'should remove the class if the Element does have the class': function(){
		var div = new Element('div', {'class': 'myclass'});
		div.toggleClass('myclass');
		expect(div.hasClass('myclass')).toBeFalsy();
	}

});

describe('Element.empty', {

	'should remove all children': function(){
		var children = [];
		(5).times(function(i){ children[i] = new Element('p'); });
		var div = new Element('div').adopt(children);
		div.empty();
		expect(div.get('html')).toEqual('');
	}

});

describe('Element.destroy', {

	'should obliterate the Element from the universe': function(){
		var div = new Element('div', {id: 'destroy-test'}).inject(document.body);
		var result = div.destroy();
		expect(result).toBeNull();
		expect($('destroy-test')).toBeNull();
	}

});

describe('Element.toQueryString', {

	'should return an empty string for an Element that does not have form Elements': function(){
		var div = new Element('div');
		expect(div.toQueryString()).toEqual('');
	},

	'should ignore any form Elements that do not have a name, disabled, or whose value is false': function(){
		var form = new Element('form').adopt(
			new Element('input', { name: 'input', disabled: true, type: 'checkbox', checked: true, value: 'checked' }),
			new Element('select').adopt(
				new Element('option', { name: 'volvo', value: false, html: 'Volvo' }),
				new Element('option', { value: 'saab', html: 'Saab', selected: true })
			),
			new Element('textarea', { name: 'textarea', disabled: true, value: 'textarea-value' })
		);
		expect(form.toQueryString()).toEqual('');
	},

	"should return a query string containing even empty values, multiple select may have no selected options": function() {
		var form = new Element('form',{'html':
			'<input type="checkbox" name="input" value="" checked="checked" />' +
			'<select name="select[]" multiple="multiple" size="5">' +
				'<option name="none" value="">--</option>' +
				'<option name="volvo" value="volvo">Volvo</option>' +
				'<option name="saab" value="saab">Saab</option>' +
				'<option name="opel" value="opel">Opel</option>' +
				'<option name="bmw" value="bmw">BMW</option>' +
			'</select>' +
			'<textarea name="textarea"></textarea>'
		});
		expect(form.toQueryString()).toEqual('input=&textarea=');
	},

	"should return a query string ignoring submit, reset and file form Elements": function(){
		var form = new Element('form', { 'html': '' +
			'<input type="checkbox" name="input" value="checked" checked="checked" />' +
			'<input type="file" name="file" />' +
			'<textarea name="textarea">textarea-value</textarea>' +
			'<input type="submit" name="go" value="Go" />' +
			'<input type="reset" name="cancel" value="Reset" />'
		});
		expect(form.toQueryString()).toEqual('input=checked&textarea=textarea-value');
	}

});

describe('Element.getProperty', {

	'should getProperty from an Element': function(){
		var anchor1 = new Element('a');
		anchor1.href = 'http://mootools.net';
		expect(anchor1.getProperty('href')).toEqual('http://mootools.net');

		var anchor2 = new Element('a');
		anchor2.href = '#someLink';
		expect(anchor2.getProperty('href')).toEqual('#someLink');
	},

	'should getProperty type of an input Element': function(){
		var input1 = new Element('input', {type: 'text'});
		expect(input1.getProperty('type')).toEqual('text');

		var input2 = new Element('input', {type: 'checkbox'});
		expect(input2.getProperty('type')).toEqual('checkbox');

		var div = new Element('div', {'html':
			'<select name="test" id="test" multiple="multiple">' +
				'<option value="1">option-value</option>' +
			'</select>'
		});
		var input3 = div.getElement('select');
		expect(input3.getProperty('type')).toEqual('select-multiple');
		expect(input3.getProperty('name')).toEqual('test');
	},

	'should getPropety checked from an input Element': function(){
		var checked1 = new Element('input', { type: 'checkbox' });
		checked1.checked = 'checked';
		expect(checked1.getProperty('checked')).toBeTruthy();

		var checked2 = new Element('input', { type: 'checkbox' });
		checked2.checked = true;
		expect(checked2.getProperty('checked')).toBeTruthy();

		var checked3 = new Element('input', { type: 'checkbox' });
		checked3.checked = false;
		expect(checked3.getProperty('checked')).toBeFalsy();
	},

	'should getProperty disabled from an input Element': function(){
		var disabled1 = new Element('input', { type: 'text' });
		disabled1.disabled = 'disabled';
		expect(disabled1.getProperty('disabled')).toBeTruthy();

		var disabled2 = new Element('input', { type: 'text' });
		disabled2.disabled = true;
		expect(disabled2.getProperty('disabled')).toBeTruthy();

		var disabled3 = new Element('input', { type: 'text' });
		disabled3.disabled = false;
		expect(disabled3.getProperty('disabled')).toBeFalsy();
	},

	'should getProperty readonly from an input Element': function(){
		var readonly1 = new Element('input', { type: 'text' });
		readonly1.readOnly = 'readonly';
		expect(readonly1.getProperty('readonly')).toBeTruthy();

		var readonly2 = new Element('input', { type: 'text' });
		readonly2.readOnly = true;
		expect(readonly2.getProperty('readonly')).toBeTruthy();

		var readonly3 = new Element('input', { type: 'text' });
		readonly3.readOnly = false;
		expect(readonly3.getProperty('readonly')).toBeFalsy();
	}

});

describe('Element.setProperty', {

	'should setProperty from an Element': function(){
		var anchor1 = new Element('a').setProperty('href', 'http://mootools.net/');
		expect(anchor1.getProperty('href')).toEqual('http://mootools.net/');

		var anchor2 = new Element('a').setProperty('href', '#someLink');
		expect(anchor2.getProperty('href')).toEqual('#someLink');
	},

	'should setProperty type of an input Element': function(){
		var input1 = new Element('input').setProperty('type', 'text');
		expect(input1.getProperty('type')).toEqual('text');

		var input2 = new Element('input').setProperty('type', 'checkbox');
		expect(input2.getProperty('type')).toEqual('checkbox');
	},

	'should setProperty checked from an input Element': function(){
		var checked1 = new Element('input', { type: 'checkbox' }).setProperty('checked', 'checked');
		expect(checked1.getProperty('checked')).toBeTruthy();

		var checked2 = new Element('input', { type: 'checkbox' }).setProperty('checked', true);
		expect(checked2.getProperty('checked')).toBeTruthy();

		var checked3 = new Element('input', { type: 'checkbox' }).setProperty('checked', false);
		expect(checked3.getProperty('checked')).toBeFalsy();
	},

	'should setProperty disabled of an input Element': function(){
		var disabled1 = new Element('input', { type: 'text' }).setProperty('disabled', 'disabled');
		expect(disabled1.getProperty('disabled')).toBeTruthy();

		var disabled2 = new Element('input', { type: 'text' }).setProperty('disabled', true);
		expect(disabled2.getProperty('disabled')).toBeTruthy();

		var disabled3 = new Element('input', { type: 'text' }).setProperty('disabled', false);
		expect(disabled3.getProperty('disabled')).toBeFalsy();
	},

	'should setProperty readonly of an input Element': function(){
		var readonly1 = new Element('input', { type: 'text' }).setProperty('readonly', 'readonly');
		expect(readonly1.getProperty('readonly')).toBeTruthy();

		var readonly2 = new Element('input', { type: 'text' }).setProperty('readonly', true);
		expect(readonly2.getProperty('readonly')).toBeTruthy();

		var readonly3 = new Element('input', { type: 'text' }).setProperty('readonly', false);
		expect(readonly3.getProperty('readonly')).toBeFalsy();
	},

	'should setProperty defaultValue of an input Element': function(){
		var form = new Element('form');
		var defaultValue = new Element('input', {'type': 'text', 'value': '321'});
		expect(defaultValue.getProperty('value')).toEqual('321');
		defaultValue.setProperty('defaultValue', '123');
		form.grab(defaultValue);
		form.reset();
		expect(defaultValue.getProperty('value')).toEqual('123');
	}

});

describe('Element.getProperties', {

	'should return an object associate with the properties passed': function(){
		var readonly = new Element('input', { type: 'text', readonly: 'readonly' });
		var props = readonly.getProperties('type', 'readonly');
		expect(props).toEqual({ type: 'text', readonly: true });
	}

});

describe('Element.setProperties', {

	'should set each property to the Element': function(){
		var readonly = new Element('input').setProperties({ type: 'text', readonly: 'readonly' });
		var props = readonly.getProperties('type', 'readonly');
		expect(props).toEqual({ type: 'text', readonly: true });
	}

});

describe('Element.removeProperties', {

	'should remove each property from the Element': function(){
		var anchor = new Element('a', {href: '#', title: 'title', rel: 'left'});
		anchor.removeProperties('title', 'rel');
		expect(anchor.getProperties('href', 'title', 'rel')).toEqual({ href: '#', title: null, rel: null });
	}

});

describe('Element.getPrevious', {

	'should return the previous Element, otherwise null': function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('div'), new Element('div')];
		container.adopt(children);
		expect(children[1].getPrevious()).toEqual(children[0]);
		expect(children[0].getPrevious()).toBeNull();
	},

	'should return the previous Element that matches, otherwise null': function(){
		var container = new Element('div');
		var children = [new Element('a'), new Element('div'), new Element('div'), new Element('div')];
		container.adopt(children);
		expect(children[1].getPrevious('a')).toEqual(children[0]);
		expect(children[1].getPrevious('span')).toBeNull();
	}

});

describe('Element.getAllPrevious', {

	'should return all the previous Elements, otherwise an empty array': function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('div'), new Element('div')];
		container.adopt(children);
		expect(children[2].getAllPrevious()).toEqual(new Elements([children[1], children[0]]));
		expect(children[0].getAllPrevious()).toEqual(new Elements([]));
	},

	'should return all the previous Elements that match, otherwise an empty array': function(){
		var container = new Element('div');
		var children = [new Element('a'), new Element('div'), new Element('a'), new Element('div')];
		container.adopt(children);
		expect(children[3].getAllPrevious('a')).toEqual(new Elements([children[2], children[0]]));
		expect(children[1].getAllPrevious('span')).toEqual(new Elements([]));
	}

});

describe('Element.getNext', {

	'should return the next Element, otherwise null': function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('div'), new Element('div')];
		container.adopt(children);
		expect(children[1].getNext()).toEqual(children[2]);
		expect(children[2].getNext()).toBeNull();
	},

	'should return the previous Element that matches, otherwise null': function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('div'), new Element('div'), new Element('a')];
		container.adopt(children);
		expect(children[1].getNext('a')).toEqual(children[3]);
		expect(children[1].getNext('span')).toBeNull();
	}

});

describe('Element.getAllNext', {

	'should return all the next Elements, otherwise an empty array': function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('div'), new Element('div')];
		container.adopt(children);
		expect(children[0].getAllNext()).toEqual(new Elements(children.slice(1)));
		expect(children[2].getAllNext()).toEqual(new Elements([]));
	},

	'should return all the next Elements that match, otherwise an empty array': function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('a'), new Element('div'), new Element('a')];
		container.adopt(children);
		expect(children[0].getAllNext('a')).toEqual(new Elements([children[1], children[3]]));
		expect(children[0].getAllNext('span')).toEqual(new Elements([]));
	}

});

describe('Element.getFirst', {

	'should return the first Element in the Element, otherwise null': function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('a'), new Element('div')];
		container.adopt(children);
		expect(container.getFirst()).toEqual(children[0]);
		expect(children[0].getFirst()).toBeNull();
	}

});

describe('Element.getLast', {

	'should return the last Element in the Element, otherwise null': function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('a'), new Element('div')];
		container.adopt(children);
		expect(container.getLast()).toEqual(children[2]);
		expect(children[0].getLast()).toBeNull();
	},

	'should return the last Element in the Element that matches, otherwise null': function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('a'), new Element('div'), new Element('a')];
		container.adopt(children);
		expect(container.getLast('a')).toEqual(children[3]);
		expect(container.getLast('span')).toBeNull();
	}

});

describe('Element.getParent', {

	'should return the parent of the Element, otherwise null': function(){
		var container = new Element('p');
		var children = [new Element('div'), new Element('div'), new Element('div')];
		container.adopt(children);
		expect(children[1].getParent()).toEqual(container);
		expect(container.getParent()).toBeNull();
	},

	'should return the parent of the Element that matches, otherwise null': function(){
		var container = new Element('p');
		var children = [new Element('div'), new Element('div'), new Element('div')];
		container.adopt(new Element('div').adopt(children));
		expect(children[1].getParent('p')).toEqual(container);
		expect(children[1].getParent('table')).toBeNull();
	}

});

describe('Element.getParents', {

	'should return the parents of the Element, otherwise returns an empty array': function(){
		var container = new Element('p');
		var children = [new Element('div'), new Element('div'), new Element('div')];
		container.adopt(new Element('div').adopt(new Element('div').adopt(children)));
		expect(children[1].getParents()).toEqual(new Elements([container.getFirst().getFirst(), container.getFirst(), container]));
		expect(container.getParents()).toEqual(new Elements([]));
	},

	'should return the parents of the Element that match, otherwise returns an empty array': function(){
		var container = new Element('p');
		var children = [new Element('div'), new Element('div'), new Element('div')];
		container.adopt(new Element('div').adopt(new Element('div').adopt(children)));
		expect(children[1].getParents('div')).toEqual(new Elements([container.getFirst().getFirst(), container.getFirst()]));
		expect(children[1].getParents('table')).toEqual(new Elements([]));
	}

});

describe('Element.getChildren', {

	"should return the Element's children, otherwise returns an empty array": function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('div'), new Element('div')];
		container.adopt(children);
		expect(container.getChildren()).toEqual(new Elements(children));
		expect(children[0].getChildren()).toEqual(new Elements([]));
	},

	"should return the Element's children that match, otherwise returns an empty array": function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('a'), new Element('a')];
		container.adopt(children);
		expect(container.getChildren('a')).toEqual(new Elements([children[1], children[2]]));
		expect(container.getChildren('span')).toEqual(new Elements([]));
	}

});

describe('Element.hasChild', {

	"before all": function(){
		window.Local = {};
		Local.container = new Element('div');
		Local.children = [new Element('div'), new Element('div'), new Element('div')];
		Local.container.adopt(Local.children);
		Local.grandchild = new Element('div').inject(Local.children[1]);
	},

	"after all": function(){
		Local = null;
	},

	"should return true if the Element is a child or grandchild": function(){
		expect(Local.container.hasChild(Local.children[0])).toBeTruthy();
		expect(Local.container.hasChild(Local.children[2])).toBeTruthy();
		expect(Local.container.hasChild(Local.grandchild)).toBeTruthy();
	},

	"should return false if it's the Element itself": function(){
		expect(Local.container.hasChild(Local.container)).toBeFalsy();
	},

	"should return false if the Element is the parent or a sibling": function(){
		expect(Local.children[2].hasChild(Local.container)).toBeFalsy();
		expect(Local.children[2].hasChild(Local.children[1])).toBeFalsy();
	}

});

describe('Elements.extend', function(){

	it('should be able to extend a collection', function(){
		var items = [
			new Element('span'),
			new Element('span'),
			new Element('p'),
			new Element('p')
		];
		var container = new Element('div').adopt(items);

		container.getElements('span').extend(container.getElements('p'));
		expect($$(items)).toEqual(container.getElements('*'));
		expect(items.length).toEqual(4);
	});


});
