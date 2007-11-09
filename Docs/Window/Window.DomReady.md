Window.DomReady
===============

Contains the custom event domready, for window.

Event
-----

### domready

Executes a function when the dom tree is loaded, without waiting for images. Only works when called from window.

### Arguments:

* fn - (function) The function to execute when the DOM is ready.

### Example:

	window.addEvent('domready', function(){
		alert('the dom is ready');
	});

### Credits:

- (c) Dean Edwards/Matthias Miller/John Resig, remastered for MooTools.