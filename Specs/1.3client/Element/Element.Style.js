/*
---
name: Element.Style Specs
description: n/a
requires: [Core/Element.Style]
provides: [Element.Style.Specs]
...
*/
describe('Element.set opacity', function(){

	it('should return the opacity of an Element without seting it before', function(){
		var div = new Element('div');
		if (document.html.style.opacity != null) div.style.opacity = 0.4;
		else if (document.html.style.filter != null) div.style.filter = 'alpha(opacity=40)';
		else div.setStyle('opacity', 0.4); // We only have visibility available but opacity should still report a 0..1 value
		expect(div.get('opacity') == 0.4).toBeTruthy();
	});

	it('should not remove existent filters on browsers with filters', function(){
		var div = new Element('div'),
			supports_filters;

		if (Syn.browser.msie) {
			var UA = navigator.userAgent.toLowerCase().match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/),
				version = parseFloat(UA[2]);
			supports_filters = (version < 10);
		} else {
			supports_filters = (document.html.style.filter !== null && !window.opera && !Syn.browser.gecko);
		}

		if (supports_filters){
			div.style.filter = 'blur(strength=50)';
			div.set('opacity', 0.4);
			expect(div.style.filter).toMatch(/blur\(strength=50\)/i);
		}
	});

	it('should handle very small numbers with scientific notation like 1.1e-20 with opacity', function(){
		var div = new Element('div');
		div.set('opacity', 1e-20);
		div.set('opacity', 0.5);
		expect(+div.get('opacity')).toEqual(0.5);
		if (Browser.ie && Browser.version <= 8){
			expect(div.style.filter.split('opacity').length - 1).toEqual(1);
		}
	});

});
