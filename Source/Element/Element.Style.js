/*
---
name: Element.Style
description: Contains methods for interacting with the styles of Elements in a fashionable way.
requires: [Element, Accessor, Color]
provides: Element.Style
...
*/



(function(){
	
var Element = DOM.Element;

var define = 'define', lookup = 'lookup';
var StyleGetter = 'StyleGetter', StyleSetter = 'StyleSetter', StyleParser = 'StyleParser';
var defineStyleSetter = define + StyleSetter, defineStyleGetter = define + StyleGetter, defineStyleParser = define + StyleParser;
var lookupStyleSetter = lookup + StyleSetter, lookupStyleGetter = lookup + StyleGetter, lookupStyleParser = lookup + StyleParser;
	
Element.extend(new Accessor(StyleGetter)).extend(new Accessor(StyleSetter)).extend(new Accessor(StyleParser));

var testEM = document.createElement('span');
testEM.setAttribute('style', 'position: absolute; display: block; visibility: hidden; height: 100em; width: 100em;');

/* how many pixels are there in one em? find out with emCSS! */

var emCSS = function(element){
	element.appendChild(testEM);
	var height = testEM.offsetHeight;
	element.removeChild(testEM);
	return height / 100;
};

Element.implement({

	PXToEM: function(value){
		return PXToEM(this.node, value);
	},

	EMToPX: function(value){
		return EMToPX(this.node, value);
	}

});

var PXToEM = function(element, value){
	var one = emCSS(element);
	return (one === 0) ? 0 : value / one;
};

var EMToPX = function(element, value){
	return value * emCSS(element);
};

/* computed style */

var getStyle = (window.getComputedStyle) ? function(element, name){
	var computed = window.getComputedStyle(element, null);
	return computed.getPropertyValue([name.hyphenate()]);
} : function(element, name){
	var style = element.currentStyle[name];
	if (!style) return '';
	var isEm = style.match(/^([\d.]+)em$/);
	return (isEm) ? EMToPx(element, isEm[1]) + 'px' : style;
};

Slick.definePseudo('positioned', function(){
	return getStyle(this, 'position') != 'static';
}).definePseudo('static', function(){
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
backgroundPosition = background + 'Position', border = 'border', opacity = 'opacity', color = 'color', SColor = 'Color', Style = 'Style';
var transparent = 'transparent';

var html = document.documentElement;

/* float test */

var floatName = (html.style.cssFloat == null) ? 'styleFloat' : 'cssFloat';

/* float accessor */

Element[defineStyleSetter]('float', function(value){
	this.node.style[floatName] = value;
})[defineStyleGetter]('float', function(){
	return getStyle(this.node, floatName);
});

/* color accessors */

var cparse = function(color){
	if (color == transparent) return transparent;
	return (!color && color !== 0) ? '' : new Color(color).toString();
};

[color, background + SColor, border + Top + SColor, border + Right + SColor, border + Bottom + SColor, border + Left + SColor].each(function(name){
	
	Element[defineStyleParser](name, cparse)[defineStyleSetter](name, function(color){
		this.node.style[name] = cparse(color);
	})[defineStyleGetter](name, function(){
		return cparse(getStyle(this.node, name));
	});

});

/* filter utilities */

var filterName = (html.style.MsFilter != null) ? 'MsFilter' : (html.style.filter != null) ? 'filter' : null;

/* opacity accessor IE / Others */

var oparse = function(value){
	if (value == null || value === '') value = 1;
	return String(value);
};

Element[defineStyleParser](opacity, oparse);

if (html.style[opacity] == null && filterName){
	var matchOp = /alpha\(opacity=([\d.]+)\)/i;
	Element[defineStyleSetter](opacity, function(value){
		value = oparse(value);
		value = (value == 1) ? '' : 'alpha(' + opacity + '=' + (value * 100) + ')';
		var node = this.node,
			filter = getStyle(this.node, filterName) || '';
		node.style[filterName] = matchOp.test(filter) ? filter.replace(matchOp, value) : filter + value;
	})[defineStyleGetter](opacity, function(){
		var match = getStyle(this.node, filterName).match(matchOp);
		return oparse((match == null) ? 1 : match[1] / 100);
	});

} else {

	Element[defineStyleSetter](opacity, function(value){
		this.node.style[opacity] = oparse(value);
	})[defineStyleGetter](opacity, function(){
		return oparse(getStyle(this.node, opacity));
	});

}

/* unit values */

var uparse = function(value){
	return (value == null) ? '' : unitCSS(value);
};

[margin + Top, margin + Right, margin + Bottom, margin + Left, padding + Top, padding + Right, padding + Bottom, padding + Left,
top, right, bottom, left, width, height, 'max' + Width, 'max' + Height, 'min' + Width, 'min' + Height,
border + Top + Width, border + Right + Width, border + Bottom + Width, border + Left + Width,
'fontSize', 'letterSpacing', 'line' + Height, 'textIndent',
top, left, height, width].each(function(name){

	Element[defineStyleParser](name, uparse)[defineStyleSetter](name, function(value){
		this.node.style[name] = uparse(value);
	})[defineStyleGetter](name, function(em){
		var value = getStyle(this.node, name);
		return uparse((em) ? (PXToEM(this.node, parseFloat(value)) + 'em') : value);
	});

});

/* 4 values shorthands */

var TRBL = [Top, Right, Bottom, Left];

[margin, padding, border + Width, border + SColor, border + Style].each(function(name){

	var match = name.match(/border(\w+)/);
	
	var shorts = TRBL.map(function(dir){
		return (match) ? (border + dir + match[1]) : (name + dir);
	});
	
	var parse = (function(value){
		if (!value && value !== 0) return '';
		var values = mirrorCSS(splitCSS(value));
		return shorts.map(function(s, i){
			var parser = Element[lookupStyleParser](s);
			return (parser) ? parser(values[i]) : values[i];
		});
	}).extend('shortHand', true);
	
	Element[defineStyleParser](name, parse)[defineStyleSetter](name, function(value){
		this.node.style[name] = parse(value).join(' ');
	})[defineStyleGetter](name, function(em){
		return shorts.map(function(s){
			return this.getStyle(s, em);
		}, this).join(' ');
	});

});

/* background position accessor (shortHand) */

var bpparse = (function(value){
	if (!value && value !== 0) return '';
	value = splitCSS(value);
	if (!value[1]) value[1] = 0;
	return value.map(unitCSS);
}).extend('shortHand', true);

Element[defineStyleParser](backgroundPosition, bpparse)[defineStyleSetter](backgroundPosition, function(value){
	this.node.style[backgroundPosition] = bpparse(value).join(' ');
})[defineStyleGetter](backgroundPosition, function(){
	var style = getStyle(this.node, backgroundPosition);
	return (style) ? bpparse(style).join(' ') : style;
});

/* fake backgroundPositionX and backgroundPositionY */

Element[defineStyleGetter](backgroundPosition + 'X', function(){
	return this.getStyle(backgroundPosition).split(' ')[0] || '';
})[defineStyleGetter](backgroundPosition + 'Y', function(){
	return this.getStyle(backgroundPosition).split(' ')[1] || '';
})[defineStyleSetter](backgroundPosition + 'X', function(X){
	this.setStyle(backgroundPosition, [X, this.getStyle(backgroundPosition + 'Y')]);
})[defineStyleSetter](backgroundPosition + 'Y', function(Y){
	this.setStyle(backgroundPosition, [this.getStyle(backgroundPosition + 'X'), Y]);
});

/* clip setter */

Element[defineStyleParser](clip, bpparse)[defineStyleSetter](clip, function(value){
	this.node.style[clip] = 'rect(' + bpparse(value).join(' ') + ')';
})[defineStyleGetter](clip, function(){
	return bpparse(getStyle(this.node, clip).match(/([\d.]+\w*)/g)).join(' ');
});

// 3 values shorthands (border)

[border + Top, border + Right, border + Bottom, border + Left].each(function(name){
	
	var shorts = [Width, Style, SColor].map(function(type){
		return name + type;
	});
	
	var parse = (function(value){
		if (!value && value !== 0) return '';
		var values = splitCSS(value);
		if (values.length != 3) return '';
		return shorts.map(function(s, i){
			var parser = Element[lookupStyleParser](s);
			return (parser) ? parser(values[i]) : values[i];
		});
	}).extend('shortHand', true);
	
	Element[defineStyleParser](name, parse)[defineStyleSetter](name, function(value){
		this.node.style[name] = parse(value).join(' ');
	})[defineStyleGetter](name, function(em){
		return shorts.map(function(s){
			return this.getStyle(s, em);
		}, this).join(' ');
	});

});

/* border */

var borderShorts = [];

TRBL.each(function(dir){
	[Width, Style, SColor].each(function(type){
		borderShorts.push(border + dir + type);
	});
});

var bparse = (function(v){
	v = splitCSS(v);
	if (v.length == 3) v = [v[0], v[1], v[2], v[0], v[1], v[2], v[0], v[1], v[2], v[0], v[1], v[2]];
	else if (v.length == 6) v = [v[0], v[1], v[2], v[3], v[4], v[5], v[0], v[1], v[2], v[3], v[4], v[5]];
	else if (v.length == 9) v = [v[0], v[1], v[2], v[3], v[4], v[5], v[6], v[7], v[8], v[3], v[4], v[5]];
	else if (v.length != 12) return '';
	
	return borderShorts.map(function(s, i){
		var parse = Element[lookupStyleParser](s);
		return parse ? parse(v[i]) : v[i];
	});
}).extend('shortHand', true);

Element[defineStyleParser](border, bparse)[defineStyleSetter](border, function(value){

	value = bparse(value);
	borderShorts.each(function(bs, i){
		this.node.style[bs] = value[i];
	}, this);
	
})[defineStyleGetter](border, function(em){
	return borderShorts.map(function(bs){
		return this.getStyle(bs, em);
	}, this).join(' ');
});

/* getStyle, setStyle */

var elementGetStyle = function(name, em){
	var getter = Element[lookupStyleGetter](name = name.camelCase());
	return (getter) ? getter.call(this, em) : getStyle(this.node, name);
};

Element.implement({
	
	setStyle: function(name, value){
		var setter = Element[lookupStyleSetter](name = name.camelCase());
		if (setter) setter.call(this, value);
		else this.node.style[name] = value;
		return this;
	},
	
	setStyles: function(styles){
		for (var name in styles) this.setStyle(name, styles[name]);
		return this;
	},

	getStyle: elementGetStyle,
	
	getStyles: elementGetStyle.overloadGetter(true)

});

})();
