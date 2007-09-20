var Builder = {
	
	includeType: function(type){
		for (var folder in this.scripts[type]) this.includeFolder(type, folder);
	},
	
	includeFolder: function(type, folder){
		var scripts = this.scripts[type][folder];
		for (var i = 0, l = scripts.length; i < l; i++) this.includeFile(type, folder, scripts[i]);
	},
	
	includeFile: function(type, folder, file){
		folder = folder || this.getFolder(type, file);
		if (!folder) return false;
		this.included[type][folder] = this.included[type][folder] || [];
		var files = this.included[type][folder];
		for (var i = 0; i < files.length; i++){
			if (files[i] == file) return false;
		}
		this.included[type][folder].push(file);
		return document.write('\n\t<script type="text/javascript" src="' + this.paths[type] + '/' + folder + '/' + file + '.js"></script>');
	},
	
	getFolder: function(type, file){
		var scripts = this.scripts[type];
		for (var folder in scripts){
			for (var i = 0; i < scripts[folder].length; i++){
				var script = scripts[folder][i];
				if (script == file) return folder;
			}
		}
		return false;
	},
	
	paths: {
		source: '../Source',
		spec: '../Spec'
	},
	
	included: {
		source: {},
		spec: {}
	},

	scripts: {
		source: {
			"Core"      : ["Core"],
			"Native"    : ["Array", "String", "Function", "Number", "Hash"],
			"Class"     : ["Class", "Class.Extras"],
			"Element"   : ["Element", "Element.Style", "Element.Event", "Element.Filters", "Element.Dimensions", "Element.Form", "Element.Visibility"],
			"Selectors" : ["Selectors", "Selectors.Pseudo", "Selectors.Pseudo.Children"],
			"Window"    : ["Window.DomReady", "Window.Size"],
			"Effects"   : ["Fx", "Fx.CSS", "Fx.Elements", "Fx.Style", "Fx.Styles", "Fx.Morph", "Fx.Scroll", "Fx.Slide", "Fx.Transitions"],
			"Drag"      : ["Drag", "Drag.Move"],
			"Remote"    : ["XHR", "Ajax", "Cookie", "Json", "Json.Remote", "Assets"],
			"Plugins"   : ["Accordion", "Color", "Group", "Hash.Cookie", "Scroller", "Slider", "SmoothScroll", "Sortables", "Tips"]
		},

		spec: {
			"Core"      : ["Core"],
			"Native"    : ["Array"],
			"Class"     : []
		}
	},
	
	getRequest: function(){
		var pairs = window.location.search.substring(1).split('&');
		var obj = {};
		for (var i = 0, l = pairs.length; i < l; i++){
			var pair = pairs[i].split('=');
			obj[pair[0]] = pair[1];
		}
		return obj;
	},
	
	includeRequest: function(type){
		var req = this.getRequest();
		if (!req.files && !req.folders) return false;
		var files = (req.files) ? req.files.split('+') : [];
		var folders = (req.folders) ? req.folders.split('+') : [];
		for (var j = 0; j < files.length; j++) this.includeFile(type, null, files[j]);
		for (var i = 0; i < folders.length; i++) this.includeFolder(type, folders[i]);
		return true;
	}

};

Builder.includeType('source');
if (!Builder.includeRequest('spec')) Builder.includeType('spec');