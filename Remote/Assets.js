/*
Script: Assets.js
	provides dynamic loading for images, css and javascript files.

Authors:
	- Valerio Proietti, <http://mad4milk.net>
	- Fredrik Branstrom <http://fredrik.branstrom.name>
	- Yaroslaff Fedin <http://inviz.ru>

License:
	MIT-style license.
*/

var Asset = {

	/*
	Property: javascript
		injects into the page a javascript file.

	Arguments:
		source - the path of the javascript file
		properties - some additional attributes you might want to add to the script element

	Example:
		> new Asset.javascript('/scripts/myScript.js', {id: 'myScript'});
	*/

	javascript: function(source, properties){
		return Asset.create('script', {
			'type': 'text/javascript', 'src': source
		}, properties, true);
	},

	/*
	Property: css
		injects into the page a css file.

	Arguments:
		source - the path of the css file
		properties - some additional attributes you might want to add to the link element

	Example:
		> new Asset.css('/css/myStyle.css', {id: 'myStyle', title: 'myStyle'});
	*/

	css: function(source, properties){
		return Asset.create('link', {
			'rel': 'stylesheet', 'media': 'screen', 'type': 'text/css', 'href': source
		}, properties, true);
	},

	/*
	Property: image
		Preloads an image and returns the img element. does not inject it to the page.

	Arguments:
		source - the path of the image file
		properties - some additional attributes you might want to add to the img element

	Example:
		> new Asset.image('/images/myImage.png', {id: 'myImage', title: 'myImage', onload: myFunction});

	Returns:
		the img element. you can inject it anywhere you want with <Element.injectInside>/<Element.injectAfter>/<Element.injectBefore>
	*/

	image: function(source, properties){
		properties = Object.extend({
			'src': source,
			'onload': Class.empty,
			'onabort': Class.empty,
			'onerror': Class.empty
		}, properties || {});
		var image = new Image();
		image.onload = function(){
			if (arguments.callee.done) return false;
			arguments.callee.done = true;
			this.onload = null;
			return properties.onload.call(this);
		};
		image.onerror = properties.onerror;
		image.onabort = properties.onabort;
		image.src = properties.src;
		return Asset.create('img', properties);
	},

	/*
	Property: images
		Preloads an array of images (as strings) and returns an array of img elements. does not inject them to the page.

	Arguments:
		sources - array, the paths of the image files
		options - object, see below

	Options:
		onComplete - a function to execute when all image files are loaded in the browser's cache
		onProgress - a function to execute when one image file is loaded in the browser's cache

	Example:
		(start code)
		new Asset.images(['/images/myImage.png', '/images/myImage2.gif'], {
			onComplete: function(){
				alert('all images loaded!');
			}
		});
		(end)

	Returns:
		the img element. you can inject it anywhere you want with <Element.injectInside>/<Element.injectAfter>/<Element.injectBefore>
	*/

	images: function(sources, options){
		options = Object.extend({
			onComplete: Class.empty,
			onProgress: Class.empty
		}, options || {});
		if (!sources.push) sources = [sources];
		var images = [];
		counter = 0;
		sources.each(function(source){
			var img = new Asset.image(source, {
				'onload': function(){
					counter++;
					options.onProgress();
					if (counter == sources.length) options.onComplete();
				}
			});
			images.push(img);
		});
		return images;
	},

	create: function(type, defaults, properties, inject){
		Object.extend(defaults, properties || {});
		var element = new Element(type).setProperties(defaults);
		if (inject) element.injectInside($$('head')[0]);
		return element;
	}

};