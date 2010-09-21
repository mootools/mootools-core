/*
---
name: Fx.Morph
description: Morph styles of Elements.
requires: [Fx, Element.Style]
provides: Fx.Morph
...
*/

Fx.Morph = new Class({

	Extends: Fx,
	
	Implements: Events,
	
	// onCancel, onPause, onResume, onComplete
	
	initialize: function(element, options){
		this.item = DOM.$(element);
		this.parent(options);
	},
	
	/* public methods */
	
	start: function(data){
		if (!this.check(property, data)) return this;
		var matchColor = /^rgb/, matchUnit = /^[\d.]+[a-zA-Z]+$/, matchFloat = /^[\d.]+$/, matchString = /^\w+$/;
		
		if (typeOf(data) == 'string'){
			data = {};
			data[arguments[0]] = (arguments[2] == null) ? {to: arguments[1]} : {from: arguments[1], to: arguments[2]};
		}
		
		var length = 0;
		this.all = {};
		
		main: for (var style in data){

			var from = null, to = null, camel = style.camelCase(), current = data[style];
			var parse = Element.lookupStyleParser(camel);
			if (!parse) continue;
			
			if (typeOf(current) == 'object'){
				from = current.from; to = current.to;
			} else {
				to = current;
			}

			if (from == null) from = this.item.getStyle(camel);
			var froms = Array.from(parse(from)), tos = Array.from(parse(to));
			if (!froms || !tos) continue;
			
			var units = [];
			
			var l = froms.length;
			if (l != tos.length) continue;
			
			var pFroms = [], pTos = [], pUnits = [];
			
			sub: for (var i = 0; i < l; i++){

				var f = froms[i], t = tos[i], parsed;

				if (f.match(matchColor) && t.match(matchColor)) parsed = this.parseColor(f, t);
				else if (f.match(matchUnit) && t.match(matchUnit)) parsed = this.parseUnit(f, t);
				else if (f.match(matchFloat) && t.match(matchFloat)) parsed = this.parseFloat(f, t);
				else if (f.match(matchString) && t.match(matchString)) parsed = [f, t];
				else continue main; //TODO: don't quit here. Could be a string in a (border) shorthand.
				
				if (parsed == null) continue main; // TODO: this should probably quit, as it means it's either malformed or mismatched.
				if ((parsed[0]).toString() == (parsed[1]).toString()) continue sub;
					
				pFroms.push(parsed[0]);
				pTos.push(parsed[1]);
				pUnits.push(parsed[2] || '');
				
			}
			
			this.all[camel] = {froms: pFroms, tos: pTos, units: pUnits, length: l};
			length++;
			
		}
		
		return (length) ? this.parent() : this;
		
	},
	
	morph: function(selector){
		if (!this.check(selector)) return this;
		var element = $(document).build(selector).setStyles({visibility: 'hidden', position: 'absolute'}).injectAfter(this.item), styles = {};
		DOM.Element.eachStyleParser(function(parser, name){
			if (!parser.shortHand) styles[name] = element.getStyle(name);
		});
		element.eject();
		return this.start(styles);
	},
	
	/* overrides */
	
	'protected render': function(styles){
		this.item.setStyles(styles);
	},
	
	'protected compute': function(delta){
		var styles = {};
		
		for (var style in this.all){
			var current = this.all[style];
			var froms = current.froms, tos = current.tos, length = current.length, units = current.units;
			var results = [];

			main: for (var i = 0; i < length; i++){
				
				var from = froms[i], to = tos[i], unit = units[i], result;
					
				switch (typeOf(from)){
					case 'number': result = Fx.compute(from, to, delta); break;
					case 'string': result = to; break;
					case 'array': result = from.map(function(fj, j){
						var tj = t[j];
						if (fj == tj) return tj;
						return Fx.compute(fj, tj, delta);
					}); break;
					default: continue main; // this should never be anything else other than string, number or array(color).
				}
				
				results.push((unit) ? result + unit : result);
			}
			
			styles[style] = results;
		}
		
		return styles;
	},
	
	/* parsers */
	
	'protected parseColor': function(from, to){
		return [new Color(from).toRGB(true), new Color(to).toRGB(true)];
	},
	
	'protected parseUnit': function(from, to){

		var regexp = /^([\d.]+)(%|px|em|pt)$/, match;
		if (!(match = String(from).match(regexp))) return null;
		from = match.slice(1);
		if (!(match = String(to).match(regexp))) return null;
		to = match.slice(1);
		if (!from[1]) from[1] = 'px';
		if (!to[1]) to[1] = 'px';
		
		if (from[1] == 'px' && to[1] == 'em') from[0] = this.item.PXToEM(from[0]);
		else if (from[1] == 'em' && to[1] == 'px') from[0] = this.item.EMToPX(from[0]);
		else if (from[1] != to[1]) return null;

		return [parseFloat(from[0]), parseFloat(to[0]), to[1]];
	},
	
	'protected parseFloat': function(from, to){
		return [parseFloat(from), parseFloat(to)];
	},
	
	/* events integration */
	
	cancel: function(){
		if (this.parent()) this.fire('cancel', this.item);
		return this;
	},
	
	pause: function(){
		if (this.parent()) this.fire('pause', this.item);
		return this;
	},
	
	resume: function(){
		if (this.parent()) this.fire('resume', this.item);
		return this;
	},
	
	complete: function(){
		if (this.parent()) this.fire('complete', this.item);
		return this;
	},
	
	/* $ */
	
	toElement: function(){
		return this.item;
	}
	
});

DOM.Element.defineSetter('fx', function(options){
	this.get('fx').setOptions(options);
});

DOM.Element.defineGetter('fx', function(){
	return this.$fx || (this.$fx = new Fx.Morph(this));
});

DOM.Element.implement('morph', function(){
	var fx = this.get('fx');
	fx.start.apply(fx, arguments);
	return this;
});
