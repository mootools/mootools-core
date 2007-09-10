/*
Script: Swiff.Uploader.js
	Contains <Swiff.Uploader>

License:
	MIT-style license.
*/

/*
Class: Swiff.Uploader
	Creates an uploader instance.

Implements:
	<Options>

Syntax:
	>var myUploader = new Swiff.Uploader(callBacks, onLoad[, options]);

Arguments:
	callBacks - (object) An object containing key/value pairs representing the possible callbacks. See below.
	onLoad    - (function) Function that gets called when the SWF file is initialized.
	options   - (object) An options object to customize this Swiff.Uploader. See below.

	callBacks (continued):
		onOpen     - (function) Executes when the user opens a file.
			Signature:
				>onOpen(name, size)

			Arguments:
				name - (string) The name of the file.
				size - (number) The size of the file.

		onProgress - (function) Executes when the file is uploading.
			Signature:
				>onProgress(name, size, fullSize)

			Arguments:
				name     - (string) The name of the current file in progress.
				size     - (number) The total amount uploaded.
				fullSize - (number) The full size of the amount.

		onSelect   - (function) Executes when the user selects a file.
			Signature:
				>onSelect(name, size)

			Arguments:
				name - (string) The name of the file.
				size - (number) The size of the file.

		onComplete - (function) Executes when the file finishes uploading.
			Signature:
				>onComplete(name, size)

			Arguments:
				name - (string) The name of the file.
				size - (number) The size of the file.

		onError    - (function) Executes when there is an error.
			Signature:
				>onError(name, size, error)

			Arguments:
				name  - (string) The name of the file.
				size  - (number) The size of the file.
				error - (number) The error code from the HTTP protocol.

			See Also:
				<http://www.w3.org/Protocols/HTTP/HTRESP.html>

		onCancel   - (function) Executes when the user cancels the file upload.
			Signature:
				>onCancel(name, size)

			Arguments:
				name - (string) The name of the file.
				size - (number) The size of the file.

	options (continued):
		types    - (object: defaults to false) An object with description/filter pairs for file browsing.
		multiple - (boolean: defaults to true) Allow upload of multiple files.
		queued   - (boolean: defaults to true) Queued start for multiple upload.
		swf      - (string: defaults to 'Swf.Uploader.swf') URL to the swf file.
		url      - (string) The default upload URL.

Returns:
	(class) This Swiff.Uploader instance.

Example:
	[javascript]
		var myStatus = $('myStatus');
		var myUpload = new Swiff.Uploader({
			onOpen: function(){
				myStatus.setHTML('opening');
			},
			onSelect: function(){
				this.send();
			}
		}, function(){
			myStatus.setHTML('initialized');
			this.browse();
		},{
			types: {
				'JavaScript files': '*.js'
			}
		});
	[/javascript]

Note:
	- All instances use the first injected swf instance.
	- Absolute URLs are recommended for the options.url.
*/

Swiff.Uploader = new Class({

	Implements: Options,

	options: {
		types: false,
		multiple: true,
		queued: true,
		swf: 'Swf.Uploader.swf',
		url: null,
		container: null
	},

	callBacks: {
		onOpen: $empty,
		onProgress: $empty,
		onSelect: $empty,
		onComplete: $empty,
		onError: $empty,
		onCancel: $empty
	},

	initialize: function(callBacks, onLoad, options){
		if (Swiff.getVersion() < 8) return false;
		this.setOptions(options);
		this.onLoad = onLoad;
		callBacks = $merge(this.callBacks, callBacks || {});
		for (p in callBacks) callBacks[p] = callBacks[p].bind(this);
		this.instance = Swiff.nextInstance();
		Swiff.callBacks[this.instance] = callBacks;
		this.object = Swiff.Uploader.register(this.loaded.bind(this), this.options.swf, this.options.container);
		return this;
	},

	loaded: function(){
		Swiff.remote(this.object, 'create', this.instance, this.options.types, this.options.multiple, this.options.queued, this.options.url);
		this.onLoad.delay(10, this);
	},

	/*
	Method: browse
		Open the file browser.

	Syntax:
		>myUploader.browse();

	Example:
		See <Swiff.Uploader>.
	*/

	browse: function(){
		Swiff.remote(this.object, 'browse', this.instance);
	},

	/*
	Property: send
		Starts the upload of all selected files.

	Syntax:
		>myUploader.send([url]);

	Arguments:
		url - (string, optional) The upload URL.

	Note:
		This method also sets the URL for all the following uploads.
	*/

	send: function(url){
		Swiff.remote(this.object, 'upload', this.instance, url);
	},

	/*
	Property: remove
		For multiple uploads, cancels and removes the given file from queue.

	Syntax:
		>myUploader.remove(name, size);

	Arguments:
		name - (string) The filename of the file.
		size - (string) The filesize of the file.
	*/

	remove: function(name, size){
		Swiff.remote(this.object, 'remove', this.instance, name, size);
	},

	/*
	Property: fileIndex
		Returns the internal index of the given file

	Syntax:
		>var index = myUploader.fileIndex(name, size);

	Arguments:
		name - (string) The filename of the file.
		size - (string) The filesize of the file.

	Returns:
		(number) The index of the file, or -1 if the file is not found.
	*/

	fileIndex: function(name, size){
		return Swiff.remote(this.object, 'fileIndex', this.instance, name, size);
	},

	/*
	Property: fileList
		Returns one Array with with arrays containing name and size of the file.

	Syntax:
		>var info = myUploader.fileList();

	Returns:
		(array) An array with [name, size] items.
	*/

	fileList: function(){
		return Swiff.remote(this.object, 'filelist', this.instance);
	}

});

Swiff.Uploader.factory = $extend;

Swiff.Uploader.factory({

	onLoads: [],

	register: function(onLoad, movie, inject){
		if (!this.object || !this.loaded){
			this.onLoads.push(onLoad);
			if (!this.object) {
				this.object = new Swiff(movie, {
					callBacks: {'onLoad': this.onLoad.create({delay: 10, bind: this})},
					params: {wmode: 'transparent'},
					inject: $(inject) || document.body
				});
			}
		} else {
			onLoad.delay(10);
		}
		return this.object;
	},

	onLoad: function(val){
		this.loaded = true;
		this.onLoads.each(function(fn){
			fn();
		});
		this.onLoads.empty();
	}

});