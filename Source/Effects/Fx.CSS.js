/*
Script: Fx.CSS.js
	CSS parsing class for effects. Required by <Fx.Tween>, <Fx.Morph>, <Fx.Elements>.

License:
	MIT-style license.
*/

Fx.CSS = {

	prepare: function(element, property, values){
		values = $splat(values);
		var values1 = values[1];
		if (!$chk(values1)){
			values[1] = values[0];
			values[0] = element.getStyle(property);
		}
		var parsed = values.map(Fx.CSS.set);
		return {'from': parsed[0], 'to': parsed[1]};
	},

	set: function(value){
		value = ($type(value) == 'string') ? value.split(' ') : $splat(value);
		return value.map(function(val){
			val = String(val);
			var found = false;
			Fx.CSS.Parsers.each(function(parser, key){
				if (!found){
					var match = parser.match(val);
					if ($chk(match)) found = {'value': match, 'parser': parser};
				}
			});
			return found || {'value': val, parser: {
				compute: function(from, to){
					return to;
				}
			}};
		});
	},

	compute: function(from, to, fx){
		return from.map(function(obj, i){
			return {'value': obj.parser.compute(obj.value, to[i].value, fx), 'parser': obj.parser};
		});
	},

	serve: function(now, unit){
		return now.reduce(function(prev, cur){
			var serve = cur.parser.serve;
			return prev.concat((serve) ? serve(cur.value, unit) : cur.value);
		}, []);
	}

};

Fx.CSS.Parsers = new Hash({

	'color': {

		match: function(value){
			if (value.match(/^#[0-9a-f]{3,6}$/i)) return value.hexToRgb(true);
			return ((value = value.match(/(\d+),\s*(\d+),\s*(\d+)/))) ? [value[1], value[2], value[3]] : false;
		},

		compute: function(from, to, fx){
			return from.map(function(value, i){
				return Math.round(fx.compute(value, to[i]));
			});
		},

		serve: function(value){
			return value.map(Number);
		}

	},

	'number': {

		match: function(value){
			return parseFloat(value);
		},

		compute: function(from, to, fx){
			return fx.compute(from, to);
		},

		serve: function(value, unit){
			return (unit) ? value + unit : value;
		}

	}

});