/*
Script: Element.Style.js
	Specification Examples of Element.Style.js.

License:
	MIT-style license.
*/

describe('Element.set `opacity`', {

	'should set the opacity of an Element': function() {
		var el = new Element('div').set('opacity', 0.4);
		if (document.html.style.opacity != null)
			expect(el.style.opacity == 0.4).toBeTruthy();
		else if (document.html.style.filter != null)
			expect(el.style.filter).toEqual('alpha(opacity=40)');
		else
			expect(el.getStyle('opacity')).toEqual(0.4);
	},

	'should return the opacity of an Element': function() {
		var div = new Element('div').set('opacity', 0.4);
		expect(div.get('opacity') == 0.4).toBeTruthy();
		div.set('opacity', 0);
		expect(div.get('opacity') == 0).toBeTruthy();
	}

});



describe('Element.getStyle', {

	'should get a six digit hex code from a three digit hex code': function() {
		var el = new Element('div').set('html', '<div style="color:#00ff00"></div>');
		expect(el.getElement('div').getStyle('color')).toEqual('#00ff00');
	},

	'should getStyle a six digit hex code from an RGB value': function() {
		var el = new Element('div').set('html', '<div style="color:rgb(0, 255, 0)"></div>');
		expect(el.getElement('div').getStyle('color')).toEqual('#00ff00');
	},

	'should `getStyle` with a dash in it': function() {
		var el = new Element('div').set('html', '<div style="list-style-type:square"></div>');
		expect(el.getElement('div').getStyle('list-style-type')).toEqual('square');
	},

	'should `getStyle` padding': function() {
		var el = new Element('div').set('html', '<div style="padding:20px"></div>');
		expect(el.getElement('div').getStyle('padding-left')).toEqual('20px');
	}

});

describe('Element.setStyle', {

	'should set the `styles` property on an Element using the Element constructor': function() {
		expect(new Element('div', {styles:{'color':'#00ff00'}}).getStyle('color')).toEqual('#00ff00');
	},

	'should `setStyle` on an Element': function() {
		expect(new Element('div').setStyle('color','#00ff00').getStyle('color')).toEqual('#00ff00');
	},

	'should properly `setStyle` for a property with a dash in it': function() {
		expect(new Element('div').setStyle('list-style-type', 'square').getStyle('list-style-type')).toEqual('square');
	}

});

describe('Element.getStyles', {

	'should return multiple styles': function() {
		var el = new Element('div').set('html', '<div style="color:#00ff00;list-style-type:square"></div>');
		expect(el.getElement('div').getStyles('color', 'list-style-type')).toEqual({color:'#00ff00', 'list-style-type':'square'});
	}

});

describe('Element.setStyles', {

	'should set multiple styles': function() {
		expect(new Element('div').setStyles({'list-style-type':'square', 'color':'#00ff00'}).getStyles('list-style-type', 'color')).toEqual({'list-style-type':'square', color:'#00ff00'});
	}

});
