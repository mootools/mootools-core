/*
Script: Window.Size.js
	Window cross-browser dimensions methods.

License:
	MIT-style license.

Note:
	- The Window.Size.js requires an XHTML doctype.
	- All these methods require that the browser operates in strict mode, not quirks mode.

See Also:
	<http://www.quirksmode.org/js/elementdimensions.html>
*/

/*
Class: Client
	Cross browser methods to get various window dimensions.
*/

Client.extend({

	/*
	Property: getWidth
		Returns an integer representing the width of the browser window (without the scrollbar).

	Syntax:
		>var width = Client.getWidth();

	Returns:
		(number) The width (without the scrollbar width) of the browser window.
	*/

	getWidth: function(){
		if (Client.Engine.webkit419) return window.innerWidth;
		if (Client.Engine.opera) return document.body.clientWidth;
		return document.documentElement.clientWidth;
	},

	/*
	Property: getHeight
		Returns an integer representing the height of the browser window (without the scrollbar).

	Syntax:
		>var height = Client.getHeight();

	Returns:
		(number) The height (without the scrollbar height) of the browser window.
	*/

	getHeight: function(){
		if (Client.Engine.webkit419) return window.innerHeight;
		if (Client.Engine.opera) return document.body.clientHeight;
		return document.documentElement.clientHeight;
	},

	/*
	Property: getScrollWidth
		Returns an integer representing the scrollWidth of the window.

	Syntax:
		>var scrollWidth = Client.getScrollWidth();

	Returns:
		(number) The scroll width of the browser window.

	Example:
		[javascript]
			window.addEvent('resize', function(){
				alert(Client.getScrollWidth());
			});
		[/javascript]

	Note:
		This value is equal to or bigger than <Client.getWidth>.

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.scrollWidth>
	*/

	getScrollWidth: function(){
		if (Client.Engine.ie) return Math.max(document.documentElement.offsetWidth, document.documentElement.scrollWidth);
		if (Client.Engine.webkit) return document.body.scrollWidth;
		return document.documentElement.scrollWidth;
	},

	/*
	Property: getScrollHeight
		Returns an integer representing the scrollHeight of the window.

	Syntax:
		>var scrollHeight = Client.getScrollHeight();

	Returns:
		(number) The scroll height of the browser window.

	Example:
		[javascript]
			window.addEvent('resize', function(){
				alert(Client.getScrollHeight());
			});
		[/javascript]

	Note:
		This value is equal to or bigger than <Client.getHeight>.

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.scrollHeight>
	*/

	getScrollHeight: function(){
		if (Client.Engine.ie) return Math.max(document.documentElement.offsetHeight, document.documentElement.scrollHeight);
		if (Client.Engine.webkit) return document.body.scrollHeight;
		return document.documentElement.scrollHeight;
	},

	/*
	Property: getScrollLeft
		Returns an integer representing the scrollLeft of the window.

	Syntax:
		>var scrollLeft = Client.getScrollLeft();

	Returns:
		(number) The number of pixels the window has scrolled from the left.

	Example:
		[javascript]
			window.addEvent('scroll', function(){
				alert(Client.getScrollLeft());
			});
		[/javascript]

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.scrollLeft>
	*/

	getScrollLeft: function(){
		return window.pageXOffset || document.documentElement.scrollLeft;
	},

	/*
	Property: getScrollTop
		Returns an integer representing the scrollTop of the window.

	Syntax:
		>var scrollTop = Client.getScrollTop();

	Returns:
		(number) The number of pixels the window has scrolled from the top.

	Example:
		[javascript]
			window.addEvent('scroll', function(){
				alert(Client.getScrollTop());
			});
		[/javascript]

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.scrollTop>
	*/

	getScrollTop: function(){
		return window.pageYOffset || document.documentElement.scrollTop;
	},

	/*
	Property: getSize
		Same as <Element.getSize>, but for window.

	Syntax:
		>var size = Client.getSize();

	Returns:
		(object) An object with size, scrollSize, scroll properties. Each property has a value of an object with x and y properties representing the width/height, scrollWidth/scrollHeight, or getScrollLeft/getScrollTop.

	Example:
		[javascript]
			var size = Client.getSize();
		[/javascript]
	*/

	getSize: function(){
		return {
			'size': {'x': Client.getWidth(), 'y': Client.getHeight()},
			'scrollSize': {'x': Client.getScrollWidth(), 'y': Client.getScrollHeight()},
			'scroll': {'x': Client.getScrollLeft(), 'y': Client.getScrollTop()}
		};
	}

});

/*
Class: window
	Utility methods attached to the window object to match Element's equivalents.
*/

window.extend({

	/*
	Property: getSize
		Same as <Client.getSize>.
	*/

	getSize: Client.getSize,

	getPosition: function(){
		return {'x': 0, 'y': 0};
	}

});