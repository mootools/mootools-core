Hash: Assets {#Assets}
=======================

Provides methods for the dynamic loading and management of JavaScript, CSS, and image files.



Assets Method: javascript {#Assets:javascript}
----------------------------------------------

Injects a script tag into the head section of the document, pointing to the src specified.

###	Syntax:

	var myScript = Asset.javascript(source[, properties]);

###	Arguments:

1. source     - (*string*) The location of the JavaScript file to load.
2. properties - (*object*, optional) Additional attributes to be included into the script Element.

###	Returns:

* (*element*) A new script Element.

###	Examples:

	var myScript = new Asset.javascript('/scripts/myScript.js', {id: 'myScript'});



Assets Method: css {#Assets:css}
--------------------------------

Injects a css file in the page.

###	Syntax:

	var myCSS = new Asset.css(source[, properties]);

###	Arguments:

1. source     - (*string*) The path of the CSS file.
2. properties - (*object*) Some additional attributes you might want to add to the link Element.

###	Returns:

* (*element*) A new link Element.

###	Examples:

	var myCSS = new Asset.css('/css/myStyle.css', {id: 'myStyle', title: 'myStyle'});



Assets Method: image {#Assets:image}
------------------------------------

Preloads an image and returns the img element.

###	Syntax:

	var myImage = new Asset.image(source[, properties]);

###	Arguments:

1. source     - (*string*) The path of the image file.
2. properties - (*object*) Some additional attributes you might want to add to the img Element including the onload/onerror/onabout events.

###	Returns:

* (*element*) A new HTML img Element.

###	Examples:

	var myImage = new Asset.image('/images/myImage.png', {id: 'myImage', title: 'myImage', onload: myFunction});

###	Notes:

- Does not inject the image into the page.
- WARNING: DO NOT use addEvent for load/error/abort on the returned element, give them as onload/onerror/onabort in the properties argument.



Assets Method: images {#Assets:images}
--------------------------------------

Preloads an array of images (as strings) and returns an array of img elements. does not inject them to the page.

###	Syntax:

	var myImages = new Asset.images(source[, options]);

###	Arguments:

1. sources - (*mixed*) An array or a string, of the paths of the image files.
2. options - (*object*, optional) See below.

## Options:

### onComplete

* (*function*) Executes when all image files are loaded.

#### Signature:

	onComplete()

### onProgress

* (*function*) Executes when one image file is loaded.

#### Signature:

	onProgress(counter, index)

#### Arguments:

1. counter - (*number*) The number of loaded images.
2. index   - (*number*) The index of the loaded image.

#### Returns:

* (*array*) An [Elements][] collection.

#### Examples:

	var myImages = new Asset.images(['/images/myImage.png', '/images/myImage2.gif'], {
		onComplete: function(){
			alert('All images loaded!');
		}
	});



[Elements]: /Element/Element#Elements