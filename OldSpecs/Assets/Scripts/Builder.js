/*
Script: Builder.js
	Automatically includes MooTools files right from the project folder.

License:
	MIT-style license.

Note:
	If you use this script in your own page, you must be out of your mind.
*/

var Builder = {
	includeFiles: function(path, files){
		switch(typeof files){
		case 'object':
			if( files.constructor == Array ){
				for(var i=0; i< files.length; i++){
					this.includeJs(path + files[i]);
				}
			}
			else{
				for(key in files){
					this.includeFiles(path + key + '/', files[key]);
				}
			}
		break;
		case 'string':
			this.includeJs(path + files);
		}
	},
	
	includeJs: function(filePath){
		document.writeln('<script type="text/javascript" src="' + filePath + '.js?' + new Date().getTime() + '"><\/script>');
	},
	
	build: function(root, filesTree){
		this.includeFiles(root, filesTree);
	}
};