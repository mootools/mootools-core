/*
Script: Swiff.Uploader.js
	Contains <Swiff.Uploader>

License:
	MIT-style license.
*/

/*
Class: Swiff.Uploader
	Creates an uploader instance.
	All instances use the first injected swf instance

Arguments:
	callBacks - an object, containing key/value pairs, representing the possible callbacks. See below.
	onLoaded - Callback when the swf is initialized
	options - types, multiple, queued, swf, url, container

Options:
	types - (object) description/filter pairs for file browser (e.g. {'Images (*.jpg, *.jpeg, *.gif, *.png)': '*.jpg; *.jpeg; *.gif; *.png'} ), default false
	multiple - (boolean) Allow upload of multiple files, default true.
	queued - (boolean) Queued start for multiple upload, default true.
	swf - (string) URL to the swf file, default 'Swf.Uploader.swf'.
	url - (string) default upload URL, can be overridden in upload. Absolute URLs are recommended.

callBacks:
	onOpen - a function to fire when the user opens a file.
	onProgress - a function to fire when the file is uploading. passes the name, the current uploaded size and the full size.
	onSelect - a function to fire when the user selects a file.
	onComplete - a function to fire when the file finishes uploading
	onError - a function to fire when there is an error.
	onCancel - a function to fire when the user cancels the file uploading.
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
	Property: browse
		Open the file browser.
	*/

	browse: function(){
		Swiff.remote(this.object, 'browse', this.instance);
	},

	/*
	Property: send
		Starts the upload of all selected files.

	Arguments:
		url - (string, optional) Upload URL, sets URL also for all following uploads.
	*/

	send: function(url){
		Swiff.remote(this.object, 'upload', this.instance, url);
	},

	/*
	Property: remove
		For multiple uploads cancels and removes the given file from queue.

	Arguments:
		name - (string) Filename
		name - (string) Filesize in byte
	*/

	remove: function(name, size){
		Swiff.remote(this.object, 'remove', this.instance, name, size);
	},

	/*
	Property: fileIndex
		Returns the internal index of the given file

	Arguments:
		name - (string) Filename
		name - (string) Filesize in byte

	Returns:
		(number) The index of the file or -1 when the file is not found.
	*/

	fileIndex: function(name, size){
		return Swiff.remote(this.object, 'fileIndex', this.instance, name, size);
	},

	/*
	Property: fileList
		Returns one Array with with arrays containing name and size of the file.

	Returns:
		(array) An array with [name, size] items
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
					callBacks: {'onLoad': this.onLoad.create({create: 10, bind: this})},
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