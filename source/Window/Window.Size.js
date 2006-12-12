/*
Script: Window.Size.js
	Window cross-browser dimensions methods.

License:
	MIT-style license.
*/

/*
Class: window
	Cross browser methods to get the window size, onDomReady method.
*/

window.extend({

	/*
	Property: getWidth
		Returns an integer representing the width of the browser.
	*/

	getWidth: function(){
		if (this.khtml || this.opera) return this.innerWidth;
		else return document.documentElement.clientWidth || document.body.clientWidth;
	},

	/*
	Property: getHeight
		Returns an integer representing the height of the browser.
	*/

	getHeight: function(){
		if (this.khtml || this.opera) return this.innerHeight;
		return document.documentElement.clientHeight || document.body.clientHeight;
	},

	/*
	Property: getScrollHeight
		Returns an integer representing the scrollHeight of the window.

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.scrollHeight>
	*/

	getScrollHeight: function(){
		return document.documentElement.scrollHeight;
	},

	/*
	Property: getScrollWidth
		Returns an integer representing the scrollWidth of the window.

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.scrollWidth>
	*/

	getScrollWidth: function(){
		return document.documentElement.scrollWidth;
	},

	/*
	Property: getScrollTop
		Returns an integer representing the scrollTop of the window (the number of pixels the window has scrolled from the top).

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.scrollTop>
	*/

	getScrollTop: function(){
		return this.pageYOffset || document.documentElement.scrollTop;
	},

	/*
	Property: getScrollLeft
		Returns an integer representing the scrollLeft of the window (the number of pixels the window has scrolled from the left).

	See Also:
		<http://developer.mozilla.org/en/docs/DOM:element.scrollLeft>
	*/

	getScrollLeft: function(){
		return this.pageXOffset || document.documentElement.scrollLeft;
	},

	/*
	Property: getSize
		Same as <Element.getSize>
	*/

	getSize: function(){
		return {
			'scroll': {'x': this.getScrollLeft(), 'y': this.getScrollTop()},
			'size': {'x': this.getWidth(), 'y': this.getHeight()},
			'scrollSize': {'x': this.getScrollWidth(), 'y': this.getScrollHeight()}
		};
	},

	//ignore
	getOffsets: function(){return {'x': 0, 'y': 0}}

});