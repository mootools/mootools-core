/*
---
name: Element.Style
requires: ~
provides: ~
...
*/

/*<1.2compat>*/
describe('Element.set `opacity`', function(){

	it('should set the opacity of an Element', function() {
		var el = new Element('div').set('opacity', 0.4);
		if (document.html.style.opacity != null)
			expect(el.style.opacity).toEqual('0.4');
		else if (document.html.style.filter != null)
			expect(el.style.filter).toEqual('alpha(opacity=40)');
		else
			expect(el.getStyle('opacity')).toEqual(0.4);
	});

	it('should return the opacity of an Element', function() {
		var div = new Element('div').set('opacity', 0.4);
		expect(div.get('opacity') == 0.4).toBeTruthy();
		div.set('opacity', 0);
		expect(div.get('opacity') == 0).toBeTruthy();
	});

});
/*</1.2compat>*/

describe('Element.set `opacity`', function(){

	it('should set the opacity of an Element', function() {
		var el = new Element('div').setStyle('opacity', 0.4);
		if (document.html.style.opacity != null)
			expect(el.style.opacity).toEqual('0.4');
		else if (document.html.style.filter != null)
			expect(el.style.filter).toEqual('alpha(opacity=40)');
		else
			expect(el.getStyle('opacity')).toEqual(0.4);
	});

	it('should return the opacity of an Element', function() {
		var div = new Element('div').setStyle('opacity', 0.4);
		expect(div.getStyle('opacity') == 0.4).toBeTruthy();
		div.setStyle('opacity', 0);
		expect(div.getStyle('opacity') == 0).toBeTruthy();
	});

});

describe('Element.getStyle', function(){

	it('should get a six digit hex code from a three digit hex code', function() {
		var el = new Element('div').set('html', '<div style="color:#00ff00"></div>');
		expect(el.getElement('div').getStyle('color')).toEqual('#00ff00');
	});

	it('should getStyle a six digit hex code from an RGB value', function() {
		var el = new Element('div').set('html', '<div style="color:rgb(0, 255, 0)"></div>');
		expect(el.getElement('div').getStyle('color')).toEqual('#00ff00');
	});

	it('should `getStyle` with a dash in it', function() {
		var el = new Element('div').set('html', '<div style="list-style-type:square"></div>');
		expect(el.getElement('div').getStyle('list-style-type')).toEqual('square');
	});

	it('should `getStyle` padding', function() {
		var el = new Element('div').set('html', '<div style="padding:20px"></div>');
		expect(el.getElement('div').getStyle('padding-left')).toEqual('20px');
	});

});

describe('Element.setStyle', function(){

	it('should set the `styles` property on an Element using the Element constructor', function() {
		expect(new Element('div', {styles:{'color':'#00ff00'}}).getStyle('color')).toEqual('#00ff00');
	});

	it('should `setStyle` on an Element', function() {
		expect(new Element('div').setStyle('color','#00ff00').getStyle('color')).toEqual('#00ff00');
	});

	it('should properly `setStyle` for a property with a dash in it', function() {
		expect(new Element('div').setStyle('list-style-type', 'square').getStyle('list-style-type')).toEqual('square');
	});

});

describe('Element.getStyles', function(){

	it('should return multiple styles', function() {
		var el = new Element('div').set('html', '<div style="color:#00ff00;list-style-type:square"></div>');
		expect(el.getElement('div').getStyles('color', 'list-style-type')).toEqual({color:'#00ff00', 'list-style-type':'square'});
	});

});

describe('Element.setStyles', function(){

	it('should set multiple styles', function() {
		expect(new Element('div').setStyles({'list-style-type':'square', 'color':'#00ff00'}).getStyles('list-style-type', 'color')).toEqual({'list-style-type':'square', color:'#00ff00'});
	});

});

describe('Element.set opacity', function(){

	it('should not remove existent filters on browsers with filters', function(){
		var div = new Element('div'), 
		hasOpacity = document.html.style.opacity != null
		
		if (!hasOpacity && document.html.style.filter != null && !window.opera && !Syn.browser.gecko){ //we can prolly remove the last two check
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

describe('Element.Style', function(){

	describe('opacity', function(){

		beforeEach(function(){
			var className = String.uniqueID();
			var style = this.style = $(document.createElement('style'));
			style.type = 'text/css';
			var definition = [
				'.' + className + '{',
					'opacity: 0.5;',
					'filter: alpha(opacity=50);',
					'color: #ff0000;',
				'}'
			].join('');

			// fix this, see https://github.com/mootools/mootools-core/issues/2265
			if (style.styleSheet) style.styleSheet.cssText = definition;
			else style.set('text', definition);

			document.head.appendChild(style);

			this.element = new Element('div', {
				'class': className,
				text: 'yo'
			}).inject(document.body);
		});

		afterEach(function(){
			this.style.destroy();
			this.element.destroy();
			this.element = null;
		});

		it('should get the opacity defined by the CSS', function(){
			expect(this.element.getStyle('opacity')).toEqual(0.5);
		});

		it('should set/overwrite the opacity', function(){
			this.element.setStyle('opacity', 1);
			expect(this.element.getStyle('opacity')).toEqual(1);
			this.element.setStyle('opacity', null);
			expect(this.element.getStyle('opacity')).toEqual(0.5);
		});

		it('should remove the style by setting it to `null`', function(){
			this.element.setStyle('color', '#FF9900');
			expect(this.element.getStyle('color')).toEqual('#ff9900');
			this.element.setStyle('color', null);
			expect(this.element.getStyle('color')).toEqual('#ff0000');
		});

	});

	describe('getStyle height / width / margin with CSS', function(){

		var style, element;

		it('[beforeAll]', function(){
			var className = String.uniqueID();
			style = $(document.createElement('style'));
			style.type = 'text/css';
			var definition = [
				'.' + className + '{',
					'height: 200px;',
					'width: 50%;',
					'margin-left: 20%;',
				'}'
			].join('');

			// fix this, see https://github.com/mootools/mootools-core/issues/2265
			if (style.styleSheet) style.styleSheet.cssText = definition;
			else style.set('text', definition);

			document.head.appendChild(style);

			element = new Element('div', {
				'class': className,
				text: 'yo'
			}).inject(document.body);

		});

		it('should get the height from the CSS', function(){
			expect(element.getStyle('height')).toEqual('200px');
		});

		it('should get the width from the CSS', function(){
			expect(element.getStyle('width')).toMatch(/\d+px/);
		});

		it('should not mangle the units from inline width in %', function(){
			expect(new Element('div').setStyle('width', '40%').getStyle('width')).toEqual('40%');
		});

		it('should not mangle the units from inline auto width', function(){
			expect(new Element('div').setStyle('width', 'auto').getStyle('width')).toEqual('auto');
		});

		it('should get the left margin from the CSS', function(){
			// FireFox returns px (and maybe even as floats)
			var re = /^(20\%|(\d+|\d+\.\d+)px)$/;
			expect(re.test('20%')).toBe(true);
			expect(re.test('20px')).toBe(true);
			expect(re.test('20.43px')).toBe(true);
			expect(re.test('20')).toBe(false);
			expect(re.test('auto')).toBe(false);
			expect(element.getStyle('margin-left')).toMatch(re);
		});

		it('[afterAll]', function(){
			style.destroy();
			element.destroy();
		});

	});

	describe('getStyle height / width / borders from auto values', function(){

		var element;

		it('[beforeAll]', function(){
			// the test framework stylesheet pollutes this test by setting border at 0px.
			// create an unknown element to bypass it and use browser defaults.
			element = new Element('unknown', {
				styles: {
					display: 'block'
				}
			});

			var child = new Element('div', {
				styles: {
					width: '200px',
					height: '100px'
				}
			});

			element.adopt(child).inject(document.body);
		});

		it('should inherit the height from the child', function(){
			expect(element.getStyle('height')).toEqual('100px');
		});

		it('should get a pixel based width', function(){
			expect(element.getStyle('width')).toMatch(/\d+px/);
		});

		it('should have a 0px border left', function(){
			expect(element.getStyle('borderLeftWidth')).toEqual('0px');
		});

		it('[afterAll]', function(){
			element.destroy();
		});

	});

	describe('getStyle border after setStyle', function(){

		it('should have same order when getting a previously set border', function(){
			var border = '2px solid #123abc';
			expect(new Element('div').setStyle('border', border).getStyle('border')).toEqual(border);
		});

	});

	describe('getComputedStyle margin-left on detached element', function(){

		it('should have a non-null margin-left', function(){
			expect(new Element('div').getComputedStyle('margin-left')).not.toEqual(null);
		});

	});

	describe('set/getStyle background-size', function(){

		xit('should return the correct pixel size', function(){
			var foo = new Element('div', {
				styles: {
					backgroundSize: '44px'
				}
			});
			foo.setStyle('background-size', 20);
			expect(foo.getStyle('backgroundSize')).toEqual('20px');
		});

	});

	describe('getStyle background-position', function(){
		beforeEach(function(){
			var className = 'getStyleBackgroundPosition';
			var style = this.style = $(document.createElement('style'));
			style.type = 'text/css';
			var definition = [
				'.' + className + '{',
					'background: #69a none no-repeat left bottom;',
				'}'
			].join('');

			// fix this, see https://github.com/mootools/mootools-core/issues/2265
			if (style.styleSheet) style.styleSheet.cssText = definition;
			else style.set('text', definition);

			document.head.appendChild(style);

			this.element = new Element('div', {
				'class': className,
				text: 'yo'
			}).inject(document.body);
		});

		afterEach(function(){
			this.style.destroy();
			this.element.destroy();
			this.element = null;
		});

		it('should have non-empty background-position shorthand', function(){
			expect(this.element.getStyle('background-position')).not.toEqual(null);
			expect(this.element.getStyle('background-position')).toMatch(/\w+/);
		});

		it('should not return a keyword-based background-position shorthand', function(){
			expect(this.element.getStyle('background-position')).not.toMatch(/(top|right|bottom|left)/);
			expect(this.element.getStyle('background-position')).toEqual('0% 100%');
		});

		it('should have non-empty background-position on an element with no set styles', function(){
			var element = new Element('div');
			expect(element.getStyle('background-position')).not.toEqual(null);
			expect(element.getStyle('background-position')).toMatch(/\w+/);
			element = null;
		});

		it('should remove the background-position', function(){
			var element = new Element('div');
			element.setStyle('background-position', '40px 10px');
			element.setStyle('background-position', null);
			expect(element.getStyle('background-position')).toMatch(/0px 0px|0% 0%/);
		});

	});
});
