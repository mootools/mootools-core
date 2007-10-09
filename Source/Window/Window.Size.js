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
Native: Window
	Cross browser methods to get various window dimensions.
	Warning: All these methods require that the browser operates in strict mode, not quirks mode.
*/

Window.implement({

	/*
	Property: getWidth
		Returns an integer representing the width of the browser window (without the scrollbar).

	Syntax:
		>var width = window.getWidth();

	Returns:
		(number) The width (without the scrollbar width) of the browser window.
	*/

	getWidth: function(){
		if (Browser.Engine.webkit419) return this.innerWidth;
		if (Browser.Engine.presto) return this.document.body.clientWidth;
		return this.document.documentElement.clientWidth;
	},

	/*
	Property: getHeight
		Returns an integer representing the height of the browser window (without the scrollbar).

	Syntax:
		>var height = window.getHeight();

	Returns:
		(number) The height (without the scrollbar height) of the browser window.
	*/

	getHeight: function(){
		if (Browser.Engine.webkit419) return this.innerHeight;
		if (Browser.Engine.presto) return this.document.body.clientHeight;
		return this.document.documentElement.clientHeight;
	},

	/*
	Property: getScrollWidth
		Returns an integer representing the scrollWidth of the window.

	Syntax:
		>var scrollWidth = window.getScrollWidth();

	Returns:
		(number) The scroll width of the browser window.

	Example:
		[javascript]
			window.addEvent('resize', function(){
				alert(window.getScrollWidth());
			});
		[/javascript]

	Note:
		This value is equal to or bigger than <window.getWidth>.

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.scrollWidth>
	*/

	getScrollWidth: function(){
		if (Browser.Engine.trident) return Math.max(this.document.documentElement.offsetWidth, this.document.documentElement.scrollWidth);
		if (Browser.Engine.webkit) return this.document.body.scrollWidth;
		return this.document.documentElement.scrollWidth;
	},

	/*
	Property: getScrollHeight
		Returns an integer representing the scrollHeight of the window.

	Syntax:
		>var scrollHeight = window.getScrollHeight();

	Returns:
		(number) The scroll height of the browser window.

	Example:
		[javascript]
			window.addEvent('resize', function(){
				alert(window.getScrollHeight());
			});
		[/javascript]

	Note:
		This value is equal to or bigger than <window.getHeight>.

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.scrollHeight>
	*/

	getScrollHeight: function(){
		if (Browser.Engine.trident) return Math.max(this.document.documentElement.offsetHeight, this.document.documentElement.scrollHeight);
		if (Browser.Engine.webkit) return this.document.body.scrollHeight;
		return this.document.documentElement.scrollHeight;
	},

	/*
	Property: getScrollLeft
		Returns an integer representing the scrollLeft of the window.

	Syntax:
		>var scrollLeft = window.getScrollLeft();

	Returns:
		(number) The number of pixels the window has scrolled from the left.

	Example:
		[javascript]
			window.addEvent('scroll', function(){
				alert(window.getScrollLeft());
			});
		[/javascript]

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.scrollLeft>
	*/

	getScrollLeft: function(){
		return this.pageXOffset || this.document.documentElement.scrollLeft;
	},

	/*
	Property: getScrollTop
		Returns an integer representing the scrollTop of the window.

	Syntax:
		>var scrollTop = window.getScrollTop();

	Returns:
		(number) The number of pixels the window has scrolled from the top.

	Example:
		[javascript]
			window.addEvent('scroll', function(){
				alert(window.getScrollTop());
			});
		[/javascript]

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.scrollTop>
	*/

	getScrollTop: function(){
		return this.pageYOffset || this.document.documentElement.scrollTop;
	},

	/*
	Property: getSize
		Same as <Element.getSize>, but for window.

	Syntax:
		>var size = window.getSize();

	Returns:
		(object) An object with size, scrollSize, scroll properties. Each property has a value of an object with x and y properties representing the width/height, scrollWidth/scrollHeight, or getScrollLeft/getScrollTop.

	Example:
		[javascript]
			var size = window.getSize();
		[/javascript]
	*/

	getSize: function(){
		var width = this.getWidth();
		var height = this.getHeight();
		return {
			'size': {'x': width, 'y': height},
			'scrollSize': {'x': this.getScrollWidth(), 'y': this.getScrollHeight()},
			'scroll': {'x': this.getScrollLeft(), 'y': this.getScrollTop()},
			'clientSize': {'x': width, 'y': height}
		};
	},

	getPosition: function(){
		return {'x': 0, 'y': 0};
	}

});