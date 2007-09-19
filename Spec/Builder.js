var Builder = {

	include: function(path){
		document.write('\n\t<script type="text/javascript" src="' + path + '.js"></script>');
	},
	
	includeSpecFolder: function(folder){
		var scripts = this.scripts.spec[folder];
		for (var i = 0, l = scripts.length; i < l; i++) this.include(this.paths.spec + folder + '/' + scripts[i]);
	},

	build: function(build){
		var path = this.paths[build];
		var scripts = this.scripts[build];
		for (var folder in scripts){
			for (var i = 0, l = scripts[folder].length; i < l; i++) this.include(path + folder + '/' + scripts[folder][i]);
		}
	},

	paths: {
		source: '../Source/',
		spec: '../Spec/'
	},

	scripts: {
		source: {
			"Core"      : ["Core"],
			"Class"     : ["Class", "Class.Extras"],
			"Native"    : ["Array", "String", "Function", "Number", "Hash"],
			"Element"   : ["Element", "Element.Style", "Element.Event", "Element.Filters", "Element.Dimensions", "Element.Form", "Element.Visibility"],
			"Selectors" : ["Selectors", "Selectors.Pseudo", "Selectors.Pseudo.Children"],
			"Window"    : ["Window.DomReady", "Window.Size"],
			"Effects"   : ["Fx", "Fx.CSS", "Fx.Elements", "Fx.Style", "Fx.Styles", "Fx.Morph", "Fx.Scroll", "Fx.Slide", "Fx.Transitions"],
			"Drag"      : ["Drag", "Drag.Move"],
			"Remote"    : ["XHR", "Ajax", "Cookie", "Json", "Json.Remote", "Assets"],
			"Plugins"   : ["Accordion", "Color", "Group", "Hash.Cookie", "Scroller", "Slider", "SmoothScroll", "Sortables", "Tips"]
		},

		spec: {
			"Core"      : ["Core"]
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
	
	includeRequest: function(){
		var req = this.getRequest();
		if (!req.specs) return;
		var specs = req.specs.split('+');
		for (var i = 0, l = specs.length; i < l; i++) this.includeSpecFolder(specs[i]);
	}

};

Builder.build('source');
Builder.includeRequest();