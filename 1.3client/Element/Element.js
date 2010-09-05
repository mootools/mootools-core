describe('Element.clone', function(){

	it('should clone children of object elements', function(){
		var div = new Element('div').set('html', '<div id="swfobject-video" class="video">' +
			'<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="425" height="344">' +
				'<param name="movie" value="http://www.youtube.com/v/6nOVQDMOvvE&amp;rel=0&amp;color1=0xb1b1b1&amp;color2=0xcfcfcf&amp;hl=en_US&amp;feature=player_embedded&amp;fs=1" />' +
				'<param name="wmode" value="opaque" />' +
				'<param name="quality" value="high" />' +
				'<param name="bgcolor" value="#000616" />' +
				'<param name="allowFullScreen" value="true" />' +
				'<!--[if !IE]>-->' +
				'<object type="application/x-shockwave-flash" data="http://www.youtube.com/v/6nOVQDMOvvE&amp;rel=0&amp;color1=0xb1b1b1&amp;color2=0xcfcfcf&amp;hl=en_US&amp;feature=player_embedded&amp;fs=1" width="425" height="344">' +
				'<param name="wmode" value="opaque" />' +
				'<param name="quality" value="high" />' +
				'<param name="bgcolor" value="#000616" />' +
				'<param name="allowFullScreen" value="true" />' +
				'<!--<![endif]-->' +
				'<p class="flash-required">Flash is required to view this video.</p>' +
				'<!--[if !IE]>-->' +
				'</object>' +
				'<!--<![endif]-->' +
			'</object>' +
		'</div>');

		expect(div.clone().getElementsByTagName('param').length != 0).toBeTruthy();

		div = new Element('div').set('html', '<div id="ie-video" class="video">' +
			'<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="425" height="344">' +
				'<param name="movie" value="http://www.youtube.com/v/6nOVQDMOvvE&amp;rel=0&amp;color1=0xb1b1b1&amp;color2=0xcfcfcf&amp;hl=en_US&amp;feature=player_embedded&amp;fs=1" />' +
				'<param name="wmode" value="opaque" />' +
				'<param name="quality" value="high" />' +
				'<param name="bgcolor" value="#000616" />' +
				'<param name="allowFullScreen" value="true" />' +
			'</object>' +
		'</div>');

		expect(div.clone().getElementsByTagName('param').length != 0).toBeTruthy();
	});

});

describe('Elements implement order', function(){

	it('should give precedence to Array over Element', function(){
		var anchor = new Element('a');

		var element = new Element('div').adopt(
			new Element('span'),
			anchor
		);

		expect(element.getLast()).toBe(anchor);
		
		expect(new Elements([element, anchor]).getLast()).toBe(anchor);
	});

});

describe('Element traversal', function(){

	it('should match against all provided selectors', function(){
		var div = new Element('div').adopt(
			new Element('span').adopt(
				new Element('a')
			)
		);

		var span = div.getElement('span');
		var anchor = span.getElement('a');

		expect(anchor.getParent('div, span')).toBe(div);
		expect(anchor.getParent('span, div')).toBe(span);

		expect(anchor.getParent('tagname, div')).toBe(div);
		expect(anchor.getParent('div > span')).toBe(span);
	});

});