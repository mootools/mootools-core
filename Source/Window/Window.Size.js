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

Window.Get.extend({
	
	/*
	Window Getter: width
		Returns an integer representing the width of the browser window (without the scrollbar).

	Syntax:
		>var width = window.get('width');

	Returns:
		(number) The width (without the scrollbar width) of the browser window.
	*/
	
	width: function(){
		if (Browser.Engine.webkit419) return this.innerWidth;
		if (Browser.Engine.presto) return this.document.body.clientWidth;
		return this.document.documentElement.clientWidth;
	},
	
	/*
	Window Getter: height
		Returns an integer representing the height of the browser window (without the scrollbar).

	Syntax:
		>var height = window.get('height');

	Returns:
		(number) The height (without the scrollbar height) of the browser window.
	*/
	
	height: function(){
		if (Browser.Engine.webkit419) return this.innerHeight;
		if (Browser.Engine.presto) return this.document.body.clientHeight;
		return this.document.documentElement.clientHeight;
	},
	
	/*
	Window Getter: scrollWidth
		Returns an integer representing the scrollWidth of the window.

	Syntax:
		>var scrollWidth = window.get('scrollWidth');

	Returns:
		(number) The scroll width of the browser window.

	Example:
		[javascript]
			window.addEvent('resize', function(){
				alert(window.get('scrollWidth'));
			});
		[/javascript]

	Note:
		This value is equal to or bigger than window.get('width').

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.scrollWidth>
	*/
	
	scrollWidth: function(){
		if (Browser.Engine.trident) return Math.max(this.document.documentElement.offsetWidth, this.document.documentElement.scrollWidth);
		if (Browser.Engine.webkit) return this.document.body.scrollWidth;
		return this.document.documentElement.scrollWidth;
	},
	
	/*
	Window Getter: scrollHeight
		Returns an integer representing the scrollHeight of the window.

	Syntax:
		>var scrollHeight = window.get('scrollHeight');

	Returns:
		(number) The scroll height of the browser window.

	Example:
		[javascript]
			window.addEvent('resize', function(){
				alert(window.get('scrollHeight'));
			});
		[/javascript]

	Note:
		This value is equal to or bigger than window.get('height').

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.scrollHeight>
	*/
	
	scrollHeight: function(){
		if (Browser.Engine.trident) return Math.max(this.document.documentElement.offsetHeight, this.document.documentElement.scrollHeight);
		if (Browser.Engine.webkit) return this.document.body.scrollHeight;
		return this.document.documentElement.scrollHeight;
	},
	
	/*
	Window Getter: scrollLeft
		Returns an integer representing the scrollLeft of the window.

	Syntax:
		>var scrollLeft = window.get('scrollLeft');

	Returns:
		(number) The number of pixels the window has scrolled from the left.

	Example:
		[javascript]
			window.addEvent('scroll', function(){
				alert(window.get('scrollLeft'));
			});
		[/javascript]

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.scrollLeft>
	*/
	
	scrollLeft: function(){
		return this.pageXOffset || this.document.documentElement.scrollLeft;
	},
	
	/*
	Window Getter: scrollTop
		Returns an integer representing the scrollTop of the window.

	Syntax:
		>var scrollTop = window.get('scrollTop');

	Returns:
		(number) The number of pixels the window has scrolled from the top.

	Example:
		[javascript]
			window.addEvent('scroll', function(){
				alert(window.get('scrollTop'));
			});
		[/javascript]

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.scrollTop>
	*/
	
	scrollTop: function(){
		return this.pageYOffset || this.document.documentElement.scrollTop;
	},
	
	/*
	Window Getter: size
		Same as Element Getter for size, but for window.

	Syntax:
		>var size = window.get('size');

	Returns:
		(object) An object with size, scrollSize, scroll properties. Each property has a value of an object with x and y properties representing the width/height, scrollWidth/scrollHeight, or scrollLeft/scrollTop.

	Example:
		[javascript]
			var size = window.get('size');
		[/javascript]
	*/
	
	size: function(){
		var width = this.get('width');
		var height = this.get('height');
		return {
			'offset': {'x': width, 'y': height},
			'scroll': {'x': this.get('scrollWidth'), 'y': this.get('scrollHeight')},
			'client': {'x': width, 'y': height}
		};
	},
	
	scroll: function(){
		return {'x': this.get('scrollLeft'), 'y': this.get('scrollTop')};
	},
	
	position: function(){
		return {'x': 0, 'y': 0};
	}
	
});
