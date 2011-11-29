/*
---
name: Fx Specs
description: n/a
requires: [Core/Fx.Tween]
provides: [Fx.Tween.Specs]
...
*/
describe('Fx.Tween', function(){

	beforeEach(function(){
		this.clock = sinon.useFakeTimers();
	});

	afterEach(function(){
		this.clock.reset();
		this.clock.restore();
	});

	describe('Element.fade', function(){

		it('Should set the visibility style', function(){

			var element = new Element('div', {styles: {'visibility': 'visible'}}).inject(document.body);

			expect(element.getStyles('opacity', 'visibility')).toEqual({opacity: 1, visibility: 'visible'});

			element.fade(0.5);
			this.clock.tick(600);
			expect(element.getStyles('opacity', 'visibility')).toEqual({opacity: 0.5, visibility: 'visible'});

			element.fade(0);
			this.clock.tick(600);
			expect(element.getStyles('opacity', 'visibility')).toEqual({opacity: 0, visibility: 'hidden'});

			element.fade(1);
			this.clock.tick(600);
			expect(element.getStyles('opacity', 'visibility')).toEqual({opacity: 1, visibility: 'visible'});

			element.destroy();

		});

	});

});
