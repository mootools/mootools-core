/*
Script: Swiff.Uploader.js
	Contains <Swiff.Uploader>

Author:
	Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.
*/

/*
Class: Swiff.Uploader
	creates an uploader instance. Requires an existing Swiff.Uploader.swf instance.

Arguments:
	object - the flash object to atatch the uploader instance to.
	callBacks - an object, containing key/value pairs, representing the possible callbacks. See below.

callBacks:
	open - a function to fire when the user opens a file.
	progress - a function to fire when the file is uploading. passes the name, the current uploaded size and the full size.
	select - a function to fire when the user selects a file.
	complete - a function to fire when the file finishes uploading
	error - a function to fire when there is an error.
	cancel - a function to fire when the user cancels the file uploading.
*/

Swiff.Uploader = new Class({

	setCallBacks: function(callBacks){
		this.callBacks = Object.extend({
			open: Class.empty,
			progress: Class.empty,
			select: Class.empty,
			complete: Class.empty,
			error: Class.empty,
			cancel: Class.empty
		}, callBacks || {});
	},

	setOptions: function(options){
		this.options = Object.extend({
			serverScript: 'upload.php',
			fileTypes: []
		}, options || {});
	},

	initialize: function(object, options, callBacks){
		this.object = object;
		this.setOptions(options);
		this.setCallBacks(callBacks);
		this.instance = 'Swiff'+Swiff.count++;
		var ins = Swiff.callBacks[this.instance] = {};
		for (var p in this.callBacks) ins[p] = this.callBacks[p].bind(this);
		Swiff.remote(this.object, 'create', this.instance);
	},

	browse: function(){
		Swiff.remote(this.object, 'browse', this.instance, this.options.fileTypes);
	},

	send: function(){
		Swiff.remote(this.object, 'upload', this.instance, this.options.serverScript);
	}

});