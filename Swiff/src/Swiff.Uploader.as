import flash.external.*;
import flash.net.FileReferenceList;
import flash.net.FileReference;

/**
 * FancyUpload
 *
 * @version		1.0
 * 
 * @license		MIT License
 * 
 * @author		Harald Kirschner <mail [at] digitarald [dot] de>
 * @author		Valerio Proietti, <http://mad4milk.net>
 * @copyright	Authors
 */

var instances:Array = new Array();

var allowed:Boolean = true;
var timer:Boolean = false;

function allow(){
	allowed = true;
	timer = false;
}

function create(index, types:Object, multiple:Boolean, queued:Boolean, url:String){
	instances[index] = new Object();
	instances[index].multiple = (multiple == true);
	instances[index].queued = (instances[index].multiple && queued == true);
	instances[index].url = url ? url : null;

	if (instances[index].multiple){
		instances[index].list = new FileReferenceList();
		instances[index].fileReference = new FileReferenceList();
	} else instances[index].fileReference = new FileReference();

	var target:String = 'Swiff.callBacks.' + index;

	if (!types) instances[index].typelist = null
	else {
		instances[index].typelist = new Array();
		for (var p:String in types){
			var type:Object = new Object();
			type.description = p;
			type.extension = types[p];
			instances[index].typelist.push(type);
		}
	}

	var listener:Object = new Object();

	listener.onProgress = function(file:FileReference, bytesLoaded:Number, bytesTotal:Number):Void {
		if (!allowed) return;
		allowed = false;
		ExternalInterface.call(target + '.onProgress', file.name, bytesLoaded, bytesTotal, Math.ceil(bytesLoaded/bytesTotal*100));
		if (timer) return;
		timer = setTimeout(allow, 200);
	};

	listener.onComplete = function(file:FileReference):Void {
		finishFile(index, file.name, file.size);
		ExternalInterface.call(target + '.onComplete', file.name, file.size);
	};

	listener.onOpen = function(file:FileReference):Void {
		ExternalInterface.call(target + '.onOpen', file.name, file.size);
	};

	listener.onCancel = function():Void {
		ExternalInterface.call(target + '.onCancel');
	};

	listener.onSelect = function(args){
		if (instances[index].multiple){
			var list:Array = args.fileList;
			for (var i:Number = 0; i < list.length; i++){
				if (ExternalInterface.call(target + '.onSelect', list[i].name, list[i].size) == false){
					list.splice(i, 1);
					continue;
				}
				list[i].addListener(instances[index].listener);
				instances[index].list.fileList.push(list[i]);
			}
		} else ExternalInterface.call(target + '.onSelect', args.name, args.size);
	};

	listener.onHTTPError = function(file:FileReference, httpError:Number):Void {
		finishFile(index, file.name, file.size);
		ExternalInterface.call(target + '.onError', file.name, file.size, httpError);
	};

	listener.onIOError = function(file:FileReference):Void {
		finishFile(index, file.name, file.size);
		ExternalInterface.call(target + '.onError', file.name, file.size, 'Read/Write Error');
	};

	listener.onSecurityError = function(file:FileReference, errorString:String):Void {
		finishFile(index, file.name, file.size);
		ExternalInterface.call(target + '.onError', file.name, file.size, errorString);
	};

	instances[index].fileReference.addListener(listener);
	if (instances[index].multiple){
		instances[index].listener = listener;
		instances[index].list.addListener(listener);
	}
};

//----------------------------------------------------------------------------------------------------------//

function browse(index:String):Void {
	if (instances[index].typelist) instances[index].fileReference.browse(instances[index].typelist)
	else instances[index].fileReference.browse();
};

function upload(index:String, url:String):Void {
	if (url) instances[index].url = url;
	else url = instances[index].url;
	if (instances[index].multiple){
		var list:Array = instances[index].list.fileList;
		if (!list.length) return;
		if (instances[index].queued) list[0].upload(url);
		else for (var i:Number = 0; i < list.length; i++) list[i].upload(url);
	}
	else instances[index].fileReference.upload(url);
};

function filelist(index:String):Array {
	var rs:Array = new Array();
	if (instances[index].multiple){
		var list:Array = instances[index].list.fileList;
		for (var i:Number = 0; i < list.length; i++) rs.push(new Array(list[i].name, list[i].size));
	} else rs.push(new Array(instances[index].fileReference.name, instances[index].fileReference.size));
	return rs;
};

function remove(index:String, name:String, size:Number):Void {
	if (instances[index].multiple){
		var num:Number = fileIndex(index, name, size);
		if (instances[index].list.fileList[num]){
			instances[index].list.fileList[num].cancel();
			instances[index].list.fileList.splice(num, 1);
		}
	} else instances[index].fileReference.cancel();
};

function fileIndex(index:String, name:String, size:Number):Number {
	if (instances[index].multiple){
		var list:Array = instances[index].list.fileList;
		for (var i:Number = 0; i < list.length; i++) if (list[i].name == name && list[i].size == size) return i;
	} else if (instances[index].fileReference.name == name && instances[index].fileReference.size == size) return 0;
	return -1;
};

// Helper

function finishFile(index:String, name:String, size:Number):Void {
	if (!instances[index].multiple) return;
	remove(index, name, size);
	if (instances[index].queued) upload(index);
};


ExternalInterface.addCallback("browse", this, browse);
ExternalInterface.addCallback("upload", this, upload);
ExternalInterface.addCallback("create", this, create);
ExternalInterface.addCallback("fileList", this, fileList);
ExternalInterface.addCallback("remove", this, remove);
ExternalInterface.addCallback("fileIndex", this, fileIndex);
ExternalInterface.call(onLoad);