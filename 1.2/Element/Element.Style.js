/*
Script: Element.Style.js
	Specification Examples of Element.Style.js.

License:
	MIT-style license.
*/

describe('Element.set `opacity`', {

	'should set the opacity of an Element': function() {
		var el = new Element('div').set('opacity', 0.4);
		if (Browser.Engine.trident) value_of(el.style.filter).should_be('alpha(opacity=40)');
		else value_of(el.style.opacity == 0.4).should_be_true();
	},

	'should return the opacity of an Element': function() {
		var div = new Element('div').set('opacity', 0.4);
		value_of(div.get('opacity') == 0.4).should_be_true();
		div.set('opacity', 0);
		value_of(div.get('opacity') == 0).should_be_true();
	},
	
	'should return the opacity of an Element without seting it before': function() {
		var div = new Element('div');
		if (Browser.Engine.trident) div.style.filter = 'alpha(opacity=40)';
		else div.style.opacity = 0.4;
		value_of(div.get('opacity') == 0.4).should_be_true();
	},
	
	'should not remove existent filters on browsers with filters': function(){
		var div = new Element('div');
		if (Browser.Engine.trident){
			div.style.filter = 'blur(strength=50)';
			div.set('opacity', 0.4);
			value_of(div.style.filter).should_match(/blur\(strength=50\)/i);
		}
	}

});



describe('Element.getStyle', {

	'should get a six digit hex code from a three digit hex code': function() {
		var el = new Element('div').set('html', '<div style="color:#00ff00"></div>');
		value_of(el.getElement('div').getStyle('color')).should_be('#00ff00');
	},

	'should getStyle a six digit hex code from an RGB value': function() {
		var el = new Element('div').set('html', '<div style="color:rgb(0, 255, 0)"></div>');
		value_of(el.getElement('div').getStyle('color')).should_be('#00ff00');
	},

	'should `getStyle` with a dash in it': function() {
		var el = new Element('div').set('html', '<div style="list-style-type:square"></div>');
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
		var el = new Element('div').set('html', '<div style="color:#00ff00;list-style-type:square"></div>');
		value_of(el.getElement('div').getStyles('color', 'list-style-type')).should_be({color:'#00ff00', 'list-style-type':'square'});
	}

});

describe('Element.setStyles', {

	'should set multiple styles': function() {
		value_of(new Element('div').setStyles({'list-style-type':'square', 'color':'#00ff00'}).getStyles('list-style-type', 'color')).should_be({'list-style-type':'square', color:'#00ff00'});
	}

});