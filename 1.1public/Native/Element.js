/*
Script: Element.js
	Specs for Element.js

License:
	MIT-style license.
*/

describe('Element constructor', {

	"should return an Element with the correct tag": function(){
		var element = new Element('div');
		value_of($type(element)).should_be('element');
		value_of($defined(element.addEvent)).should_be_true();
		value_of(element.tagName.toLowerCase()).should_be('div');
	},

	'should return an Element with various attributes': function(){
		var element = new Element('div', { 'id': 'divID', 'title': 'divTitle' });
		value_of(element.id).should_be('divID');
		value_of(element.title).should_be('divTitle');
	},

	'should return an Element with for attribute': function(){
		var label = new Element('label', { 'for': 'myId' });
		value_of(label.htmlFor).should_be('myId');
	},

	'should return an Element with class attribute': function(){
		var div1 = new Element('div', { 'class': 'class' });
		var div2 = new Element('div', { 'class': 'class1 class2 class3' });

		value_of(div1.className).should_be('class');
		value_of(div2.className).should_be('class1 class2 class3');
	},

	'should return input Elements with name and type attributes': function(){
		var username = new Element('input', { type: 'text', name: 'username', value: 'username' });
		var password = new Element('input', { type: 'password', name: 'password', value: 'password' });

		value_of(username.type).should_be('text');
		value_of(username.name).should_be('username');
		value_of(username.value).should_be('username');

		value_of(password.type).should_be('password');
		value_of(password.name).should_be('password');
		value_of(password.value).should_be('password');
	},

	'should return input Elements that are checked': function(){
		var check1 = new Element('input', { type: 'checkbox' });
		var check2 = new Element('input', { type: 'checkbox', checked: true });
		var check3 = new Element('input', { type: 'checkbox', checked: 'checked' });

		value_of(check1.checked).should_be_false();
		value_of(check2.checked).should_be_true();
		value_of(check2.checked).should_be_true();
	},

	"should return a select Element that retains it's selected options": function(){
		var div = new Element('div').setHTML(
			'<select multiple="multiple" name="select[]">' +
				'<option value="" name="none">--</option>' +
				'<option value="volvo" name="volvo">Volvo</option>' +
				'<option value="saab" name="saab" selected="selected">Saab</option>' +
				'<option value="opel" name="opel" selected="selected">Opel</option>' +
				'<option value="bmw" name="bmw">BMW</option>' +
			'</select>'
		);

		var select1 = div.getFirst();
		var select2 = new Element('select', { name: 'select[]', multiple: true }).adopt(
			new Element('option', { name: 'none', value: '', html: '--' }),
			new Element('option', { name: 'volvo', value: 'volvo', html: 'Volvo' }),
			new Element('option', { name: 'saab', value: 'saab', html: 'Saab', selected: true }),
			new Element('option', { name: 'opel', value: 'opel', html: 'Opel', selected: 'selected' }),
			new Element('option', { name: 'bmw', value: 'bmw', html: 'BMW' })
		);

		value_of(select1.multiple).should_be_true();
		value_of(select2.multiple).should_be_true();

		value_of(select1.name).should_be(select2.name);
		value_of(select1.options.length).should_be(select2.options.length);
		value_of(select1.toQueryString()).should_be(select2.toQueryString());
	}

});

describe('Element.set', {

	"should set a single attribute of an Element": function(){
		var div = new Element('div').set({
			properties: {
				'id': 'some_id'
			}
		});
		value_of(div.id).should_be('some_id');
	},

	"should set the checked attribute of an Element": function(){
		var input1 = new Element('input', {properties: {type: 'checkbox'}}).set({properties: {'checked': 'checked'}});
		var input2 = new Element('input', {properties: {type: 'checkbox'}}).set({properties: {'checked': true}});
		value_of(input1.checked).should_be_true();
		value_of(input2.checked).should_be_true();
	},

	"should set the class name of an element": function(){
		var div = new Element('div').set({ properties: {'class': 'some_class'}});
		value_of(div.className).should_be('some_class');
	},

	"should set the for attribute of an element": function(){
		var input = new Element('input', { properties: {type: 'text'}}).set({ properties: {'for': 'some_element'}});
		value_of(input.htmlFor).should_be('some_element');
	},

	"should set the html of an Element": function(){
		var html = '<a href="http://mootools.net/">Link</a>';
		var parent = new Element('div').setHTML(html);
		value_of(parent.innerHTML.toLowerCase()).should_be(html.toLowerCase());
	},

	"should set the html of an Element with multiple arguments": function(){
		var parent = new Element('div').setHTML('<p>Paragraph</p>', '<a href="http://mootools.net/">Link</a>');
		value_of(parent.innerHTML.toLowerCase()).should_be('<p>Paragraph</p><a href="http://mootools.net/">Link</a>'.toLowerCase());
	},

	"should set the html of a select Element": function(){
		var html = '<option>option 1</option><option selected="selected">option 2</option>';
		var select = new Element('select').setHTML(html);
		value_of(select.getChildren().length).should_be(2);
		value_of(select.options.length).should_be(2);
		value_of(select.selectedIndex).should_be(1);
	},

	"should set the html of a table Element": function(){
		var html = '<tbody><tr><td>cell 1</td><td>cell 2</td></tr><tr><td class="cell">cell 1</td><td>cell 2</td></tr></tbody>';
		var table = new Element('table').setHTML(html);
		value_of(table.getChildren().length).should_be(1);
		value_of(table.getFirst().getFirst().getChildren().length).should_be(2);
		value_of(table.getFirst().getLast().getFirst().className).should_be('cell');
	},

	"should set the html of a tbody Element": function(){
		var html = '<tr><td>cell 1</td><td>cell 2</td></tr><tr><td class="cell">cell 1</td><td>cell 2</td></tr>';
		var tbody = new Element('tbody').inject(new Element('table')).setHTML(html);
		value_of(tbody.getChildren().length).should_be(2);
		value_of(tbody.getLast().getFirst().className).should_be('cell');
	},

	"should set the html of a tr Element": function(){
		var html = '<td class="cell">cell 1</td><td>cell 2</td>';
		var tr = new Element('tr').inject(new Element('tbody').inject(new Element('table'))).setHTML(html);
		value_of(tr.getChildren().length).should_be(2);
		value_of(tr.getFirst().className).should_be('cell');
	},

	"should set the html of a td Element": function(){
		var html = '<span class="span">Some Span</span><a href="#">Some Link</a>';
		var td = new Element('td').inject(new Element('tr').inject(new Element('tbody').inject(new Element('table')))).setHTML(html);
		value_of(td.getChildren().length).should_be(2);
		value_of(td.getFirst().className).should_be('span');
	},

	"should set the style attribute of an Element": function(){
		var div = new Element('div').set({'styles': 'font-size:12px;line-height:23px;'});
		value_of(div.style.lineHeight).should_be('23px');
		value_of(div.style.fontSize).should_be('12px');
	},

	"should set multiple attributes of an Element": function(){
		var div = new Element('div').set({ properties: { id: 'some_id', 'title': 'some_title' } });
		value_of(div.id).should_be('some_id');
		value_of(div.title).should_be('some_title');
	},

	"should set various attributes of a script Element": function(){
		var script = new Element('script').set({ type: 'text/javascript', defer: 'defer' });
		value_of(script.type).should_be('text/javascript');
		value_of(script.defer).should_be_true();
	},

	"should set various attributes of a table Element": function(){
		var table1 = new Element('table').set({ border: '2', cellpadding: '3', cellspacing: '4', align: 'center' });
		var table2 = new Element('table').set({ cellPadding: '3', cellSpacing: '4' });
		value_of(table1.border).should_be(2);
		value_of(table1.cellPadding).should_be(3);
		value_of(table2.cellPadding).should_be(3);
		value_of(table1.cellSpacing).should_be(4);
		value_of(table2.cellSpacing).should_be(4);
		value_of(table1.align).should_be('center');
	}

});

var myElements = new Elements([
	new Element('div'),
	document.createElement('a'),
	new Element('div', {id: 'el-' + $time()})
]);

describe('Elements', {

	'should return an array type': function(){
		value_of($type(myElements)).should_be('array');
	},

	'should return an array of Elements': function(){
		value_of(myElements.every(function(e){
			return $type(e) == "element";
		})).should_be_true();
	},

	'should apply Element prototypes to the returned array': function(){
		value_of($defined(myElements.addEvent)).should_be_true();
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

		value_of(dollar1).should_be(dollar2);
		value_of($defined(dollar1.addEvent)).should_be_true();
	},

	'should return the window if passed': function(){
		value_of($(window)).should_be(window);
	},

	'should return the document if passed': function(){
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
		var divs2 = document.getElementsByTagName('div');
		var match = divs1.every(function(d, i){
			return d == divs2[i];
		});
		value_of(match).should_be_true();
		value_of(divs1.length).should_be(divs2.length);
	},

	'should return multiple Elements for each specific tag': function(){
		var headers1 = $$('h3', 'h4');
		var headers2 = $A(document.getElementsByTagName('h3'));
		headers2 = headers2.extend(document.getElementsByTagName('h4'));
		value_of(headers1).should_be(headers2);
	},

	'should return an empty array if not is found': function(){
		value_of($$('not_found')).should_be([]);
	}

});

(function(){
	
	var makeDivs = function(){
		var div = new Element('div');
		var div1 = new Element('div', {properties: {id: 'first'}});
		var div2 = new Element('div', {properties: {id: 'second'}});
		return {top: div, one: div1, two: div2};
	};
	
describe('injection', {
	'should inject an element before another': function(){
		var divs = makeDivs();
		divs.top.adopt(divs.two);
		divs.one.injectBefore(divs.two);
		value_of(divs.top.getChildren()).should_be([divs.one, divs.two]);

		divs = makeDivs();
		divs.top.adopt(divs.two);
		divs.one.inject(divs.two, 'before');
		value_of(divs.top.getChildren()).should_be([divs.one, divs.two]);

	},

	'should inject an element after another': function(){
		var divs = makeDivs();
		divs.top.adopt(divs.two);
		divs.one.injectAfter(divs.two);
		value_of(divs.top.getChildren()).should_be([divs.two, divs.one]);

		divs = makeDivs();
		divs.top.adopt(divs.two);
		divs.one.inject(divs.two, 'after');
		value_of(divs.top.getChildren()).should_be([divs.two, divs.one]);
	}
	
});
})();

describe('Element.set `opacity`', {

	'should set the opacity of an Element': function() {
		var el = new Element('div').setStyle('opacity', 0.4);
		if (window.ie) value_of(el.style.filter).should_be('alpha(opacity=40)');
		value_of(el.style.opacity).should_be(0.4);
	},

	'should return the opacity of an Element': function() {
		value_of(new Element('div').setStyle('opacity', 0.4).getStyle('opacity')).should_be(0.4);
	}

});

describe('Element.getStyle', {

	'should get a six digit hex code from a three digit hex code': function() {
		var el = new Element('div').setHTML('<div style="color:#00ff00"></div>');
		value_of(el.getElement('div').getStyle('color')).should_be('#00ff00');
	},

	'should getStyle a six digit hex code from an RGB value': function() {
		var el = new Element('div').setHTML('<div style="color:rgb(0, 255, 0)"></div>');
		value_of(el.getElement('div').getStyle('color')).should_be('#00ff00');
	},

	'should `getStyle` with a dash in it': function() {
		var el = new Element('div').setHTML('<div style="list-style-type:square"></div>');
		value_of(el.getElement('div').getStyle('list-style-type')).should_be('square');
	}

});

describe('Element.setStyle', {

	'should set the `styles` property on an Element using the Element constructor': function() {
		value_of(new Element('div', {styles:{'color':'#00ff00'}}).getStyle('color')).should_be('#00ff00');
	},

	'should `setStyle` on an Element': function() {
		value_of(new Element('div').setStyle('color','#00ff00').getStyle('color')).should_be('#00ff00');
	},

	'should properly `setStyle` for a property with a dash in it': function() {
		value_of(new Element('div').setStyle('list-style-type', 'square').getStyle('list-style-type')).should_be('square');
	}

});

describe('Element.getStyles', {

	'should return multiple styles': function() {
		var el = new Element('div').setHTML('<div style="color:#00ff00;list-style-type:square"></div>');
		value_of(el.getElement('div').getStyles('color', 'list-style-type')).should_be({color:'#00ff00', 'list-style-type':'square'});
	}

});

describe('Element.setStyles', {

	'should set multiple styles': function() {
		value_of(new Element('div').setStyles({'list-style-type':'square', 'color':'#00ff00'}).getStyles('list-style-type', 'color')).should_be({'list-style-type':'square', color:'#00ff00'});
	}

});