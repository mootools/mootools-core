/*
Script: Fx.CSS.js
	Css parsing class for effects. Required by <Fx.Style>, <Fx.Styles>, <Fx.Elements>.

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
		var parsed = values.map(function(value){
			return Fx.CSS.set(value);
		});
		return {'from': parsed[0], 'to': parsed[1]};
	},
	
	set: function(value){
		value = ($type(value) == 'string') ? value.split(' ') : $splat(value);
		return value.map(function(val){
			val = String(val);
			var found = false;
			Fx.CSS.Parsers.each(function(parser, key){
				if (found || !parser.match) return;
				var match = parser.match(val);
				if ($chk(match)) found = {'type': key, 'value': match};
			});
			return found || {'type': 'string', 'value': val};
		});
	},
	
	compute: function(from, to, fx){
		return from.map(function(obj, i){
			return {'type': obj.type, 'value': Fx.CSS.Parsers[obj.type].compute(from[i].value, to[i].value, fx)};
		});
	},
	
	serve: function(now, unit){
		return now.reduce(function(prev, cur){
			var server = Fx.CSS.Parsers[cur.type].serve;
			return prev.concat((server) ? server(cur.value, unit) : cur.value);
		}, []);
	}

};

Fx.CSS.Parsers = new Abstract({
	
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
			return (unit == 'px') ? value : value + unit;
		}

	},
	
	'string': {

		compute: function(from, to){
			return to;
		}

	}

});