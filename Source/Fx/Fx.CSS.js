/*
Script: Fx.CSS.js
	Nothing to see here.

License:
	MIT-style license.
*/

Fx.CSS = {

	compute: function(from, to, delta){
		switch (typeof from){
			case 'number': return Fx.compute(from, to, delta);
			case 'string': return to;
			default: return from.map(function(c, i){
				return Fx.compute(c, to[i], delta);
			});
		}
	},
	
	render: function(element, style, value, unit){
		element.setStyle(style, (unit) ? value + unit : value);
	},
	
	prepare: function(element, style, from, to){
		var values = [from, to], camel = style.camelCase();
		if (values[1] == null) values = [element.getStyle(camel), values[0]];
		return [camel, values[0], values[1]];
	},
	
	parse: function(element, style, from, to){
		var type = Element.Style.transitionable[style], array;
		return (!type || from == to || !(array = this['parse' + type.capitalize()](element, style, from, to))) ? null : array;
	},
	
	parseColor: function(element, style, from, to){
		from = new Color(from);
		to = new Color(to);
		return (from.toRGB() == to.toRGB()) ? null : [from.toRGB(true), to.toRGB(true)];
	},
	
	parseUnit: function(element, style, from, to){
		var regexp = /^([\d.]+)(%|\w+)*$/, match;
		if (!(match = String(from).match(regexp))) return null;
		from = match.slice(1);
		if (!(match = String(to).match(regexp))) return null;
		to = match.slice(1);
		if (!from[1]) from[1] = 'px';
		if (!to[1]) to[1] = 'px';
		if (from[1] == 'px' && to[1] == 'em') from[0] = Element.Style.PXToEM(element, from[0]);
		else if (from[1] == 'em' && to[1] == 'px') from[0] = Element.Style.EMToPX(element, from[0]);
		else if (from[1] != to[1]) return null;
		if (from[0] == to[0]) return null;
		return [parseFloat(from[0]), parseFloat(to[0]), to[1]];
	},
	
	parseFloat: function(element, style, from, to){
		from = parseFloat(from);
		to = parseFloat(to);
		return (from == to) ? null : [from, to];
	}

};
