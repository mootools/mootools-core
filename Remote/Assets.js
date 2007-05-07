/*
Script: Assets.js
	provides dynamic loading for images, css and javascript files.

License:
	MIT-style license.
*/

var Asset = new Abstract({

	/*
	Property: javascript
		Injects a javascript file in the page.

	Arguments:
		source - the path of the javascript file
		properties - some additional attributes you might want to add to the script element

	Example:
		> new Asset.javascript('/scripts/myScript.js', {id: 'myScript'});
	*/

	javascript: function(source, properties){
		properties = $merge({
			'onload': Class.empty
		}, properties);
		var script = new Element('script', {'src': source}).addEvents({
			'load': properties.onload,
			'readystatechange': function(){
				if (this.readyState == 'complete') this.fireEvent('load');
			}
		});
		delete properties.onload;
		return script.setProperties(properties).inject(document.head);
	},

	/*
	Property: css
		Injects a css file in the page.

	Arguments:
		source - the path of the css file
		properties - some additional attributes you might want to add to the link element

	Example:
		> new Asset.css('/css/myStyle.css', {id: 'myStyle', title: 'myStyle'});
	*/

	css: function(source, properties){
		return new Element('link', $merge({
			'rel': 'stylesheet', 'media': 'screen', 'type': 'text/css', 'href': source
		}, properties)).inject(document.head);
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
		properties = $merge({
			'onload': Class.empty,
			'onabort': Class.empty,
			'onerror': Class.empty
		}, properties);
		var image = new Image();
		image.src = source;
		var element = new Element('img', {'src': source});
		['load', 'abort', 'error'].each(function(type){
			var event = properties['on' + type];
			delete properties['on' + type];
			element.addEvent(type, function(){
				this.removeEvent(type, arguments.callee);
				event.call(this);
			});
		});
		if (image.width && image.height) element.fireEvent('load', element, 1);
		return element.setProperties(properties);
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
		the img elements as $$. you can inject them anywhere you want with <Element.injectInside>/<Element.injectAfter>/<Element.injectBefore>
	*/

	images: function(sources, options){
		options = $merge({
			onComplete: Class.empty,
			onProgress: Class.empty
		}, options);
		if (!sources.push) sources = [sources];
		var images = [];
		var counter = 0;
		sources.each(function(source){
			var img = new Asset.image(source, {
				'onload': function(){
					options.onProgress.call(this, counter);
					counter++;
					if (counter == sources.length) options.onComplete();
				}
			});
			images.push(img);
		});
		return new Elements(images);
	}

});