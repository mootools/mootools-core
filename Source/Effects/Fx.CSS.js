/*
Script: Fx.CSS.js
	CSS parsing class for effects. Required by <Fx.Tween>, <Fx.Morph>, <Fx.Elements>.

License:
	MIT-style license.
*/

Fx.CSS = new Class({
	
	Extends: Fx,
	
	//prepares the base from/to object

	prepare: function(element, property, values){
		values = $splat(values);
		var values1 = values[1];
		if (!$chk(values1)){
			values[1] = values[0];
			values[0] = element.getStyle(property);
		}
		var parsed = values.map(this.parse);
		return {from: parsed[0], to: parsed[1]};
	},
	
	//parses a value into an array
	
	parse: function(value){
		value = ($type(value) == 'string') ? value.split(' ') : $splat(value);
		return value.map(function(val){
			val = String(val);
			var found = false;
			Fx.CSS.Parsers.each(function(parser, key){
				if (found) return;
				var parsed = parser.parse(val);
				if ($chk(parsed)) found = {'value': parsed, 'parser': parser};
			});
			found = found || {value: val, parser: Fx.CSS.Parsers.String};
			return found;
		});
	},
	
	//computes by a from and to prepared objects, using their parsers.
	
	compute: function(from, to, delta){
		var computed = [];
		(Math.min(from.length, to.length)).times(function(i){
			computed.push({'value': from[i].parser.compute(from[i].value, to[i].value, delta), 'parser': from[i].parser});
		});
		computed.$family = {name: 'fx:css:value'};
		return computed;
	},
	
	//serves the value as settable
	
	serve: function(value, unit){
		if ($type(value) != 'fx:css:value') value = this.parse(value);
		var returned = [];
		value.each(function(bit){
			returned = returned.concat(bit.parser.serve(bit.value, unit));
		});
		return returned;
	},
	
	//searches inside the page css to find the values for a selector
	
	search: function(selector){
		var to = {};
		Array.each(document.styleSheets, function(sheet, j){
			var rules = sheet.rules || sheet.cssRules;
			Array.each(rules, function(rule, i){
				if (!rule.style || !rule.selectorText || !rule.selectorText.test('^' + selector + '$')) return;
				Element.Styles.each(function(value, style){
					if (!rule.style[style] || Element.ShortStyles[style]) return;
					value = rule.style[style];
					to[style] = (value.test(/^rgb/)) ? value.rgbToHex() : value;
				});
			});
		});
		return to;
	},
	
	//renders the change to an element
	
	render: function(element, property, value){
		element.setStyle(property, this.serve(value, this.options.unit));
	}
	
});

Fx.CSS.Parsers = new Hash({

	Color: {

		parse: function(value){
			if (value.match(/^#[0-9a-f]{3,6}$/i)) return value.hexToRgb(true);
			return ((value = value.match(/(\d+),\s*(\d+),\s*(\d+)/))) ? [value[1], value[2], value[3]] : false;
		},

		compute: function(from, to, delta){
			return from.map(function(value, i){
				return Math.round(Fx.compute(from[i], to[i], delta));
			});
		},

		serve: function(value){
			return value.map(Number);
		}

	},

	Number: {

		parse: function(value){
			return parseFloat(value);
		},

		compute: function(from, to, delta){
			return Fx.compute(from, to, delta);
		},

		serve: function(value, unit){
			return (unit) ? value + unit : value;
		}

	},
	
	String: {parse: $return(false), compute: $arguments(1), serve: $arguments(0)}

});
