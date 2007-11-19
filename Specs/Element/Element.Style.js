/*
Script: Element.Style.js
	Specification Examples of Element.Style.js.

License:
	MIT-style license.
*/

describe('Element.set `opacity`', {
		 
	'should set the opacity of an Element': function() {
		var el = new Element('div').set('opacity', 0.4);
		if (Browser.Engine.trident) value_of(this.style.filter).should_be('alpha(opacity=40)');
		value_of(el.style.opacity).should_be(0.4);
	},
	
	'should return the opacity of an Element': function() {
		value of (new Element('div').set('opacity', 0.4).get('opacity')).should_be(0.4);
	}
		 
});

describe('Element.getStyle', {

	'should get a six digit hex code from a three digit hex code': function() {
		var el = new Element('div').set('html', '<div style="color:#0f0"></div>');
		value_of(el.getElement('div').getStyle('color')).should_be('#00ff00');
	},
	
	'should getStyle a six digit hex code from an RGB value': function() {
		var el = new Element('div').set('html', '<div style="color:rgb(0, 255, 0)"></div>');
		value_of(el.getElement('div').getStyle('color')).should_be('#00ff00');
	},
	
	'should `getStyle` with a dash in it': function() {
		var el = new Element('div').set('html', '<div style="font-weight:bold"></div>');
		value_of(el.getElement('div').getStyle('font-weight')).should_be('bold');
	}

});

describe('Element.setStyle', {

	'should set the `styles` property on an Element using the Element constructor': function() {
		value_of(new Element('div', {styles:{'color':'#00ff00'}}).getStyle('color')).should_be('#00ff00');
	},

	'should `setStyle` on an Element': function() {
		value_of(new Element('div').setStyle('color':'#00ff00').getStyle('color')).should_be('#00ff00');
	},

	'should properly `setStyle` for a property with a dash in it': function() {
		value_of(new Element('div').setStyle('font-weight', 'bold').getStyle('font-weight')).should_be('bold');
	}

});

describe('Element.getStyles', {

	'should get multiple styles from an Element': function() {
		var el = new Element('div').set('html', '<div style="color:#0f0;font-weight:bold;margin:auto"></div>');
		value_of(el.getElement('div').getStyle('color')).should_be('#00ff00');
	}

});