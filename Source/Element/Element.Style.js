/*
Script: Element.Style.js
	Contains methods for interacting with the styles of Elements in a fashionable way.

License:
	MIT-style license.
*/

Element.extend(new Accessors('Style'));

(function(){

	/* how many pixels are there in one em? find out with emCSS! */
	
	var test = document.newElement('span', {css: 'position: absolute; display: block; visibility: hidden; height: 100em; width: 100em;'});
	
	var emCSS = function(element){
		var height = test.inject(element).offsetHeight;
		test.dispose();
		return height / 100;
	};

	/* computed style */

	var styleCSS = (window.getComputedStyle) ? function(element, name, unit){

		var computed = getComputedStyle(element, null);
		var style = computed.getPropertyValue([name.hyphenate()]), match;
		if (!unit || !(match = style.match(/^(\d+)px$/))) return style;
		var one = emCSS(element);
		return (match[1] / one) + 'em';
		
	} : function(element, name, unit){
		
		var style = element.currentStyle[name];
		var match = style.match(/^(\d+)(em|px)$/);
		if (!match || (unit && match[2] == 'em') || (!unit && match[2] == 'px')) return style;
		var one = emCSS(element);
		if (!unit && match[2] == 'em') return (one * match[1]) + 'px';
		else return (match[1] / one) + 'em';

	};
	
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

	var pixelCSS = function(value){
		var number = Number.toFloat(value);
		return (value == number) ? value + 'px' : value;
	};
	
	/* float test */

	var html = document.html;

	var floatName = (html.style.cssFloat == null) ? 'styleFloat' : 'cssFloat';
	
	/* float accessor */
	
	Element.defineStyleSetter('float', function(value){
	
		this.style[floatName] = value;
	
	}).defineStyleGetter('float', function(){
	
		return styleCSS(this, floatName);
	
	});
	
	/* color accessors */

	['color', 'backgroundColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'].forEach(function(name){
	
		Element.defineStyleSetter(name, function(color){

			if (removesCSS(this, name, color)) return;			
			this.style[name] = ((/^[a-z]+$/).test(color)) ? color : new Color(color).toString();

		}).defineStyleGetter(name, function(){
			
			var css = styleCSS(this, name);
			return (/^rgb/).test(css) ? css : new Color(css).toString();

		});

	});
	
	/* filter utilities */

	var filterName = (html.style.MsFilter != null) ? 'MsFilter' : (html.style.filter != null) ? 'filter' : null;

	var filterString = "progid:DXImageTransform.Microsoft.";

	var regexpFilter = function(name, match){
		match = '\\(' + (match || "[\\w#=,'\"\\s]*") + '\\)';
		return new RegExp(filterString.escapeRegExp() + name + match, 'i');
	};

	var removeFilter = function(element, name){
		var style = element.style;
		style[filterName] = styleCSS(element, filterName).replace(regexpFilter(name), '').trim();
	};

	var addFilter = function(element, name, props){
		if (!element.currentStyle.hasLayout) element.style.zoom = 1;
		element.style[filterName] += ' ' + filterString + name + '(' + props + ')';
	};
	
	var removesCSS = function(element, name, value){
		if ((!value && value !== 0)){
			element.style[name] = '';
			return true;
		}
		return false;
	};
	
	/* background color accessor for IE, to support alpha in background-colors */

	if (filterName) Element.defineStyleSetter('backgroundColor', function(color){

		removeFilter(this, 'gradient');
		
		if (removesCSS(this, 'backgroundColor', color)) return null;
		if ((/^[a-z]+$/).test(color)) return this.style.backgroundColor = color;
	
		color = new Color(color);
		var alpha = color.get('alpha');

		if (alpha != 1 && alpha != 0){
			// explorer uses AARRGGBB, Color uses RRGGBBAA
			var aa = color.toHEX().substr(7, 2);
			color.set('alpha', 1);
			var iexa = '#' + aa + color.toHEX().substr(1);
			addFilter(this, 'gradient', 'startColorstr=' + iexa + ',' + 'endColorstr=' + iexa);
		}
	
		if (alpha != 1 || alpha == 0) return this.style.backgroundColor = 'transparent';
	
		return this.style.backgroundColor = color.toString();
	
	}).defineStyleGetter('backgroundColor', function(){

		var match = styleCSS(this, filterName).match(regexpFilter('gradient', 'startColorstr=([#\\w]+),\\s*endColorstr=[#\\w]+'));

		if (match && (match = match[1])){
			// explorer uses AARRGGBB, Color uses RRGGBBAA
			var aa = match.substr(1, 2), hex = match.substr(3);
			return new Color(hex + aa).toString();
		}
		
		var css = styleCSS(this, 'backgroundColor');
		return (/^rgb/).test(css) ? css : new Color(css).toString();
	
	});
	
	/* opacity accessor IE / Others */

	if (html.style.opacity == null && filterName) Element.defineStyleSetter('opacity', function(value){
		
		removeFilter(this, 'alpha');
		if (value == null || value === '') value = 0;
		if (value != 1) addFilter(this, 'alpha', 'opacity=' + value * 100);
	
	}).defineStyleGetter('opacity', function(){

		var opacity = styleCSS(this, filterName).match(regexpFilter('alpha', 'opacity=(\\d+)'));
		return (opacity == null) ? 1 : opacity[1] / 100;
	
	}); else Element.defineStyleGetter('opacity', function(){
	
		var opacity = styleCSS(this, 'opacity');
		return (opacity == '') ? 1 : Number.toFloat(opacity);

	});
	
	/* unit values */

	['marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
	'top', 'right', 'bottom', 'left', 'width', 'height', 'maxWidth', 'maxHeight', 'minWidth', 'minHeight',
	'backgroundPositionY', 'backgroundPositionX',
	'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
	'fontSize', 'letterSpacing', 'lineHeight', 'textIndent'].forEach(function(name){
	
		Element.defineStyleSetter(name, function(value){
			if (removesCSS(this, name, value)) return;
			this.style[name] = pixelCSS(value);
		});

	});
	
	/* 4 values shorthands */

	['margin', 'padding', 'borderWidth', 'borderColor', 'borderStyle'].forEach(function(name){
	
		var match = name.match(/border(\w+)/);
		if (match) match = match[1];

		Element.defineStyleSetter(name, function(value){

			if (removesCSS(this, name, value)) return;
			value = mirrorCSS(splitCSS(value));
			['Top', 'Right', 'Bottom', 'Left'].forEach(function(dir){
				this.setStyle((match) ? ('border' + dir + match) : (name + dir), value.shift());
			}, this);
			
		}).defineStyleGetter(name, function(unit){
			
			return ['Top', 'Right', 'Bottom', 'Left'].map(function(dir){
				return this.getStyle((match) ? ('border' + dir + match) : (name + dir), unit);
			}, this).join(' ');
			
		});

	});
	
	/* background position accessor */

	Element.defineStyleSetter('backgroundPosition', function(value){
		
		if (removesCSS(this, 'backgroundPosition', value)) return;
		value = splitCSS(value);
		if (!value[1]) value[1] = 0;
		this.setStyle('backgroundPositionX', value[0]).setStyle('backgroundPositionY', value[1]);
	
	}).defineStyleGetter('backgroundPosition', function(){
	
		return styleCSS(this, 'backgroundPositionX') + ' ' + styleCSS(this, 'backgroundPositionY');
	
	});
	
	/* clip setter */

	Element.defineStyleSetter('clip', function(value){
		if (removesCSS(this, 'clip', value)) return;
		value = mirrorCSS((typeof value == 'string') ? value.match(/(\d+\w*)/g) : Array.from(value));
		this.style.clip = 'rect(' + value.join(' ').map(pixelCSS) + ')';
	});
	
	/* TODO accessors missing: borderTop, borderRight, borderBottom, borderLeft, border */
	
	['borderTop', 'borderRight', 'borderBottom', 'borderLeft'].forEach(function(name){

		Element.defineStyleSetter(name, function(value){

			if (removesCSS(this, name, value)) return;
			value = splitCSS(value);
			['Width', 'Style', 'Color'].forEach(function(dir){
				this.setStyle(name + dir, value.shift());
			}, this);

		}).defineStyleGetter(name, function(unit){
			
			return ['Width', 'Style', 'Color'].map(function(dir){
				return this.getStyle(name + dir, unit);
			}, this).join(' ');

		});

	});
	
	Element.defineStyleSetter('border', function(value){

		if (removesCSS(this, name, value)) return;
		value = splitCSS(value);
		var array = [];
		while (value.length) array.push(value.splice(0, 3));
		value = mirrorCSS(array);
		['Top', 'Right', 'Bottom', 'Left'].forEach(function(dir){
			this.setStyle('border' + dir, value.shift());
		}, this);
		
	}).defineStyleGetter('border', function(unit){
		
		return ['Top', 'Right', 'Bottom', 'Left'].map(function(dir){
			return this.getStyle('border' + dir, unit);
		}, this).join(' ');

	});
	
	/* skip lookupStyleGetter and lookupStyleSetter to speedup getStyle / setStyle. they have to be fast */
	
	var styleAccessors = Storage.retrieve(Element, 'style:accessors');
	
	/* getStyle, setStyle */

	Element.implement({
		
		setStyle: function(name, value){
			var accessor = styleAccessors[name = name.camelCase()], setter;
			if (accessor && (setter = accessor.set)) setter.call(this, value);
			else this.style[name] = value;
			return this;
		},

		getStyle: function(name, unit){
			var accessor = styleAccessors[name = name.camelCase()], getter;
			return ((accessor && (getter = accessor.get))) ? getter.call(this, unit) : styleCSS(this, name, unit);
		},
	
		setStyles: Function.setMany('setStyle'),
		getStyles: Function.getMany('getStyle')

	});

})();

Element.defineSetter('styles', function(styles){
	this.setStyles(styles);
});
