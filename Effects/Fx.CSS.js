/*
Script: Fx.CSS.js
	Css parsing class for effects. Required by <Fx.Style>, <Fx.Styles>, <Fx.Elements>.

License:
	MIT-style license.
*/

Fx.CSS = {

	prepare: function(element, property, values){
		values = $splat(values);
		if (!$chk(values[1])){
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
		return now.map(function(obj){
			return Fx.CSS.Parsers[obj.type].serve(obj.value, unit);
		});
	}

};

Fx.CSS.Parsers = new Abstract({
	
	'color': {

		match: function(value){
			if (value.match(/^#[\w]{3,6}$/)) return value.hexToRgb(true);
			return ((value = value.match(/(\d+),\s*(\d+),\s*(\d+)/))) ? [value[1], value[2], value[3]] : false;
		},

		compute: function(from, to, fx){
			return from.map(function(value, i){
				return Math.round(fx.compute(value, to[i]));
			});
		},

		serve: function(value, unit){
			return value.map(function(value){
				return parseInt(value);
			});
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

		compute: function(from, to, fx){
			return to;
		},

		serve: function(value, unit){
			return value;
		}

	}

});