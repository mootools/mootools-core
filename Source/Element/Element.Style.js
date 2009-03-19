/*
Script: Element.Style.js
	Contains methods for interacting with the styles of Elements in a fashionable way.

License:
	MIT-style license.
*/

Element.extend({
	
	defineStyleGetter: function(name, fn){
		return this.defineGetter('style.' + name, fn);
	},

	defineStyleSetter: function(name, fn){
		return this.defineSetter('style.' + name, fn);
	},

	lookupStyleGetter: function(name, fn){
		return this.lookupGetter('style.' + name, fn);
	},

	lookupStyleSetter: function(name, fn){
		return this.lookupSetter('style.' + name, fn);
	}
	
});

Element.defineStyleSetter('opacity', function(value, ignoreVisbility){
	
	value = parseFloat(value);
	
	if (!ignoreVisibility){
		
		var visibility = this.getStyle('visibility');

		if (value == 0){
			if (visibility != 'hidden') this.setStyle('visibility', 'hidden');
		} else {
			if (visibility != 'visible') this.setStyle('visibility', 'visible');
		}
		
	}

	if (!this.currentStyle || !this.currentStyle.hasLayout) this.style.zoom = 1;
	if (Browser.Engine.trident) this.style.filter = (value == 1) ? '' : 'alpha(opacity=' + value * 100 + ')';
	this.style.opacity = value;
	return this;

}).defineStyleGetter('opacity', function(){
	return Object.pick(this.style.opacity, 1);
});

(function(name){
	
	Element.defineStyleSetter('float', function(value){
		this.style[name] = value;
		return this;
	}).defineStyleGetter('float', function(){
		return this.getStyle(name);
	});
	
})((Browser.Engine.trident) ? 'styleFloat' : 'cssFloat');

(function(){
	
	var all = {
		left: '@px', top: '@px', bottom: '@px', right: '@px',
		width: '@px', height: '@px', maxWidth: '@px', maxHeight: '@px', minWidth: '@px', minHeight: '@px',
		backgroundColor: 'rgb(@, @, @)', backgroundPosition: '@px @px', color: 'rgb(@, @, @)',
		fontSize: '@px', letterSpacing: '@px', lineHeight: '@px', clip: 'rect(@px @px @px @px)',
		margin: '@px @px @px @px', padding: '@px @px @px @px', border: '@px @ rgb(@, @, @) @px @ rgb(@, @, @) @px @ rgb(@, @, @)',
		borderWidth: '@px @px @px @px', borderStyle: '@ @ @ @', borderColor: 'rgb(@, @, @) rgb(@, @, @) rgb(@, @, @) rgb(@, @, @)',
		zIndex: '@', 'zoom': '@', fontWeight: '@', textIndent: '@px', opacity: '@'
	};
	
	var shorts = {margin: {}, padding: {}, border: {}, borderWidth: {}, borderStyle: {}, borderColor: {}};
	
	['Top', 'Right', 'Bottom', 'Left'].each(function(direction){
		['margin', 'padding'].each(function(style){
			var sd = style + direction;
			shorts[style][sd] = all[sd] = '@px';
		});
		var bd = 'border' + direction;
		shorts.border[bd] = all[bd] = '@px @ rgb(@, @, @)';
		var bdw = bd + 'Width', bds = bd + 'Style', bdc = bd + 'Color';
		shorts[bd] = {};
		shorts.borderWidth[bdw] = shorts[bd][bdw] = all[bdw] = '@px';
		shorts.borderStyle[bds] = shorts[bd][bds] = all[bds] = '@';
		shorts.borderColor[bdc] = shorts[bd][bdc] = all[bdc] = 'rgb(@, @, @)';
	});
	
	Element.getComputedStyle = function(element, name){
		if (element.currentStyle) return element.currentStyle[name];
		var computed = document.defaultView.getComputedStyle(element, null);
		return (computed) ? computed.getPropertyValue([name.hyphenate()]) : null;
	};
	
	Object.each(all, function(map, name){
		
		var isShort = !!(shorts[name]);
		
		Element.defineStyleSetter(name, function(value){
			if (typeOf(value) != 'string'){
				var values = Array.from(value), maps = map.split(' '), array = [];
				((isShort) ? values.length : maps.length).times(function(i){
					var v = values[i], m = maps[i];
					if (v == null) v = 0;
					array[i] = m.replace((typeOf(v) == 'string') ? (/@[\w]{0,2}/) : '@', v);
				});
				value = array.join(' ');
			}

			this.style[name] = value;
			return this;
		});

	});
	
	Object.each(shorts, function(map, name){
		
		Element.defineStyleGetter(name, function(){
			var styles = [];
			for (var p in map) styles.push(this.getStyle(p));
			return styles.join(' ');
		});

	});

})();

Element.implement({

	setStyle: function(name, value){
		name = name.camelCase();
		var setter = Element.lookupStyleSetter(name);
		if (setter) return setter.call(this, value);
	
		// no setter, set style property directly

		this.style[name] = value;
		return this;
	},

	getStyle: function(name){
		name = name.camelCase();
		var getter = Element.lookupStyleGetter(name);
		if (getter) return getter.call(this);
	
	
		// no getter, return current style

		var style = this.style[name];
		if (style || style === 0) return style;
		return Element.getComputedStyle(this, name);
	}

}).implement({
	
	setStyles: Element.prototype.setStyle.setMany(true),
	setStyles: Element.prototype.getStyle.getMany(true)
	
});

