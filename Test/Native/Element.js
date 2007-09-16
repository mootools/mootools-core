/*
Script: Element.js
	Unit Tests for Element.js

License:
	MIT-style license.
*/

Tests.Element = new Test.Suite('Element', {
	
	$: function(){
		var container = document.createElement('div');
		
		document.body.appendChild(container);
		
		container.innerHTML = '<div id="dollar-test"></div>';
		
		this.end(
			Assert.type($('dollar-test'), 'element'),
			Assert.equals($('dollar-test').tagName.toLowerCase(), 'div'),
			!!(document.body.removeChild(container))
		);
	},
	
	newElement: function(){
		var el = new Element('input', {name: 'firstname', type: 'text', value: 'jack'});
		
		this.end(
			Assert.type(el, 'element'),
			Assert.equals(el.name, 'firstname'),
			Assert.equals(el.type, 'text'),
			Assert.equals(el.value, 'jack')
		);
	}
	
});