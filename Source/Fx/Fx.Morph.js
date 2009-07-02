/*=
name: Fx.Morph
description: Morph Styles.
requires: Fx.CSS
=*/

Fx.Morph = new Class({

	Extends: Fx,
	
	'protected initialize': function(element, options){
		this.item = document.id(element);
		this.parent(options);
	},
	
	start: function(a, b){
		if (!this.check(a, b)) return this;
		var styles = {};
		if (typeOf(a) == 'string') styles[a] = b;
		else styles = a;
		var all = {}, froms = {}, tos = {}, length = 0;
		for (var style in styles){
			var ss = Array.from(styles[style]);
			var prepared = Fx.CSS.prepare(this.item, style, ss[0], ss[1] || null);
			var camel = prepared[0], shortParser = Element.Style.shorts[camel];
			if (shortParser){
				var fv = shortParser(prepared[1]), tv = shortParser(prepared[2]);
				for (var p in fv) all[p] = [fv[p], tv[p]];
			} else {
				all[camel] = [prepared[1], prepared[2]];
			}
		}
		this.units = {};
		for (var s in all){
			var parsed = Fx.CSS.parse(this.item, s, all[s][0], all[s][1]);
			if (!parsed) continue;
			length++;
			froms[s] = parsed[0];
			tos[s] = parsed[1];
			this.units[s] = parsed[2] || '';
		}
		return (length) ? this.parent(froms, tos) : this.complete();
	},
	
	'protected render': function(now){
		for (var style in now) Fx.CSS.render(this.item, style, now[style], this.units[style]);
	},
	
	'protected compute': function(delta){
		var all = {};
		for (var style in this.from){
			all[style] = Fx.CSS.compute(this.from[style], this.to[style], delta);
		}
		return all;
	},
	
	toElement: function(){
		return this.item;
	}
	
});

Element.defineSetter('fx', function(options){
	this.get('fx').cancel().setOptions(options);
});

Element.defineGetter('fx', function(){
	var fx = this.retrieve('fx');
	if (!fx){
		fx = new Fx.Morph(this, {link: 'cancel'});
		this.store('fx', fx);
	}
	return fx;
});

Element.implement('morph', function(styles){
	this.get('fx').start(styles);
	return this;
});

Element.implement('tween', function(style, from, to){
	this.get('fx').start(style, from, to);
	return this;
});
