/*=
name: Element.Style
description: Methods to iteract with the css-style of html elements.
requires:
  - Element
  - Color
=*/

(function(Element, CColor){
	
Element.extend(new Accessor('StyleGetter')).extend(new Accessor('StyleSetter'));

Element.Style = {transitionable: {}, shorts: {}};

/* how many pixels are there in one em? find out with emCSS! */

var ES = Element.Style, EST = ES.transitionable, ESS = ES.shorts;

var testEM = document.newElement('span', {css: 'position: absolute; display: block; visibility: hidden; height: 100em; width: 100em;'});

var emCSS = function(element){
	var height = testEM.inject(element).offsetHeight;
	testEM.dispose();
	return height / 100;
};

var PXToEM = ES.PXToEM = function(element, value){
	var one = emCSS(element);
	return (one === 0) ? 0 : value / one;
};

var EMToPX = ES.EMToPX = function(element, value){
	return value * emCSS(element);
};

/* computed style */

var getStyle = (window.getComputedStyle) ? function(element, name, unit){

	var computed = window.getComputedStyle(element, null);
	var style = computed.getPropertyValue([name.hyphenate()]), match;
	if (!unit || !(match = style.match(/^([\d.]+)px$/))) return style;
	return PXToEM(element, match[1]) + 'em';
	
} : function(element, name, unit){
	
	var style = element.currentStyle[name];
	var match = style.match(/^([\d.]+)(em|px)$/);
	if (!match || (unit && match[2] == 'em') || (!unit && match[2] == 'px')) return style;
	var one = emCSS(element);
	return (!unit && match[2] == 'em') ? EMToPX(element, match[1]) + 'px' : PXToEM(element, match[1]) + 'em';

};

slick.definePseudo('positioned', function(){
	return getStyle(this, 'position') != 'static';
});

slick.definePseudo('static', function(){
	return getStyle(this, 'position') == 'static';
});

/* css values utilities */

var splitCSS = function(value){
	return (typeOf(value) == 'string') ? value.trim().replace(/,\s+/g, ',').split(/\s+/) : Array.from(value);
};

var mirrorCSS = function(value){
	var length = value.length;

	if (length == 1) value.push(value[0], value[0], value[0]);
	else if (length == 2) value.push(value[0], value[1]);
	else if (length == 3) value.push(value[1]);

	return value;
};

var unitCSS = function(value){
	return (value == parseFloat(value)) ? value + 'px' : value;
};

// string compression optimization

var Left = 'Left', Right = 'Right', Top = 'Top', Bottom = 'Bottom', margin = 'margin', padding = 'padding', Width = 'Width', Height = 'Height',
height = 'height', width = 'width', top = 'top', bottom = 'bottom', left = 'left', right = 'right', background = 'background', clip = 'clip',
backgroundPosition = background + 'Position', border = 'border', opacity = 'opacity', color = 'color', Color = 'Color', Style = 'Style';

var html = document.html;

/* float test */

var floatName = (html.style.cssFloat == null) ? 'styleFloat' : 'cssFloat';

/* float accessor */

Element.defineStyleSetter('float', function(value){

	this.style[floatName] = value;

}).defineStyleGetter('float', function(){

	return getStyle(this, floatName);

});

/* color accessors */

[color, background + Color, border + Top + Color, border + Right + Color, border + Bottom + Color, border + Left + Color].each(function(name){
	
	EST[name] = 'color';

	Element.defineStyleSetter(name, function(color){
		
		this.style[name] = ((/^[a-z]*$|^rgb/).test(color)) ? color : new CColor(color).toString();

	}).defineStyleGetter(name, function(){
		
		var css = getStyle(this, name);
		return (/^[a-z]*$|^rgb/).test(css) ? css : new CColor(css).toString();

	});

});

/* filter utilities */

var filterName = (html.style.MsFilter != null) ? 'MsFilter' : (html.style.filter != null) ? 'filter' : null;

/* opacity accessor IE / Others */

EST[opacity] = 'float';

if (html.style[opacity] == null && filterName) Element.defineStyleSetter(opacity, function(value){
	
	if (value == null || value === '') value = 1;
	this.style[filterName] = (value == 1) ? '' : 'alpha(' + opacity + '=' + (value * 100) + ')';

}).defineStyleGetter(opacity, function(){
	
	var match = getStyle(this, filterName).match(/alpha\(opacity=([\d.]+)\)/i);
	return String((match == null) ? 1 : match[1] / 100);

}); else Element.defineStyleGetter(opacity, function(){

	var o = getStyle(this, opacity);
	return String((o === '') ? 1 : o);

});

/* unit values */

[margin + Top, margin + Right, margin + Bottom, margin + Left, padding + Top, padding + Right, padding + Bottom, padding + Left,
top, right, bottom, left, width, height, 'max' + Width, 'max' + Height, 'min' + Width, 'min' + Height,
backgroundPosition + 'Y', backgroundPosition + 'X',
border + Top + Width, border + Right + Width, border + Bottom + Width, border + Left + Width,
'fontSize', 'letterSpacing', 'line' + Height, 'textIndent'].each(function(name){

	EST[name] = 'unit';

	Element.defineStyleSetter(name, function(value){
		this.style[name] = unitCSS(value);
	});

});

/* height width top left */

Element.defineStyleGetters({
	
	top: function(unit){
		var mt = parseFloat(getStyle(this, margin + Top)), value = this.offsetTop - mt;
		return (unit) ? PXToEM(this, value) + 'em' : value + 'px';
	},
	
	left: function(unit){
		var ml = parseFloat(getStyle(this, margin + Left)), value = this.offsetLeft - ml;
		return (unit) ? PXToEM(this, value) + 'em' : value + 'px';
	},
	
	height: function(unit){
		var pt = parseFloat(getStyle(this, padding + Top)), pb = parseFloat(getStyle(this, padding + Bottom));
		var value = this.clientHeight - pt - pb;
		return (unit) ? PXToEM(this, value) + 'em' : value + 'px';
	},
	
	width: function(unit){
		var pt = parseFloat(getStyle(this, padding + Left)), pb = parseFloat(getStyle(this, padding + Right));
		var value = this.clientWidth - pt - pb;
		return (unit) ? PXToEM(this, value) + 'em' : value + 'px';
	}
	
});

/* 4 values shorthands */

var TRBL = [Top, Right, Bottom, Left];

[margin, padding, border + Width, border + Color, border + Style].each(function(name){

	var match = name.match(/border(\w+)/);
	
	var shorts = TRBL.map(function(dir){
		return (match) ? (border + dir + match[1]) : (name + dir);
	});
	
	var parse = ESS[name] = function(value){
		value = mirrorCSS(splitCSS(value));
		var parsed = {};
		shorts.each(function(s){
			parsed[s] = value.shift();
		});
		return parsed;
	};

	Element.defineStyleSetter(name, function(value){
		
		if (!value && value !== 0) this.style[name] = '';
		else this.setStyles(parse(value));
		
	}).defineStyleGetter(name, function(unit){
		
		return shorts.map(function(s){
			return getStyle(this, s, unit);
		}, this).join(' ');
		
	});

});

/* background position accessor */

var bpparse = ESS[backgroundPosition] = function(value){
	value = splitCSS(value);
	if (!value[1]) value[1] = 0;
	return Object.from([backgroundPosition + 'X', backgroundPosition + 'Y'], value);
};

Element.defineStyleSetter(backgroundPosition, function(value){

	if (!value && value !== 0) this.style[backgroundPosition] = '';
	else this.setStyles(bpparse(value));

}).defineStyleGetter(backgroundPosition, function(){

	return getStyle(this, backgroundPosition + 'X') + ' ' + getStyle(this, backgroundPosition + 'Y');

});

/* clip setter */

Element.defineStyleSetter(clip, function(value){
	if (!value && value !== 0){
		this.style[clip] = '';
	} else {
		value = mirrorCSS((typeOf(value) == 'string') ? value.match(/([\d.]+\w*)/g) : Array.from(value));
		this.style[clip] = 'rect(' + value.join(' ').map(unitCSS) + ')';
	}
});

[border + Top, border + Right, border + Bottom, border + Left].each(function(name){
	
	var shorts = [Width, Style, Color].map(function(type){
		return name + type;
	});
	
	var parse = ESS[name] = function(value){
		value = splitCSS(value);
		var styles = {};
		shorts.each(function(s){
			styles[s] = value.shift();
		});
		return styles;
	};

	Element.defineStyleSetter(name, function(value){

		if (!value) this.style[name] = '';
		else this.setStyles(parse(value));

	}).defineStyleGetter(name, function(unit){
		
		return shorts.map(function(s){
			return this.getStyle(s, unit);
		}, this).join(' ');

	});

});

var borderShorts = [];

TRBL.each(function(dir){
	[Width, Style, Color].each(function(type){
		borderShorts.push(border + dir + type);
	});
});

var bparse = ESS[border] = function(value){
	value = splitCSS(value);
	var array = [];
	while (value.length) array.push(value.splice(0, 3));
	array = mirrorCSS(array);
	value = [].concat(array[0], array[1], array[2], array[3]);
	var styles = {};
	borderShorts.each(function(bs){
		styles[bs] = value.shift();
	});
	return styles;
};

Element.defineStyleSetter(border, function(value){

	if (!value) this.style[border] = '';
	else this.setStyles(bparse(value));
	
}).defineStyleGetter(border, function(unit){
	
	return borderShorts.map(function(bs){
		return this.getStyle(bs, unit);
	}, this).join(' ');

});

/* getStyle, setStyle */

Element.implement({
	
	setStyle: function(name, value){
		var setter = Element.lookupStyleSetter(name = name.camelCase());
		if (setter) setter.call(this, value);
		else this.style[name] = value;
		return this;
	},
	
	setStyles: function(styles){
		for (var name in styles) this.setStyle(name, styles[style]);
		return this;
	},

	getStyle: function(name, unit){
		var getter = Element.lookupStyleGetter(name = name.camelCase());
		return (getter) ? getter.call(this, unit) : getStyle(this, name, unit);
	},
	
	getStyles: function(styles){
		var results = {};
		for (var i = 0; i < styles.length; i++){
			var s = styles[i].camelCase();
			results[s] = this.getStyle(s);
		}
		return results;
	}

});

Element.defineSetter('styles', function(styles){
	this.setStyles(styles);
});

})(Element, Color);
