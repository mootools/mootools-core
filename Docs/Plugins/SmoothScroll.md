Class: SmoothScroll {#SmoothScroll}
===================================

Auto targets all the anchors in a page and display a smooth scrolling effect upon clicking them.

### Note:

- SmoothScroll requires the page to be in [Standards Mode](http://hsivonen.iki.fi/doctype/).

### Extends:

[Fx.Scroll][]

### Syntax:

	var mySmoothScroll = new SmoothScroll([options[, win]]);

### Arguments:

1. options - (*object*, optional) In addition to all the <Fx.Scroll> options, SmoothScroll has links option incase you had a predefined links collection.
2. win     - (*object*, optional) The context of the SmoothScroll.

#### Options:

* links - (*mixed*) A collection of Elements or a string <Selector> of Elements that the SmoothScroll can use.

### Returns:

* (*object*) A new SmoothScroll instance.

### Examples:

	var mySmoothScroll = new SmoothScroll({
		links: '.smoothAnchors',
		wheelStops: false
	});

### See Also:

- [Fx.Scroll][]



[Fx.Scroll]: /Fx/Fx.Scroll