/*
Script: Element.Dimensions.js
	Contains Element methods to work with element size, scroll, or position in space.

Note:
	The functions in this script require a XHTML doctype.

See Also:
	<http://en.wikipedia.org/wiki/XHTML>

License:
	MIT-style license.
*/

/*
Native: Element
	Custom class to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

Element.Get.extend({
	
	/*
	Element Getter: size
		Returns an Object representing the size values of the element.

	Syntax:
		>var size = myElement.get('size');

	Returns:
		(object) An object containing, 'scroll', 'offset', and 'client' (x,y) values.

	Example:
		[javascript]
			$('myElement').get('size');
		[/javascript]

	Returns:
		[javascript]
			{
				'scroll': {'x': 100, 'y': 100},
				'offset': {'x': 300, 'y': 400},
				'client': {'x': 250, 'y': 350}
			}
		[/javascript]

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.offsetWidth>, <http://developer.mozilla.org/en/docs/DOM:element.offsetHeight>, <http://developer.mozilla.org/en/docs/DOM:element.scrollWidth>, <http://developer.mozilla.org/en/docs/DOM:element.scrollHeight>
	*/
	
	size: function(){
		return {
			'offset': {'x': this.offsetWidth, 'y': this.offsetHeight},
			'scroll': {'x': this.scrollWidth, 'y': this.scrollHeight},
			'client': {'x': this.clientWidth, 'y': this.clientHeight}
		};
	},
	
	// <http://developer.mozilla.org/en/docs/DOM:element.scrollLeft>, <http://developer.mozilla.org/en/docs/DOM:element.scrollTop>
	
	scroll: function(){
		return {'x': this.scrollLeft, 'y': this.scrollTop};
	},

	/*
	Element Getter: position
		Returns the real offsets of the element.

	Syntax:
		>var position = myElement.get('position'[, overflown]);

	Arguments:
		overflown - (array, optional) An array of nested scrolling containers for scroll offset calculation.

	Returns:
		(object) An object with properties: x and y coordinates of the Element's position.

	Example:
		[javascript]
			$('element').get('position'); //returns {x: 100, y:500};
		[/javascript]

	Note:
		Use the overflown parameter if your element is inside any element containing scrollbars.

	See Also:
		<http://www.quirksmode.org/js/findpos.html>
	*/

	position: function(overflown){
		overflown = $splat(overflown);
		var el = this, left = 0, top = 0;
		do {
			left += el.offsetLeft || 0;
			top += el.offsetTop || 0;
			el = el.offsetParent;
		} while (el);
		overflown.each(function(element){
			left -= element.scrollLeft || 0;
			top -= element.scrollTop || 0;
		});
		return {'x': left, 'y': top};
	},

	/*
	Element Getter: top
		Returns the distance from the top of the window to the Element.

	Syntax:
		>var top = myElement.get('top'[, overflown]);

	Arguments:
		overflown - (array, optional) An array of nested scrolling containers for scroll offset calculation.

	Returns:
		(integer) The top position of this Element.

	Example:
		[javascript]
			$('myElement').get('top'); //returns 20
		[/javascript]
	*/

	top: function(overflown){
		return this.get('position', overflown).y;
	},

	/*
	Element Getter: left
		Returns the distance from the left of the window to the Element.

	Syntax:
		>var left = myElement.get('left', [overflown]);

	Arguments:
		overflown - (array, optional) An array of nested scrolling containers for scroll offset calculation.

	Returns:
		(integer) The left position of this Element.

	Example:
		[javascript]
			$('myElement').get('left'); // returns 20
		[/javascript]
	*/

	left: function(overflown){
		return this.get('position', overflown).x;
	},

	/*
	Element Getter: coordinates
		Returns an object with width, height, left, right, top, and bottom, representing the values of the Element

	Syntax:
		>var coords = myElement.get('coordinates'[, overflown]);

	Arguments:
		overflown - (array, optional) An array of nested scrolling containers for scroll offset calculation.

	Returns:
		(object) An object containing the Element's current: width, height, left, top, right, and bottom.

	Example:
		[javascript]
			var myValues = $('myElement').get('coordinates');
		[/javascript]

	Returns:
		[javascript]
			{
				width: 200,
				height: 300,
				left: 100,
				top: 50,
				right: 300,
				bottom: 350
			}
		[/javascript]
	*/

	coordinates: function(overflown){
		var position = this.get('position', overflown);
		var obj = {
			'width': this.offsetWidth,
			'height': this.offsetHeight,
			'left': position.x,
			'top': position.y
		};
		obj.right = obj.left + obj.width;
		obj.bottom = obj.top + obj.height;
		return obj;
	}
	
});

Element.implement({

	/*
	Method: scrollTo
		Scrolls the element to the specified coordinated (if the element has an overflow).

	Syntax:
		>myElement.scrollTo(x, y);

	Arguments:
		x - (integer) The x coordinate.
		y - (integer) The y coordinate.

	Example:
		>$('myElement').scrollTo(0, 100)

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.scrollLeft>, <http://developer.mozilla.org/en/docs/DOM:element.scrollTop>
	*/

	scrollTo: function(x, y){
		this.scrollLeft = x;
		this.scrollTop = y;
	}

});
