/*
Script: StyleSheet.js
	StyleSheet creation and manipulation Class.

License:
	MIT-style license.
*/

var StyleSheet = new Native({
	
	name: 'StyleSheet',
	
	generics: false,
	
	initialize: function(){
		var params = Array.link(arguments, {properties: Object.type, document: Document.type, styleSheet: $defined});
		var doc = params.document || document;
		var style = $(params.styleSheet || null);
		style = style || doc.newElement('style', $extend(params.properties || {}, {type: 'text/css', rel: 'stylesheet'})).inject(doc.head);
		if (!style.sheet) style.sheet = style.styleSheet;
		return $extend(style, this);
	}

});


StyleSheet.implement({
	
	setRule: function(selector, rules, index){
		var sheet = this.sheet;
		index = $chk(index) ? index : (sheet.cssRules || sheet.rules).length;
		var rulesText = '';
		Hash.each(rules, function(value, key){
			
			if (key == 'opacity'){
				if (Browser.Engine.trident){
					key = 'filter';
					value = (value == 1) ? '' : 'alpha(opacity=' + value * 100 + ')';
				}
			} else {
				if ($type(value) != 'string'){
					var map = (Element.Styles.get(key.camelCase()) || '@').split(' ');
					value = $splat(value).map(function(val, i){
						if (!map[i]) return '';
						return ($type(val) == 'number') ? map[i].replace('@', Math.round(val)) : val;
					}).join(' ');
				} else if (value == String(Number(value))){
					value = Math.round(value);
				}
			}

			rulesText += key + ':' + value + ';';
		});
		if (sheet.insertRule) sheet.insertRule(selector + '{' + rulesText + '}', index);
		else if (sheet.addRule) sheet.addRule(selector, rulesText, index);
		return this;
	},
	
	eraseRule: function(index){
		var sheet = this.sheet;
		index = $chk(index) ? index : ((sheet.cssRules || sheet.rules).length || 1) - 1;
		if (sheet.deleteRule) sheet.deleteRule(index);
		else if (sheet.removeRule) sheet.removeRule(index);
		return this;
	}
	
});

Fx.StyleSheet = new Class({
	
	Extends: Fx.CSS,
	
	initialize: function(selector, options){
		this.styleSheet = new StyleSheet();
		this.selector = selector;
		arguments.callee.parent(options);
	},
	
	set: function(now){
		var parsed = {};
		for (var p in now) parsed[p] = this.serve(now[p], this.options.unit);
		this.styleSheet.setRule(this.selector, parsed);
		return this;
	},

	compute: function(from, to, delta){
		var now = {};
		for (var p in from) now[p] = arguments.callee.parent(from[p], to[p], delta);
		return now;
	},
	
	start: function(properties){
		if (!this.check(properties)) return this;
		var from = {}, to = {};
		for (var p in properties){
			from[p] = this.parse(properties[p][0]);
			to[p] = this.parse(properties[p][1]);
		}
		return arguments.callee.parent(from, to);
	}
	
});