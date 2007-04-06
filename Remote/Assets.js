/*
Script: Assets.js
	provides dynamic loading for images, css and javascript files.

License:
	MIT-style license.
*/

var Asset = new Abstract({

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
		properties - additional attributes for the img element (like second parameter for Element.initialize with additional support for onload/onerror/onabort)

	Example:
		> new Asset.image('/images/myImage.png', {id: 'myImage', title: 'myImage', onload: myFunction});

	Returns:
		the img element. you can inject it anywhere you want with <Element.injectInside>/<Element.injectAfter>/<Element.injectBefore>
	*/

	image: function(source, properties){
		properties = $merge({
			src: source,
			'onload': Class.empty,
			'onabort': Class.empty,
			'onerror': Class.empty
		}, properties);
		var img = new Image();
		var el;
		var handle = function(fn, evt){
			if (evt == 'load' && !img.width) img.onerror();
			else {
				img.onload = img.onabort = img.onerror = null;
				fn.call(el);
			}
		};
		['load', 'abort', 'error'].each(function(evt){
			var key = 'on' + evt;
			img[key] = handle.pass(properties[key], evt);
			delete properties[key];
		});
		img.src = properties.src;
		return (el = Asset.create('img', properties));
	},

	/*
	Property: images
		Preloads an array of images (as strings) and returns an array of img elements. does not inject them to the page.

	Arguments:
		sources - array, the paths of the image files
		options - object, see below

	Options:
		onComplete - a function to execute when all image files are loaded in the browser's cache
		onProgress - a function to execute when one image file is successfully loaded in the browser's cache, first argument is the image index
		onFailure - a function to execute when image-loading failed, is called then instead of onProgress, first argument is the image index

	Example:
		(start code)
		new Asset.images(['/images/myImage.png', '/images/myImage2.gif'], {
			onComplete: function(){
				alert('all images loaded!');
			}
		});
		(end)

	Returns:
		the img elements as $$. you can inject them anywhere you want with <Element.injectInside>/<Element.injectAfter>/<Element.injectBefore>
	*/

	images: function(sources, options){
		options = $merge({
			onComplete: Class.empty,
			onFailure: Class.empty,
			onProgress: Class.empty
		}, options);
		if (!sources.push) sources = [sources];
		var images = [];
		var counter = 0;
		var success = function(failed){
			options[failed ? 'onFailure' : 'onProgress'].call(this, counter);
			counter++;
			if (counter == sources.length) options.onComplete();
		};
		var failure = success.pass(true);
		sources.each(function(source){
			images.push(Asset.image(source, {
				'onload': success,
				'onerror': failure,
				'onabort': failure
			}));
		});
		return $extend(images, new Elements);
	},

	create: function(type, defaults, properties, inject){
		var element = new Element(type, $merge(defaults, properties));
		if (inject) element.injectInside($$('head')[0]);
		return element;
	}

});