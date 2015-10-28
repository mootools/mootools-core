/*
---
name: Fx.Tween
requires: ~
provides: ~
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

	it('should tween the style of an element', function(){
		var element = new Element('div#st_el', {
			styles: {
				height: 100
			}
		}).inject(document.body);

		var fx = new Fx.Tween(element, {
			duration: 100,
			property: 'height'
		});

		fx.start(10, 50);

		this.clock.tick(200);

		expect(element.getStyle('height').toInt()).to.equal(50);
		element.destroy();
	});

	it('should tween the style of an element via Element.tween', function(){
		var element = new Element('div', {
			styles: {
				width: 100
			},
			tween: {
				duration: 100
			}
		}).inject(document.body).tween('width', 50);

		this.clock.tick(200);

		expect(element.getStyle('width').toInt()).to.equal(50);
		element.destroy();
	});

	it('should fade an element', function(){
		var element = new Element('div', {
			styles: { opacity: 0 }
		}).inject(document.body);

		element.set('tween', {
			duration: 100
		});

		element.fade('in');

		this.clock.tick(130);

		expect(element.getStyle('opacity').toInt()).to.equal(1);
		element.destroy();
	});

	it('should fade out an element and fade in when triggerd inside the onComplete event', function(){
		var element = new Element('div').inject($(document.body));
		var firstOpacity, lastOpacity, lastVisibility, runOnce = true;
		element.set('tween', {
			duration: 100,
			onComplete: function(){
				if (runOnce){
					firstOpacity = this.element.getStyle('opacity');
					runOnce && this.element.fade();
					runOnce = false;
				}
			}
		});

		element.fade();
		this.clock.tick(250);
		lastOpacity = element.getStyle('opacity');
		lastVisibility = element.getStyle('visibility');

		expect(firstOpacity.toInt()).to.equal(0);
		expect(lastOpacity.toInt()).to.equal(1);
		expect(lastVisibility).to.equal('visible');
		element.destroy();
	});

	it('should fade an element with toggle', function(){
		var element = new Element('div', {
			styles: { opacity: 1 }
		}).inject(document.body);

		element.set('tween', {
			duration: 100
		});

		element.fade('toggle');

		this.clock.tick(130);

		expect(element.getStyle('opacity').toInt()).to.equal(0);
		element.destroy();
	});

	it('should set tween options with the element getter en setter', function(){
		var element = new Element('div');

		element.set('tween', {
			duration: 100
		});

		expect(element.get('tween').options.duration).to.equal(100);
	});

	it('should fade an element with toggle', function(){
		var element = new Element('div', {
			tween: {
				duration: 10
			}
		}).setStyle('background-color', '#fff').inject(document.body);

		element.highlight('#f00');

		this.clock.tick(40);

		expect(['#fff', '#ffffff']).to.contain(element.getStyle('background-color').toLowerCase());
		element.destroy();
	});

	describe('Element.fade', function(){

		it('Should set the visibility style', function(){
			var element = new Element('div', {styles: {'visibility': 'visible'}}).inject(document.body);

			expect(element.getStyles('opacity', 'visibility')).to.eql({opacity: 1, visibility: 'visible'});

			element.fade(0.5);
			this.clock.tick(600);
			expect(element.getStyles('opacity', 'visibility')).to.eql({opacity: 0.5, visibility: 'visible'});

			element.fade(0);
			this.clock.tick(600);
			expect(element.getStyles('opacity', 'visibility')).to.eql({opacity: 0, visibility: 'hidden'});

			element.fade(1);
			this.clock.tick(600);
			expect(element.getStyles('opacity', 'visibility')).to.eql({opacity: 1, visibility: 'visible'});

			element.destroy();
		});

		it('should accept the old style arguments (0, 1)', function(){
			var element = new Element('div');
			element.fade(1, 0);

			var tween = element.get('tween');

			expect(tween.from[0].value).to.equal(1);
			expect(tween.to[0].value).to.equal(0);

			this.clock.tick(1000);

			expect(element.getStyle('opacity')).to.equal(0);
		});

	});

});
