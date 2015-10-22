/*
---
name: Fx.Morph
requires: ~
provides: ~
...
*/

describe('Fx.Morph', function(){

	beforeEach(function(){
		this.clock = sinon.useFakeTimers();

		this.div = new Element('div', {'class': 'pos-abs-left'});
		this.style = new Element('style');
		var definition = [
			'.pos-abs-left {',
			'    position: absolute;',
			'    width: 200px;',
			'    height: 200px;',
			'    left: 10%;',
			'    background: red',
			'}'
		].join('');

		[this.style, this.div].invoke('inject', document.body);

		if (this.style.styleSheet) this.style.styleSheet.cssText = definition;
		else this.style.set('text', definition);
	});

	afterEach(function(){
		this.clock.reset();
		this.clock.restore();
		[this.div, this.style].invoke('destroy');
	});

	it('should morph the style of an element', function(){
		var element = new Element('div', {
			styles: {
				height: 100,
				width: 100
			}
		}).inject(document.body);

		var fx = new Fx.Morph(element, {
			duration: 100
		});

		fx.start({
			height: [10, 50],
			width: [10, 50]
		});

		this.clock.tick(200);

		expect(element.getStyle('height').toInt()).to.equal(50);
		expect(element.getStyle('width').toInt()).to.equal(50);
		element.destroy();
	});

	it('should set morph options with the element getter and setter', function(){
		var element = new Element('div');

		element.set('morph', {
			duration: 100
		});

		expect(element.get('morph').options.duration).to.equal(100);
	});

	it('should morph between % units', function(){
		sinon.spy(this.div, 'setStyle');
		this.div.set('morph', {unit : '%'}).morph({'left': [10, 50]});

		this.clock.tick(1000);

		expect(this.div.setStyle.calledWith('left', ['10%'])).to.equal(true);
		expect(this.div.setStyle.calledWith('left', ['50%'])).to.equal(true);

		this.div.setStyle.restore();
	});

	it('it should morph when the unit option is set, but an empty value', function(){
		this.div.set('morph', {
			duration: 100,
			unit: 'px'
		}).morph({
			opacity: 1,
			top : 100
		});

		this.clock.tick(150);

		expect(this.div.getStyle('top')).to.equal('100px');
		expect(this.div.getStyle('opacity')).to.equal(1);
	});

	it('it should morph when the unit option is set, but the style value is a number', function(){
		this.div.setStyles({
			top: '50px',
			opacity: 0
		}).set('morph', {
			duration: 100,
			unit: 'px'
		}).morph({
			opacity: 1,
			top : 100
		});

		this.clock.tick(150);

		expect(this.div.getStyle('top')).to.equal('100px');
		expect(this.div.getStyle('opacity')).to.equal(1);
	});

});
