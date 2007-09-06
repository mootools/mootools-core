/*
Script: Assets.js
	Contains the <Asset> class, which provides methods to dynamically load JavaScript, CSS, and image files into the document.

License:
	MIT-style license.
*/

/*
Class: Asset
	Provides methods for the dynamic loading and management of JavaScript, CSS, and image files.
*/

var Asset = new Abstract({

	/*
	Method: javascript
		Injects a script tag into the head section of the document, pointing to the src specified.

	Syntax:
		>var myScript = Asset.javascript(source[, properties]);

	Arguments:
		source     - (string) The location of the JavaScript file to be loaded.
		properties - (object, optional) Additional attributes to be included into the script Element. 

	Returns:
		(element) A new script Element.;

	Example:
		[javascript]
			var myScript = new Asset.javascript('/scripts/myScript.js', {id: 'myScript'});
		[/javascript]
	*/

	javascript: function(source, properties){
		properties = $merge({
			'onload': $empty
		}, properties);
		var script = new Element('script', {'src': source, 'type': 'text/javascript'}).addEvents({
			'load': properties.onload,
			'readystatechange': function(){
				if (this.readyState == 'complete') this.fireEvent('load');
			}
		});
		delete properties.onload;
		return script.setProperties(properties).inject(document.head);
	},

	/*
	Method: css
		Creates a new link Element for the inclusion of a CSS stylesheet and injects it into the head section of the document. 

	Syntax:
		>var myCSS = Asset.css(source[, properties]);

	Arguments:
		source     - (string) The path of the CSS file to include.
		properties - (object, optional) Additional attributes to be added to the link Element.

	Returns:
		(element) A new link Element.

	Example:
		[javascript]
			var myCSS = new Asset.css('/css/myStyle.css', {id: 'myStyle', title: 'myStyle'});
		[/javascript]
	*/

	css: function(source, properties){
		return new Element('link', $merge({
			'rel': 'stylesheet', 'media': 'screen', 'type': 'text/css', 'href': source
		}, properties)).inject(document.head);
	},

	/*
	Method: image
		Preloads an image and returns the img Element.  
		
	Syntax:
		>var myImage = Asset.image(source[, properties]);

	Arguments:
		source     - (string) The location of the image file to load. 
		properties - (object, optional) Additional attributes to be added to the image Element.

	Returns:
		(element) A new img Element. 

	Example:
		[javascript]
			var myImage = new Asset.image('/images/myImage.png', {id: 'myImage', title: 'myImage', onload: myFunction});
		[/javascript]

	Note:
		DO NOT use addEvent for load/error/abort on the returned element; give them as onload/onerror/onabort in the properties argument instead.
	*/

	image: function(source, properties){
		properties = $merge({
			'onload': $empty,
			'onabort': $empty,
			'onerror': $empty
		}, properties);
		var image = new Image();
		var element = $(image) || new Element('img');
		['load', 'abort', 'error'].each(function(name){
			var type = 'on' + name;
			var event = properties[type];
			delete properties[type];
			image[type] = function(){
				if (!image) return;
				if (!element.parentNode){
					element.width = image.width;
					element.height = image.height;
				}
				image = image.onload = image.onabort = image.onerror = null;
				event.delay(1, element, element);
				element.fireEvent(name, element, 1);
			}
		});
		image.src = element.src = source;
		if (image && image.complete) image.onload.delay(1);
		return element.setProperties(properties);
	},

	/*
	Property: images
		Preloads an array of images and returns an array of img Elements.
	
	Syntax:
		>var myImages = new Assets.images(sources[, options]);

	Arguments:
		sources - (array) An array of strings representing the location of the image files to be loaded.
		options - (object, optional) See below.

		options (continued):
			onComplete - (function) The function to execute when all image files are loaded into the browser's cache.
			onProgress - (function) The function to execute when one image file is loaded in the browser's cache.

	Returns:
		(array) A new Collection of <Elements>.

	Example:
		[javascript]
			var myImages = new Asset.images(['/images/myImage.png', '/images/myImage2.gif'], {
				onComplete: function(){
					alert('All images loaded!');
				}
			});
		[/javascript]
	*/

	images: function(sources, options){
		options = $merge({
			onComplete: $empty,
			onProgress: $empty
		}, options);
		if (!sources.push) sources = [sources];
		var images = [];
		var counter = 0;
		sources.each(function(source){
			var img = new Asset.image(source, {
				'onload': function(){
					options.onProgress.call(this, counter, sources.indexOf(source));
					counter++;
					if (counter == sources.length) options.onComplete();
				}
			});
			images.push(img);
		});
		return new Elements(images);
	}

});
