/*
---
name: Element Specs
description: n/a
requires: [Core/Element.Event]
provides: [Element.Event.Specs]
...
*/

describe('Element.getProperty', function(){

	it('should get the attrubte of a form when the form has an input with as ID the attribute name', function(){
		var div = new Element('div');
		div.innerHTML = '<form action="s"><input id="action"></form>';
		expect($(div.firstChild).getProperty('action')).toEqual('s');
	});

});
