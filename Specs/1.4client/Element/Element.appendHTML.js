/*
---
name: Element.appendHTML Specs
description: test for appendHTML feature
requires: [Core/Element]
provides: [Element.appendHTML.Specs]
...
*/

describe('Element.appendHTML', function(){

	var check, base, baseFallBack;

	beforeEach(function(){
		check = new Element('span', {
			html: '<div>content</div><div>content</div>',
			styles: {
				display: 'none'
			}
		});

		check.inject(document.documentElement);
		base = $(check.getChildren()[0]);
		baseFallBack = $(check.getChildren()[1]);

		base.set('rel', '0');
		baseFallBack.set('rel', '1');
	});

	afterEach(function(){
		baseFallBack = baseFallBack.destroy();
		base = base.destroy();
		check = check.destroy();
	});

	it('should insert element before', function(){

		base.appendHTML('<span>HI!</span>', 'before');
		baseFallBack.appendHTML('<span>HI!</span>', 'before');

		var children = check.getElements('span');

		expect(children.length).toBe(2);
		children.each(function(child, i){
			expect(child.get('text')).toBe('HI!');
			expect(child.nextSibling.getAttribute('rel')).toBe('' + i);
		});
	});

	it('should insert element after', function(){
		base.appendHTML('<span>HI!</span>', 'after');
		baseFallBack.appendHTML('<span>HI!</span>', 'after');

		var children = check.getElements('span');

		expect(children.length).toBe(2);
		children.each(function(child, i){
			expect(child.get('text')).toBe('HI!');
			expect(child.previousSibling.getAttribute('rel')).toBe('' + i);
		});
	});

	it('should insert element on bottom', function(){
		base.appendHTML('<span>HI!</span>', 'bottom');
		baseFallBack.appendHTML('<span>HI!</span>', 'bottom');

		var children = check.getElements('span');

		expect(children.length).toBe(2);
		expect(children.each(function(child, i){
			expect(child.get('text')).toBe('HI!');
			expect(child.parentNode.getAttribute('rel')).toBe('' + i);
			expect(child.parentNode.get('text')).toBe('contentHI!');
		}));
	});

	it('should insert element on top', function(){
		base.appendHTML('<span>HI!</span>', 'top');
		baseFallBack.appendHTML('<span>HI!</span>', 'top');

		var children = check.getElements('span');

		expect(children.length).toBe(2);
		children.each(function(child, i){
			expect(child.get('text')).toBe('HI!');
			expect(child.parentNode.getAttribute('rel')).toBe('' + i);
			expect(child.parentNode.get('text')).toBe('HI!content');
		});
	});

	it('should insert element on inside (bottom)', function(){
		base.appendHTML('<span>HI!</span>', 'inside');
		baseFallBack.appendHTML('<span>HI!</span>', 'inside');

		var children = check.getElements('span');

		expect(children.length).toBe(2);
		children.each(function(child, i){
			expect(child.get('text')).toBe('HI!');
			expect(child.parentNode.getAttribute('rel')).toBe('' + i);
			expect(child.parentNode.get('text')).toBe('contentHI!');
		});
	});

});
