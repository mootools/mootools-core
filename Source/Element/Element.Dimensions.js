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
	},

	/*
	Method: getSize
		Returns an Object representing the different size dimensions of the element.

	Syntax:
		>var size = myElement.getSize();

	Returns:
		(object) An object containing 'client', 'offset', and 'scroll' objects, each with x and y values.

		[javascript]
			{
				'client': {'x': 135, 'y': 125}, //total visible size of the content of the element
				'offset': {'x': 155, 'y': 145}, //total visible size of the element including borders, paddings, and scrollbars
				'scroll': {'x': 135, 'y': 400}  //total size of the element including hidden scrollable content
			}
		[/javascript]

	Example:
		[javascript]
			var size = $('myElement').getSize();
			alert('My element is ' + size.offset.x + 'px wide'); //alerts 'My element is 155px wide'
		[/javascript]

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.scrollLeft>, <http://developer.mozilla.org/en/docs/DOM:element.scrollTop>, <http://developer.mozilla.org/en/docs/DOM:element.offsetWidth>, <http://developer.mozilla.org/en/docs/DOM:element.offsetHeight>, <http://developer.mozilla.org/en/docs/DOM:element.scrollWidth>, <http://developer.mozilla.org/en/docs/DOM:element.scrollHeight>
	*/

	getSize: function(){
		return {
			'client': {'x': this.clientWidth, 'y': this.clientHeight},
			'offset': {'x': this.offsetWidth, 'y': this.offsetHeight},
			'scroll': {'x': this.scrollWidth, 'y': this.scrollHeight}
		};
	},

	/*
	Method: getScroll
		Returns an Object representing the size/scroll values of the element.

	Syntax:
		>var size = myElement.getSize();

	Returns:
		(object) An object containing the x and y scroll positions of the element.

	Example:
		[javascript]
			var scroll = $('myElement').getScroll();
			alert('My element is scrolled down ' + scroll.y + 'px'); //alerts 'My element is scrolled down 20px'
		[/javascript]

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.scrollLeft>, <http://developer.mozilla.org/en/docs/DOM:element.scrollTop>, <http://developer.mozilla.org/en/docs/DOM:element.offsetWidth>, <http://developer.mozilla.org/en/docs/DOM:element.offsetHeight>, <http://developer.mozilla.org/en/docs/DOM:element.scrollWidth>, <http://developer.mozilla.org/en/docs/DOM:element.scrollHeight>
	*/

	getScroll: function(){
		return {'x': this.scrollLeft, 'y': this.scrollTop};
	},

	/*
	Method: getPosition
		Returns the real offsets of the element.

	Syntax:
		>var position = myElement.getPosition(relative);

	Arguments:
		relative - (element, optional) if set, the position will be relative to this element, otherwise relative to the document.

	Returns:
		(object) An object with properties: x and y coordinates of the Element's position.

	Example:
		[javascript]
			$('element').getPosition(); //returns {x: 100, y: 500};
		[/javascript]

	See Also:
		<http://www.quirksmode.org/js/findpos.html>
	*/
	
	getPosition: function(relative){
		if (this == relative) return {x: 0, y: 0};
		var doc = this.ownerDocument, win = doc.window;
		var el = this, left = 0, top = 0;
		while (el){
			left += el.offsetLeft;
			top += el.offsetTop;
			el = el.offsetParent;
		}
		el = this;
		var estatic = (Element.getStyle(this, 'position') == 'static');
		while ((el = el.parentNode) && el != doc.html){
			var pstatic = (Element.getStyle(el, 'position') == 'static');
			if (relative === true && !pstatic) relative = el;
			if (!Browser.Engine.presto && !estatic && pstatic) continue;
			top -= el.scrollTop;
			left -= el.scrollLeft;
		}
		var rpos = (relative === true || relative == win || !relative) ? {x: 0, y: 0} : Element.getPosition($(relative, true));
		return {x: left - rpos.x, y: top - rpos.y};
	},
	
	computePosition: function(obj, client){
		if (client){
			var el = this, doc = this.ownerDocument, win = doc.window;
			while ((el = el.parentNode)){
				if (el == doc.html) el = win;
				else if (!Browser.Engine.presto && Element.getStyle(el, 'position') == 'static') continue;
				var scroll = (el == win) ? win.getScroll() : Element.getScroll(el);
				obj.x += scroll.x;
				obj.y += scroll.y;
			}
		}
		return {
			left: obj.x - this.getStyle('margin-left').toInt(),
			top: obj.y - this.getStyle('margin-top').toInt()
		};
	},
	
	setPosition: function(obj, relative){
		return this.setStyles(this.computePosition(obj, relative));
	},

	/*
	Method: getTop
		Returns the distance from the top of the window to the Element.

	Syntax:
		>var top = myElement.getTop(relative);

	Arguments:
		relative - (element, optional) if set, the position will be relative to this element, otherwise relative to the document.

	Returns:
		(integer) The top position of this Element.

	Example:
		[javascript]
			$('myElement').getTop(); //returns 20
		[/javascript]

	See Also:
		<Element.getPosition>
	*/

	getTop: function(relative){
		return this.getPosition(relative).y;
	},

	/*
	Method: getLeft
		Returns the distance from the left of the window to the Element.

	Syntax:
		>var left = myElement.getLeft(relative);

	Arguments:
		relative - (element, optional) if set, the position will be relative to this element, otherwise relative to the document.

	Returns:
		(integer) The left position of this Element.

	Example:
		[javascript]
			$('myElement').getLeft(); //returns 20
		[/javascript]

	See Also:
		<Element.getPosition>
	*/

	getLeft: function(relative){
		return this.getPosition(relative).x;
	},

	/*
	Method: getCoordinates
		Returns an object with width, height, left, right, top, and bottom, representing the values of the Element

	Syntax:
		>var coords = myElement.getCoordinates(relative);

	Arguments:
		relative - (element, optional) if set, the position will be relative to this element, otherwise relative to the document.

	Returns:
		(object) An object containing the Element's current: top, left, width, height, right, and bottom.

	Example:
		[javascript]
			var myValues = $('myElement').getCoordinates();
		[/javascript]

	Returns:
		[javascript]
			{
				top: 50,
				left: 100,
				width: 200,
				height: 300,
				right: 300,
				bottom: 350
			}
		[/javascript]

	See Also:
		<Element.getPosition>
	*/

	getCoordinates: function(relative){
		var position = this.getPosition(relative);
		var obj = {'top': position.y, 'left': position.x, 'width': this.offsetWidth, 'height': this.offsetHeight};
		obj.right = obj.left + obj.width;
		obj.bottom = obj.top + obj.height;
		return obj;
	}

});