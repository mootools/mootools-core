var Builder = {

	include: function(path, folder, file) {
		document.writeln('\t<script type="text/javascript" src="' + path + folder + '/' + file + '.js"></script>');
	},

	build: function(build) {
		var path = this.paths[build], scripts = this.scripts[build];
		for(var folder in scripts){
			for(var i = 0, l = scripts[folder].length; i < l; i++){
				this.include(path, folder, scripts[folder][i]);
			}
		}
	},

	paths: {
		source: '../Source/',
		tests: '../Test/'
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

		tests: {
			"Core"      : ["Core"],
			"Class"     : ["Class", "Class.Extras"],
			"Native"    : ["Array", "String", "Function", "Number"]
		}
	}

};

Builder.build('source');
if(window.Test) Builder.build('tests');
