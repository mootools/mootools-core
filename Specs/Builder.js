/*
Script: Builder.js
	Automatically includes MooTools files right from the project folder.

License:
	MIT-style license.

Note:
	If you use this script in your own page, you must be out of your mind.
*/

var Builder = {

	included: {
		source: {},
		spec: {}
	},

	paths: {
		source: '../Source',
		spec: '../Specs'
	},

	scripts: {
		source: {
			'Core':      ['Core', 'Browser'],
			'Native':    ['Array', 'Function', 'Number', 'String', 'Hash'],
			'Class':     ['Class', 'Class.Extras'],
			'Element':   ['Element', 'Element.Event', 'Element.Style'],
			'Selectors': ['Selectors', 'Selectors.Pseudo'],
			'Fx':        ['Fx', 'Fx.CSS', 'Fx.Tween', 'Fx.Morph', 'Fx.Slide', 'Fx.Scroll', 'Fx.Transitions'],
			'Request':   ['Request', 'Request.HTML', 'Request.JSON'],
			'Utilities': ['JSON', 'Cookie', 'Dimensions', 'Swiff', 'Color', 'Group'],
			'Drag':      ['Drag', 'Drag.Move'],
			'Plugins':   ['Selectors.Children', 'Hash.Cookie', 'Sortables', 'Tips', 'SmoothScroll', 'Slider', 'Scroller', 'Assets', 'Fx.Elements', 'Accordion']
		},

		spec: {
			"Core"      : ["Core", "Browser"],
			"Native"    : ["Array", "String", "Function", "Number", "Hash"],
			"Class"     : ["Class", "Class.Extras"],
			"Element"   : ["Element"],
			"Selectors" : ["Selectors"]
		}
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

	getRequest: function(){
		var pairs = window.location.search.substring(1).split('&');
		var obj = {};
		for (var i = 0, l = pairs.length; i < l; i++){
			var pair = pairs[i].split('=');
			obj[pair[0]] = pair[1];
		}
		return obj;
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

	includeFolder: function(type, folder){
		var scripts = this.scripts[type][folder];
		for (var i = 0, l = scripts.length; i < l; i++) this.includeFile(type, folder, scripts[i]);
	},

	includeType: function(type){
		for (var folder in this.scripts[type]) this.includeFolder(type, folder);
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