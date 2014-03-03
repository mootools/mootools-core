/*
---
name: Fx Specs
description: n/a
requires: [Core/Fx.Tween]
provides: [1.4client.Fx.Tween.Specs]
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

		it('should accept the old style arguments (0, 1)', function(){

			var element = new Element('div');
			element.fade(1, 0);

			var tween = element.get('tween');

			expect(tween.from[0].value).toEqual(1);
			expect(tween.to[0].value).toEqual(0);

			this.clock.tick(1000);

			expect(element.getStyle('opacity')).toEqual(0);

		});

	});

	describe('Element.tween("clip")', function(){

		it('should animate the clip', function(){
			var element = new Element('div', {
				text: Array(5).join('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod '),
				styles: {
					width: 200,
					height: 100,
					position: 'absolute',
					clip: 'rect(0px, 0px, 200px, 0px)'
				}
			});
			var spy = spyOn(element, 'setStyle').andCallThrough();

			element.tween('clip', 'rect(0px, 100px, 200px, 0px)');

			this.clock.tick(10000);

			expect(spy).toHaveBeenCalledWith('clip', ['rect(0px,', 100, 200, 0]);

			spy.reset();

			element.tween('clip', 'rect(0px 50px 200px 0px)');

			this.clock.tick(10000);

			expect(spy).toHaveBeenCalledWith('clip', ['rect(0px', 50, 200, 0]);

		})

	});

});
