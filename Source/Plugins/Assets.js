/*
Script: Assets.js
	Contains the <Asset> class, which provides methods to dynamically load JavaScript, CSS, and image files into the document.

License:
	MIT-style license.
*/

/*
Hash: Asset
	Provides methods for the dynamic loading and management of JavaScript, CSS, and image files.
*/

var Asset = new Hash({

	/*
	Method: javascript
		Injects a script tag into the head section of the document, pointing to the src specified.

	Syntax:
		>var myScript = Asset.javascript(source[, properties]);

	Arguments:
		source     - (string) The location of the JavaScript file to load.
		properties - (object, optional) Additional attributes to be included into the script Element.

	Returns:
		(element) A new script Element.

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
		return script.set('properties', properties).inject(document.head);
	},

	/*
	Method: css
		Injects a css file in the page.

	Syntax:
		>var myCSS = new Asset.css(source[, properties]);

	Arguments:
		source     - (string) The path of the CSS file.
		properties - (object) Some additional attributes you might want to add to the link Element.

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
		Preloads an image and returns the img element.

	Syntax:
		>var myImage = new Asset.image(source[, properties]);

	Arguments:
		source     - (string) The path of the image file.
		properties - (object) Some additional attributes you might want to add to the img Element including the onload/onerror/onabout events.

	Returns:
		(element) A new HTML img Element.

	Example:
		[javascript]
			var myImage = new Asset.image('/images/myImage.png', {id: 'myImage', title: 'myImage', onload: myFunction});
		[/javascript]

	Note:
		- Does not inject the image into the page.
		- DO NOT use addEvent for load/error/abort on the returned element, give them as onload/onerror/onabort in the properties argument.
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
			};
		});
		image.src = element.src = source;
		if (image && image.complete) image.onload.delay(1);
		return element.set('properties', properties);
	},

	/*
	Method: images
		Preloads an array of images (as strings) and returns an array of img elements. does not inject them to the page.

	Syntax:
		>var myImages = new Asset.images(source[, options]);

	Arguments:
		sources - (mixed) An array or a string, of the paths of the image files.
		options - (object, optional) See below.

		options (continued):
			onComplete - (function) Executes when all image files are loaded.
				Signature:
					>onComplete()

			onProgress - (function) Executes when one image file is loaded.
				Signature:
					>onProgress(counter, index)

				Arguments:
					counter - (number) The number of loaded images.
					index   - (number) The index of the loaded image.

	Returns:
		(array) An <Elements> collection.

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
