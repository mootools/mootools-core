
describe('Fx.Morph', function(){

	beforeEach(function(){
		this.clock = sinon.useFakeTimers();

		this.div = new Element('div', {'class': 'pos-abs-left'});
		this.style = new Element('style');
		var definition = [
			'.pos-abs-left {',
				'position: absolute;',
				'width: 200px;',
				'height: 200px;',
				'left: 10%;',
				'background: red',
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

	it('should morph between % units', function(){
		var spy = spyOn(this.div, 'setStyle').andCallThrough();
		this.div.set('morph', {unit : '%'}).morph({'left': 50});

		this.clock.tick(1000);

		expect(this.div.setStyle).toHaveBeenCalledWith('left', ['10%']);
		expect(this.div.setStyle).toHaveBeenCalledWith('left', ['50%']);
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

		expect(this.div.getStyle('top')).toEqual('100px');
		expect(this.div.getStyle('opacity')).toEqual(1);

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

		expect(this.div.getStyle('top')).toEqual('100px');
		expect(this.div.getStyle('opacity')).toEqual(1);

	});

});
