
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

});
