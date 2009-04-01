/*
Script: Element.Style.js
	Specification Examples of Element.Style.js.

License:
	MIT-style license.
*/

describe('Element.setStyle(opacity)', {

	'should set the opacity of an Element': function() {
		var el = new Element('div').setStyle('opacity', 0.4);
		if (Browser.Engine.trident) value_of(el.style.filter).should_be('alpha(opacity=40)');
		value_of(el.style.opacity).should_be(0.4);
	},

	'should return the opacity of an Element': function() {
		value_of(new Element('div').setStyle('opacity', 0.4).getStyle('opacity')).should_be(0.4);
	}

});

describe('Element.getStyle', {

	'should get the margin-top style property as pixel value': function() {
		var el = new Element('div').set('html', '<div style="margin-top: 5px;"></div>');
		value_of(el.find('div').getStyle('margin-top')).should_be('5px');
	},

	'should `getStyle` either with dashes or capitalized letters in the property name': function() {
		var el = new Element('div').set('html', '<div style="list-style-type: square"></div>');
		value_of(el.find('div').getStyle('list-style-type')).should_be('square');
		
		value_of(el.find('div').getStyle('listStyleType')).should_be('square');
	}

});

describe('Element.setStyle', {

	'should set the `styles` property on an Element using the Element constructor': function() {
		value_of(new Element('div', {styles: {'margin-top': '5px'}}).getStyle('margin-top')).should_be('5px');
	},

	'should `setStyle` on an Element': function() {
		value_of(new Element('div').setStyle('margin-top', '5px').getStyle('margin-top')).should_be('5px');
	},

	'should properly `setStyle` for a property with a dash in it': function() {
		value_of(new Element('div').setStyle('list-style-type', 'square').getStyle('list-style-type')).should_be('square');
	}

});

describe('Element.getStyles', {

	'should return multiple styles': function() {
		var el = new Element('div').set('html', '<div style="margin-top: 5px; list-style-type: square"></div>');
		value_of(el.find('div').getStyles(['margin-top', 'list-style-type'])).should_be({'margin-top': '5px', 'list-style-type': 'square'});
	}

});

describe('Element.setStyles', {

	'should set multiple styles': function() {
		var obj = {'list-style-type': 'square', 'margin-top': '5px'};
		value_of(new Element('div').setStyles(obj).getStyles(['list-style-type', 'margin-top'])).should_be(obj);
	}

});