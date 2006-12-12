import flash.external.*;
import flash.net.FileReference;

//----------------------------------------------------------------------------------------------------------//

function init(){

	ExternalInterface.addCallback("browse", this, browse);

	ExternalInterface.addCallback("upload", this, upload);

	ExternalInterface.addCallback("create", this, create);

	ExternalInterface.call(onLoad);

};

//----------------------------------------------------------------------------------------------------------//

var instances = new Object();

//----------------------------------------------------------------------------------------------------------//

var allowed = true;

var timer = false;

function allow(){
	allowed = true;
	timer = false;
}

function create(ins){

	var instance = instances[ins] = new Object();

	var fileReference = instance['fileReference'] = new FileReference();

	var listener = instance['listener'] = new Object();

	var i = 'Swiff.callBacks.'+ins;

	listener.onProgress = function(file, bytes, total){

		if (!allowed) return;
		allowed = false;

		var percentage = bytes/total*100;

		ExternalInterface.call(i+'.progress', file.name, bytes, total, percentage);

		if (timer) return;
		timer = setTimeout(allow, 500);
	};

	listener.onComplete = function(file){
		ExternalInterface.call(i+'.complete', file.name, file.size);
	};

	listener.onOpen = function(file){
		ExternalInterface.call(i+'.open', file.name, file.size);
	};

	listener.onCancel = function(file){
		ExternalInterface.call(i+'.cancel');
	};

	listener.onSelect = function(file){
		ExternalInterface.call(i+'.select');
	};

	listener.onHTTPError = function(file, error){
		ExternalInterface.call(i+'.error', file.name, error);
	};

	listener.onIOError = function(file){
		ExternalInterface.call(i+'.error', file.name, 'Read/Write Error');
	};

	listener.onSecurityError = function(file, error){
		ExternalInterface.call(i+'.error', file.name, error);
	};

	fileReference.addListener(listener);

};

//----------------------------------------------------------------------------------------------------------//

function browse(ins){
	var chk = instances[ins]['fileReference'].browse();
};

function upload(ins, serverScript){
	var chk = instances[ins]['fileReference'].upload(serverScript);
};

//----------------------------------------------------------------------------------------------------------//

init();