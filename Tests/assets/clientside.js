/*
Script: dbug.js
	A wrapper for Firebug console.* statements.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var dbug = {
	logged: [],	
	timers: {},
	firebug: false, 
	enabled: false, 
	log: function(){
		dbug.logged.push(arguments);
	},
	nolog: function(msg){
		dbug.logged.push(arguments);
	},
	time: function(name){
		dbug.timers[name] = new Date().getTime();
	},
	timeEnd: function(name){
		if (dbug.timers[name]){
			var end = new Date().getTime() - dbug.timers[name];
			dbug.timers[name] = false;
			dbug.log('%s: %s', name, end);
		} else dbug.log('no such timer: %s', name);
	},
	enable: function(silent){ 
		if (dbug.firebug){
			try {
				dbug.enabled = true;
				dbug.log = function(){
						(console.debug || console.log).apply(console, arguments);
				};
				dbug.time = function(){
					console.time.apply(console, arguments);
				};
				dbug.timeEnd = function(){
					console.timeEnd.apply(console, arguments);
				};
				if (!silent) dbug.log('enabling dbug');
				for(var i=0;i<dbug.logged.length;i++){ dbug.log.apply(console, dbug.logged[i]); }
				dbug.logged=[];
			} catch(e){
				dbug.enable.delay(400);
			}
		}
	},
	disable: function(){ 
		if (dbug.firebug) dbug.enabled = false;
		dbug.log = dbug.nolog;
		dbug.time = function(){};
		dbug.timeEnd = function(){};
	},
	cookie: function(set){
		var value = document.cookie.match('(?:^|;)\\s*jsdebug=([^;]*)');
		var debugCookie = value ? unescape(value[1]) : false;
		if ((!$defined(set) && debugCookie != 'true') || ($defined(set) && set)){
			dbug.enable();
			dbug.log('setting debugging cookie');
			var date = new Date();
			date.setTime(date.getTime()+(24*60*60*1000));
			document.cookie = 'jsdebug=true;expires='+date.toGMTString()+';path=/;';
		} else dbug.disableCookie();
	},
	disableCookie: function(){
		dbug.log('disabling debugging cookie');
		document.cookie = 'jsdebug=false;path=/;';
	}
};

(function(){
	var fb = typeof console != "undefined";
	var debugMethods = ['debug','info','warn','error','assert','dir','dirxml'];
	var otherMethods = ['trace','group','groupEnd','profile','profileEnd','count'];
	function set(methodList, defaultFunction){
		for(var i = 0; i < methodList.length; i++){
			dbug[methodList[i]] = (fb && console[methodList[i]])?console[methodList[i]]:defaultFunction;
		}
	};
	set(debugMethods, dbug.log);
	set(otherMethods, function(){});
})();
if (typeof console != "undefined" && console.warn){
	dbug.firebug = true;
	var value = document.cookie.match('(?:^|;)\\s*jsdebug=([^;]*)');
	var debugCookie = value ? unescape(value[1]) : false;
	if (window.location.href.indexOf("jsdebug=true")>0 || debugCookie=='true') dbug.enable();
	if (debugCookie=='true')dbug.log('debugging cookie enabled');
	if (window.location.href.indexOf("jsdebugCookie=true")>0){
		dbug.cookie();
		if (!dbug.enabled)dbug.enable();
	}
	if (window.location.href.indexOf("jsdebugCookie=false")>0)dbug.disableCookie();
}


/*
Script: IframeShim.js
	Defines IframeShim, a class for obscuring select lists and flash objects in IE.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/	
var IframeShim = new Class({
	Implements: [Options, Events],
	options: {
		name: '',
		className:'iframeShim',
		display:false,
		zindex: null,
		margin: 0,
		offset: {
			x: 0,
			y: 0
		},
		browsers: (Browser.Engine.trident4 || (Browser.Engine.gecko && !Browser.Engine.gecko19 && Browser.Platform.mac))
	},
	initialize: function (element, options){
		this.setOptions(options);
		//legacy
		if (this.options.offset && this.options.offset.top) this.options.offset.y = this.options.offset.top;
		if (this.options.offset && this.options.offset.left) this.options.offset.x = this.options.offset.left;
		this.element = $(element);
		this.makeShim();
		return;
	},
	makeShim: function(){
		this.shim = new Element('iframe');
		this.id = this.options.name || new Date().getTime() + "_shim";
		if (this.element.getStyle('z-Index').toInt()<1 || isNaN(this.element.getStyle('z-Index').toInt()))
			this.element.setStyle('z-Index',5);
		var z = this.element.getStyle('z-Index')-1;
		
		if ($chk(this.options.zindex) && 
			 this.element.getStyle('z-Index').toInt() > this.options.zindex)
			 z = this.options.zindex;
			
 		this.shim.setStyles({
			'position': 'absolute',
			'zIndex': z,
			'border': 'none',
			'filter': 'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)'
		}).setProperties({
			'src':'javascript:void(0);',
			'frameborder':'0',
			'scrolling':'no',
			'id':this.id
		}).addClass(this.options.className);
		
		this.element.store('shim', this);

		var inject = function(){
			this.shim.inject(this.element, 'after');
			if (this.options.display) this.show();
			else this.hide();
			this.fireEvent('onInject');
		};
		if (this.options.browsers){
			if (Browser.Engine.trident && !IframeShim.ready){
				window.addEvent('load', inject.bind(this));
			} else {
				inject.run(null, this);
			}
		}
	},
	position: function(shim){
		if (!this.options.browsers || !IframeShim.ready) return this;
		var before = this.element.getStyles('display', 'visibility', 'position');
		this.element.setStyles({
			display: 'block',
			position: 'absolute',
			visibility: 'hidden'
		});
		var size = this.element.getSize();
		this.element.setStyles(before);
		if ($type(this.options.margin)){
			size.x = size.x-(this.options.margin*2);
			size.y = size.y-(this.options.margin*2);
			this.options.offset.x += this.options.margin; 
			this.options.offset.y += this.options.margin;
		}
 		this.shim.setStyles({
			'width': size.x,
			'height': size.y
		}).setPosition({
			relativeTo: this.element,
			offset: this.options.offset
		});
		return this;
	},
	hide: function(){
		if (this.options.browsers) this.shim.setStyle('display','none');
		return this;
	},
	show: function(){
		if (!this.options.browsers) return this;
		this.shim.setStyle('display','block');
		return this.position();
	},
	dispose: function(){
		if (this.options.browsers) this.shim.dispose();
		return this;
	}
});
window.addEvent('load', function(){
	IframeShim.ready = true;
});


/*
Script: Hash.Extras.js
	Extends the Hash native object to include getFromPath which allows a path notation to child elements.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/

Hash.implement({
	getFromPath: function(notation){
		var source = this.getClean();
		notation.replace(/\[([^\]]+)\]|\.([^.[]+)|[^[.]+/g, function(match){
			if (!source) return;
			var prop = arguments[2] || arguments[1] || arguments[0];
			source = (prop in source) ? source[prop] : null;
			return match;
		});
		return source;
	},
	cleanValues: function(method){
		method = method||$defined;
		this.each(function(v, k){
			if (!method(v)) this.erase(k);
		}, this);
		return this;
	}
});

/*
Script: String.Extras.js
	Extends the String native object to include methods useful in managing various kinds of strings (query strings, urls, html, etc).

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
String.implement({
	stripTags: function(){
		return this.replace(/<\/?[^>]+>/gi, '');
	},
	parseQuery: function(encodeKeys, encodeValues){
		encodeKeys = $pick(encodeKeys, true);
		encodeValues = $pick(encodeValues, true);
		var vars = this.split(/[&;]/);
		var rs = {};
		if (vars.length) vars.each(function(val){
			var keys = val.split('=');
			if (keys.length && keys.length == 2){
				rs[(encodeKeys)?encodeURIComponent(keys[0]):keys[0]] = (encodeValues)?encodeURIComponent(keys[1]):keys[1];
			}
		});
		return rs;
	},
	tidy: function(){
		var txt = this.toString();
		$each({
			"[\xa0\u2002\u2003\u2009]": " ",
			"\xb7": "*",
			"[\u2018\u2019]": "'",
			"[\u201c\u201d]": '"',
			"\u2026": "...",
			"\u2013": "-",
			"\u2014": "--",
			"\uFFFD": "&raquo;"
		}, function(value, key){
			txt = txt.replace(new RegExp(key, 'g'), value);
		});
		return txt;
	},
	cleanQueryString: function(method){
		return this.split("&").filter(method||function(set){
			return $chk(set.split("=")[1]);
		}).join("&");
	}
});


/*
Script: Element.Measure.js
	Extends the Element native object to include methods useful in measuring dimensions.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/

Element.implement({

	expose: function(){
		if (this.getStyle('display') != 'none') return $empty;
		var before = {};
		var styles = { visibility: 'hidden', display: 'block', position:'absolute' };
		//use this method instead of getStyles 
		$each(styles, function(value, style){
			before[style] = this.style[style]||'';
		}, this);
		//this.getStyles('visibility', 'display', 'position');
		this.setStyles(styles);
		return (function(){ this.setStyles(before); }).bind(this);
	},
	
	getDimensions: function(options){
		options = $merge({computeSize: false},options);
		var dim = {};
		function getSize(el, options){
			return (options.computeSize)?el.getComputedSize(options):el.getSize();
		};
		if (this.getStyle('display') == 'none'){
			var restore = this.expose();
			dim = getSize(this, options); //works now, because the display isn't none
			restore(); //put it back where it was
		} else {
			try { //safari sometimes crashes here, so catch it
				dim = getSize(this, options);
			}catch(e){}
		}
		return $chk(dim.x)?$extend(dim, {width: dim.x, height: dim.y}):$extend(dim, {x: dim.width, y: dim.height});
	},
	
	getComputedSize: function(options){
		options = $merge({
			styles: ['padding','border'],
			plains: {height: ['top','bottom'], width: ['left','right']},
			mode: 'both'
		}, options);
		var size = {width: 0,height: 0};
		switch (options.mode){
			case 'vertical':
				delete size.width;
				delete options.plains.width;
				break;
			case 'horizontal':
				delete size.height;
				delete options.plains.height;
				break;
		};
		var getStyles = [];
		//this function might be useful in other places; perhaps it should be outside this function?
		$each(options.plains, function(plain, key){
			plain.each(function(edge){
				options.styles.each(function(style){
					getStyles.push((style=="border")?style+'-'+edge+'-'+'width':style+'-'+edge);
				});
			});
		});
		var styles = this.getStyles.apply(this, getStyles);
		var subtracted = [];
		$each(options.plains, function(plain, key){ //keys: width, height, plains: ['left','right'], ['top','bottom']
			size['total'+key.capitalize()] = 0;
			size['computed'+key.capitalize()] = 0;
			plain.each(function(edge){ //top, left, right, bottom
				size['computed'+edge.capitalize()] = 0;
				getStyles.each(function(style,i){ //padding, border, etc.
					//'padding-left'.test('left') size['totalWidth'] = size['width']+[padding-left]
					if (style.test(edge)){
						styles[style] = styles[style].toInt(); //styles['padding-left'] = 5;
						if (isNaN(styles[style]))styles[style]=0;
						size['total'+key.capitalize()] = size['total'+key.capitalize()]+styles[style];
						size['computed'+edge.capitalize()] = size['computed'+edge.capitalize()]+styles[style];
					}
					//if width != width (so, padding-left, for instance), then subtract that from the total
					if (style.test(edge) && key!=style && 
						(style.test('border') || style.test('padding')) && !subtracted.contains(style)){
						subtracted.push(style);
						size['computed'+key.capitalize()] = size['computed'+key.capitalize()]-styles[style];
					}
				});
			});
		});
		if ($chk(size.width)){
			size.width = size.width+this.offsetWidth+size.computedWidth;
			size.totalWidth = size.width + size.totalWidth;
			delete size.computedWidth;
		}
		if ($chk(size.height)){
			size.height = size.height+this.offsetHeight+size.computedHeight;
			size.totalHeight = size.height + size.totalHeight;
			delete size.computedHeight;
		}
		return $extend(styles, size);
	}
});


/*
Script: Element.Pin.js
	Extends the Element native object to include the pin method useful for fixed positioning for elements.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/

window.addEvent('domready', function(){
	var test = new Element('div').setStyles({
		position: 'fixed',
		top: 0,
		right: 0
	}).inject(document.body);
	var supported = (test.offsetTop === 0);
	test.dispose();
	Browser.supportsPositionFixed = supported;
});

Element.implement({
	pin: function(enable){
		if (this.getStyle('display') == 'none'){
			dbug.log('cannot pin ' + this + ' because it is hidden');
			return;
		}
		if (enable!==false){
			var p = this.getPosition();
			if (!this.get('pinned')){
				var pos = {
					top: (p.y - window.getScroll().y),
					left: (p.x - window.getScroll().x)
				};
				if (Browser.supportsPositionFixed){
					this.setStyle('position','fixed').setStyles(pos);
				} else {
					this.setStyles({
						position: 'absolute',
						top: p.y,
						left: p.x
					});
					window.addEvent('scroll', function(){
						if (this.get('pinned')){
							var to = {
								top: (pos.top.toInt() + window.getScroll().y),
								left: (pos.left.toInt() + window.getScroll().x)
							};
							this.setStyles(to);
						}
					}.bind(this));
				}
				this.set('pinned', true);
			}
		} else {
			var op;
			if (!Browser.Engine.trident){
				if (this.getParent().getComputedStyle('position') != 'static') op = this.getParent();
				else op = this.getParent().getOffsetParent();
			}
			var p = this.getPosition(op);
			this.set('pinned', false);
			var reposition = (Browser.get('supportsPositionFixed'))?
				{
					top: (p.y + window.getScroll().y),
					left: (p.x + window.getScroll().x)
				}:
				{
					top: (p.y),
					left: (p.x)
				};
			this.setStyles($merge(reposition, {position: 'absolute'}));
		}
		return this;
	},
	unpin: function(){
		return this.pin(false);
	},
	togglepin: function(){
		this.pin(!this.get('pinned'));
	}
});


/*
Script: Element.Position.js
	Extends the Element native object to include methods useful positioning elements relative to others.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/

Element.implement({

	setPosition: function(options){
		$each(options||{}, function(v, k){ if (!$defined(v)) delete options[k]; });
		options = $merge({
			relativeTo: document.body,
			position: {
				x: 'center', //left, center, right
				y: 'center' //top, center, bottom
			},
			edge: false,
			offset: {x:0,y:0},
			returnPos: false,
			relFixedPosition: false,
			ignoreMargins: false
		}, options);
		//compute the offset of the parent positioned element if this element is in one
		var parentOffset = {x: 0, y: 0};
		var parentPositioned = false;
		var putItBack = this.expose();
    /* dollar around getOffsetParent should not be necessary, but as it does not return 
     * a mootools extended element in IE, an error occurs on the call to expose. See:
		 * http://mootools.lighthouseapp.com/projects/2706/tickets/333-element-getoffsetparent-inconsistency-between-ie-and-other-browsers */
		var offsetParent = $(this.getOffsetParent());
		putItBack();
		if (offsetParent && offsetParent != this.getDocument().body){
			var putItBack = offsetParent.expose();
			parentOffset = offsetParent.getPosition();
			putItBack();
			parentPositioned = true;
			options.offset.x = options.offset.x - parentOffset.x;
			options.offset.y = options.offset.y - parentOffset.y;
		}
		//upperRight, bottomRight, centerRight, upperLeft, bottomLeft, centerLeft
		//topRight, topLeft, centerTop, centerBottom, center
		function fixValue(option){
			if ($type(option) != "string") return option;
			option = option.toLowerCase();
			var val = {};
			if (option.test('left')) val.x = 'left';
			else if (option.test('right')) val.x = 'right';
			else val.x = 'center';

			if (option.test('upper')||option.test('top')) val.y = 'top';
			else if (option.test('bottom')) val.y = 'bottom';
			else val.y = 'center';
			return val;
		};
		options.edge = fixValue(options.edge);
		options.position = fixValue(options.position);
		if (!options.edge){
			if (options.position.x == 'center' && options.position.y == 'center') options.edge = {x:'center',y:'center'};
			else options.edge = {x:'left',y:'top'};
		}
		
		this.setStyle('position', 'absolute');
		var rel = $(options.relativeTo) || document.body;
		var top = (rel == document.body)?window.getScroll().y:rel.getPosition().y;
		var left = (rel == document.body)?window.getScroll().x:rel.getPosition().x;
		
		if (top < 0) top = 0;
		if (left < 0) left = 0;
		var dim = this.getDimensions({computeSize: true, styles:['padding', 'border','margin']});
		if (options.ignoreMargins){
			options.offset.x = options.offset.x - dim['margin-left'];
			options.offset.y = options.offset.y - dim['margin-top'];
		}
		var pos = {};
		var prefY = options.offset.y.toInt();
		var prefX = options.offset.x.toInt();
		switch(options.position.x){
			case 'left':
				pos.x = left + prefX;
				break;
			case 'right':
				pos.x = left + prefX + rel.offsetWidth;
				break;
			default: //center
				pos.x = left + (((rel == document.body)?window.getSize().x:rel.offsetWidth)/2) + prefX;
				break;
		};
		switch(options.position.y){
			case 'top':
				pos.y = top + prefY;
				break;
			case 'bottom':
				pos.y = top + prefY + rel.offsetHeight;
				break;
			default: //center
				pos.y = top + (((rel == document.body)?window.getSize().y:rel.offsetHeight)/2) + prefY;
				break;
		};
		
		if (options.edge){
			var edgeOffset = {};
			
			switch(options.edge.x){
				case 'left':
					edgeOffset.x = 0;
					break;
				case 'right':
					edgeOffset.x = -dim.x-dim.computedRight-dim.computedLeft;
					break;
				default: //center
					edgeOffset.x = -(dim.x/2);
					break;
			};
			switch(options.edge.y){
				case 'top':
					edgeOffset.y = 0;
					break;
				case 'bottom':
					edgeOffset.y = -dim.y-dim.computedTop-dim.computedBottom;
					break;
				default: //center
					edgeOffset.y = -(dim.y/2);
					break;
			};
			pos.x = pos.x+edgeOffset.x;
			pos.y = pos.y+edgeOffset.y;
		}
		pos = {
			left: ((pos.x >= 0 || parentPositioned)?pos.x:0).toInt(),
			top: ((pos.y >= 0 || parentPositioned)?pos.y:0).toInt()
		};
		if (rel.getStyle('position') == "fixed"||options.relFixedPosition){
			pos.top = pos.top.toInt() + window.getScroll().y;
			pos.left = pos.left.toInt() + window.getScroll().x;
		}

		if (options.returnPos) return pos;
		else this.setStyles(pos);
		return this;
	}
});


/*
Script: Element.Shortcuts.js
	Extends the Element native object to include some shortcut methods.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/

Element.implement({
	isVisible: function(){
		return this.getStyle('display') != 'none';
	},
	toggle: function(){
		return this[this.isVisible() ? 'hide' : 'show']();
	},
	hide: function(){
		var d;
		try {
			//IE fails here if the element is not in the dom
			if ('none' != this.getStyle('display')) d = this.getStyle('display');
		} catch(e){}
		this.store('originalDisplay', d||'block'); 
		this.setStyle('display','none');
		return this;
	},
	show: function(display){
		original = this.retrieve('originalDisplay')?this.retrieve('originalDisplay'):this.get('originalDisplay');
		this.setStyle('display',(display || original || 'block'));
		return this;
	},
	swapClass: function(remove, add){
		return this.removeClass(remove).addClass(add);
	},
	//TODO
	//DO NOT USE THIS METHOD
	//it is temporary, as Mootools 1.1 will negate its requirement
	fxOpacityOk: function(){
		return !Browser.Engine.trident4;
	}
});

/*
Script: Fx.Reveal.js
	Defines Fx.Reveal, a class that shows and hides elements with a transition.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
Fx.Reveal = new Class({
	Extends: Fx.Morph,
	options: {
		styles: ['padding','border','margin'],
		transitionOpacity: true,
		mode:'vertical',
		heightOverride: null,
		widthOverride: null
/*		onShow: $empty,
		onHide: $empty */
	},
	dissolve: function(){
		try {
			if (!this.hiding && !this.showing){
				if (this.element.getStyle('display') != 'none'){
					this.hiding = true;
					this.showing = false;
					this.hidden = true;
					var startStyles = this.element.getComputedSize({
						styles: this.options.styles,
						mode: this.options.mode
					});
					var setToAuto = this.element.style.height === ""||this.element.style.height=="auto";
					this.element.setStyle('display', 'block');
					if (this.element.fxOpacityOk() && this.options.transitionOpacity) startStyles.opacity = 1;
					var zero = {};
					$each(startStyles, function(style, name){
						zero[name] = [style, 0]; 
					}, this);
					var overflowBefore = this.element.getStyle('overflow');
					this.element.setStyle('overflow', 'hidden');
					//put the final fx method at the front of the chain
					if (!this.$chain) this.$chain = [];
					this.$chain.unshift(function(){
						if (this.hidden){
							this.hiding = false;
							$each(startStyles, function(style, name){
								startStyles[name] = style;
							}, this);
							this.element.setStyles($merge({display: 'none', overflow: overflowBefore}, startStyles));
							if (setToAuto) this.element.setStyle('height', 'auto');
						}
						this.fireEvent('onShow', this.element);
						this.callChain();
					}.bind(this));
					this.start(zero);
				} else {
					this.callChain.delay(10, this);
					this.fireEvent('onComplete', this.element);
					this.fireEvent('onHide', this.element);
				}
			}
		} catch(e){
			this.hiding = false;
			this.element.hide();
			this.callChain.delay(10, this);
			this.fireEvent('onComplete', this.element);
			this.fireEvent('onHide', this.element);
		}
		return this;
	},
	reveal: function(){
		try {
			if (!this.showing && !this.hiding){
				if (this.element.getStyle('display') == "none" || 
					 this.element.getStyle('visiblity') == "hidden" || 
					 this.element.getStyle('opacity')==0){
					this.showing = true;
					this.hiding = false;
					this.hidden = false;
					//toggle display, but hide it
					var before = this.element.getStyles('visibility', 'display', 'position');
					this.element.setStyles({
						visibility: 'hidden',
						display: 'block',
						position:'absolute'
					});
					var setToAuto = this.element.style.height === ""||this.element.style.height=="auto";
					//enable opacity effects
					if (this.element.fxOpacityOk() && this.options.transitionOpacity) this.element.setStyle('opacity',0);
					//create the styles for the opened/visible state
					var startStyles = this.element.getComputedSize({
						styles: this.options.styles,
						mode: this.options.mode
					});
					//reset the styles back to hidden now
					this.element.setStyles(before);
					$each(startStyles, function(style, name){
						startStyles[name] = style;
					}, this);
					//if we're overridding height/width
					if ($chk(this.options.heightOverride)) startStyles['height'] = this.options.heightOverride.toInt();
					if ($chk(this.options.widthOverride)) startStyles['width'] = this.options.widthOverride.toInt();
					if (this.element.fxOpacityOk() && this.options.transitionOpacity) startStyles.opacity = 1;
					//create the zero state for the beginning of the transition
					var zero = { 
						height: 0,
						display: 'block'
					};
					$each(startStyles, function(style, name){ zero[name] = 0 }, this);
					var overflowBefore = this.element.getStyle('overflow');
					//set to zero
					this.element.setStyles($merge(zero, {overflow: 'hidden'}));
					//start the effect
					this.start(startStyles);
					if (!this.$chain) this.$chain = [];
					this.$chain.unshift(function(){
						if (!this.options.heightOverride && setToAuto){
							if (["vertical", "both"].contains(this.options.mode)) this.element.setStyle('height', 'auto');
							if (["width", "both"].contains(this.options.mode)) this.element.setStyle('width', 'auto');
						}
						if (!this.hidden) this.showing = false;
						this.element.setStyle('overflow', overflowBefore);
						this.callChain();
						this.fireEvent('onShow', this.element);
					}.bind(this));
				} else {
					this.callChain();
					this.fireEvent('onComplete', this.element);
					this.fireEvent('onShow', this.element);
				}
			}
		} catch(e){
			this.element.setStyles({
				display: 'block',
				visiblity: 'visible',
				opacity: 1
			});
			this.showing = false;
			this.callChain.delay(10, this);
			this.fireEvent('onComplete', this.element);
			this.fireEvent('onShow', this.element);
		}
		return this;
	},
	toggle: function(){
		try {
			if (this.element.getStyle('display') == "none" || 
				 this.element.getStyle('visiblity') == "hidden" || 
				 this.element.getStyle('opacity')==0){
				this.reveal();
		 	} else {
				this.dissolve();
			}
		} catch(e){ this.show(); }
	 return this;
	}
});

Element.Properties.reveal = {

	set: function(options){
		var reveal = this.retrieve('reveal');
		if (reveal) reveal.cancel();
		return this.eliminate('reveal').store('reveal:options', $extend({link: 'cancel'}, options));
	},

	get: function(options){
		if (options || !this.retrieve('reveal')){
			if (options || !this.retrieve('reveal:options')) this.set('reveal', options);
			this.store('reveal', new Fx.Reveal(this, this.retrieve('reveal:options')));
		}
		return this.retrieve('reveal');
	}

};

Element.Properties.dissolve = Element.Properties.reveal;

Element.implement({

	reveal: function(options){
		this.get('reveal', options).reveal();
		return this;
	},
	
	dissolve: function(options){
		this.get('reveal', options).dissolve();
		return this;
	}

});

Element.implement({
	nix: function(){
		var  params = Array.link(arguments, {destroy: Boolean.type, options: Object.type});
		this.get('reveal', params.options).dissolve().chain(function(){
			this[params.destroy?'destroy':'erase']();
		}.bind(this));
		return this;
	}
});


/*
Script: StyleWriter.js

Provides a simple method for injecting a css style element into the DOM if it's not already present.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/

var StyleWriter = new Class({
	createStyle: function(css, id){
		window.addEvent('domready', function(){
			try {
				if ($(id) && id) return;
				var style = new Element('style', {id: id||''}).inject($$('head')[0]);
				if (Browser.Engine.trident) style.styleSheet.cssText = css;
				else style.set('text', css);
			}catch(e){dbug.log('error: %s',e);}
		}.bind(this));
	}
});

/*
Script: StickyWin.js

Creates a div within the page with the specified contents at the location relative to the element you specify; basically an in-page popup maker.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/

var StickyWin = new Class({
	Implements: [Options, Events, StyleWriter],
	options: {
//	onDisplay: $empty,
//	onClose: $empty,
		closeClassName: 'closeSticky',
		pinClassName: 'pinSticky',
		content: '',
		zIndex: 10000,
		className: '',
		//id: ... set above in initialize function
/*  these are the defaults for setPosition anyway
/************************************************
//		edge: false, //see Element.setPosition in element.cnet.js
//		position: 'center', //center, corner == upperLeft, upperRight, bottomLeft, bottomRight
//		offset: {x:0,y:0},
//	  relativeTo: document.body, */
		width: false,
		height: false,
		timeout: -1,
		allowMultipleByClass: false,
		allowMultiple: true,
		showNow: true,
		useIframeShim: true,
		iframeShimSelector: ''
	},
	css: '.SWclearfix:after {content: "."; display: block; height: 0; clear: both; visibility: hidden;}'+
			 '.SWclearfix {display: inline-table;}'+
			 '* html .SWclearfix {height: 1%;}'+
			 '.SWclearfix {display: block;}',
	initialize: function(options){
		this.options.inject = {
			target: document.body,
			where: 'bottom' 
		};
		this.setOptions(options);
		
		this.id = this.options.id || 'StickyWin_'+new Date().getTime();
		this.makeWindow();
		if (this.options.content) this.setContent(this.options.content);
		if (this.options.timeout > 0){
			this.addEvent('onDisplay', function(){
				this.hide.delay(this.options.timeout, this)
			}.bind(this));
		}
		if (this.options.showNow) this.show();
		//add css for clearfix
		this.createStyle(this.css, 'StickyWinClearFix');
	},
	toElement: function(){
		return this.win;
	},
	makeWindow: function(){
		this.destroyOthers();
		if (!$(this.id)){
			this.win = new Element('div', {
				id:		this.id
			}).addClass(this.options.className).addClass('StickyWinInstance').addClass('SWclearfix').setStyles({
			 	display:'none',
				position:'absolute',
				zIndex:this.options.zIndex
			}).inject(this.options.inject.target, this.options.inject.where).store('StickyWin', this);			
		} else this.win = $(this.id);
		if (this.options.width && $type(this.options.width.toInt())=="number") this.win.setStyle('width', this.options.width.toInt());
		if (this.options.height && $type(this.options.height.toInt())=="number") this.win.setStyle('height', this.options.height.toInt());
		return this;
	},
	show: function(){
		this.fireEvent('onDisplay');
		this.showWin();
		if (this.options.useIframeShim) this.showIframeShim();
		this.visible = true;
		return this;
	},
	showWin: function(){
		this.win.setStyle('display','block');
		if (!this.positioned) this.position();
	},
	hide: function(suppressEvent){
		if (!suppressEvent) this.fireEvent('onClose');
		this.hideWin();
		if (this.options.useIframeShim) this.hideIframeShim();
		this.visible = false;
		return this;
	},
	hideWin: function(){
		this.win.setStyle('display','none');
	},
	destroyOthers: function(){
		if (!this.options.allowMultipleByClass || !this.options.allowMultiple){
			$$('div.StickyWinInstance').each(function(sw){
				if (!this.options.allowMultiple || (!this.options.allowMultipleByClass && sw.hasClass(this.options.className))) 
					sw.dispose();
			}, this);
		}
	},
	setContent: function(html){
		if (this.win.getChildren().length>0) this.win.empty();
		if ($type(html) == "string") this.win.set('html', html);
		else if ($(html)) this.win.adopt(html);
		this.win.getElements('.'+this.options.closeClassName).each(function(el){
			el.addEvent('click', this.hide.bind(this));
		}, this);
		this.win.getElements('.'+this.options.pinClassName).each(function(el){
			el.addEvent('click', this.togglepin.bind(this));
		}, this);
		return this;
	},	
	position: function(){
		this.positioned = true;
		this.win.setPosition({
			relativeTo: this.options.relativeTo,
			position: this.options.position,
			offset: this.options.offset,
			edge: this.options.edge
		});
		if (this.shim) this.shim.position();
		return this;
	},
	pin: function(pin){
		if (!this.win.pin){
			dbug.log('you must include element.pin.js!');
			return this;
		}
		this.pinned = $pick(pin, true);
		this.win.pin(pin);
		return this;
	},
	unpin: function(){
		return this.pin(false);
	},
	togglepin: function(){
		return this.pin(!this.pinned);
	},
	makeIframeShim: function(){
		if (!this.shim){
			var el = (this.options.iframeShimSelector)?this.win.getElement(this.options.iframeShimSelector):this.win;
			this.shim = new IframeShim(el, {
				display: false,
				name: 'StickyWinShim'
			});
		}
	},
	showIframeShim: function(){
		if (this.options.useIframeShim){
			this.makeIframeShim();
			this.shim.show();
		}
	},
	hideIframeShim: function(){
		if (this.shim) this.shim.hide();
	},
	destroy: function(){
		if (this.win) this.win.dispose();
		if (this.options.useIframeShim) this.shim.dispose();
		if ($('modalOverlay'))$('modalOverlay').dispose();
	}
});


/*
Script: StickyWin.ui.js

Creates an html holder for in-page popups using a default style.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/

StickyWin.ui = function(caption, body, options){
	options = $extend({
		width: 300,
		css: "div.DefaultStickyWin div.body{font-family:verdana; font-size:11px; line-height: 13px;}"+
			"div.DefaultStickyWin div.top_ul{background:url({%baseHref%}full.png) top left no-repeat; height:30px; width:15px; float:left}"+
			"div.DefaultStickyWin div.top_ur{position:relative; left:0px !important; left:-4px; background:url({%baseHref%}full.png) top right !important; height:30px; margin:0px 0px 0px 15px !important; margin-right:-4px; padding:0px}"+
			"div.DefaultStickyWin h1.caption{clear: none !important; margin:0px 5px 0px 0px !important; overflow: hidden; padding:0 !important; font-weight:bold; color:#555; font-size:14px !important; position:relative; top:8px !important; left:5px !important; float: left; height: 22px !important;}"+
			"div.DefaultStickyWin div.middle, div.DefaultStickyWin div.closeBody {background:url({%baseHref%}body.png) top left repeat-y; margin:0px 20px 0px 0px !important;	margin-bottom: -3px; position: relative;	top: 0px !important; top: -3px;}"+
			"div.DefaultStickyWin div.body{background:url({%baseHref%}body.png) top right repeat-y; padding:8px 30px 8px 0px !important; margin-left:5px !important; position:relative; right:-20px !important;}"+
			"div.DefaultStickyWin div.bottom{clear:both}"+
			"div.DefaultStickyWin div.bottom_ll{background:url({%baseHref%}full.png) bottom left no-repeat; width:15px; height:15px; float:left}"+
			"div.DefaultStickyWin div.bottom_lr{background:url({%baseHref%}full.png) bottom right; position:relative; left:0px !important; left:-4px; margin:0px 0px 0px 15px !important; margin-right:-4px; height:15px}"+
			"div.DefaultStickyWin div.closeButtons{text-align: center; background:url({%baseHref%}body.png) top right repeat-y; padding: 0px 30px 8px 0px; margin-left:5px; position:relative; right:-20px}"+
			"div.DefaultStickyWin a.button:hover{background:url({%baseHref%}big_button_over.gif) repeat-x}"+
			"div.DefaultStickyWin a.button {background:url({%baseHref%}big_button.gif) repeat-x; margin: 2px 8px 2px 8px; padding: 2px 12px; cursor:pointer; border: 1px solid #999 !important; text-decoration:none; color: #000 !important;}"+
			"div.DefaultStickyWin div.closeButton{width:13px; height:13px; background:url({%baseHref%}closebtn.gif) no-repeat; position: absolute; right: 0px; margin:10px 15px 0px 0px !important; cursor:pointer}"+
			"div.DefaultStickyWin div.dragHandle {	width: 11px;	height: 25px;	position: relative;	top: 5px;	left: -3px;	cursor: move;	background: url({%baseHref%}drag_corner.gif); float: left;}",
		cornerHandle: false,
		cssClass: '',
		baseHref: 'http://www.cnet.com/html/rb/assets/global/stickyWinHTML/',
		buttons: []
/*	These options are deprecated:		
		closeTxt: false,
		onClose: $empty,
		confirmTxt: false,
		onConfirm: $empty	*/
	}, options);
	//legacy support
	if (options.confirmTxt) options.buttons.push({text: options.confirmTxt, onClick: options.onConfirm || $empty});
	if (options.closeTxt) options.buttons.push({text: options.closeTxt, onClick: options.onClose || $empty});

	new StyleWriter().createStyle(options.css.substitute({baseHref: options.baseHref}, /\\?\{%([^}]+)%\}/g), 'defaultStickyWinStyle');
	caption = $pick(caption, '%caption%');
	body = $pick(body, '%body%');
	var container = new Element('div').setStyle('width', options.width).addClass('DefaultStickyWin');
	if (options.cssClass) container.addClass(options.cssClass);
	//header
	var h1Caption = new Element('h1').addClass('caption').setStyle('width', (options.width.toInt()-(options.cornerHandle?70:60)));

	if ($(caption)) h1Caption.adopt(caption);
	else h1Caption.set('html', caption);
	
	var bodyDiv = new Element('div').addClass('body');
	if ($(body)) bodyDiv.adopt(body);
	else bodyDiv.set('html', body);
	
	var top_ur = new Element('div').addClass('top_ur').adopt(
			new Element('div').addClass('closeButton').addClass('closeSticky')
		).adopt(h1Caption);
	if (options.cornerHandle) new Element('div').addClass('dragHandle').inject(top_ur, 'top');
	else h1Caption.addClass('dragHandle');
	container.adopt(
		new Element('div').addClass('top').adopt(
				new Element('div').addClass('top_ul')
			).adopt(top_ur)
	);
	//body
	container.adopt(new Element('div').addClass('middle').adopt(bodyDiv));
	//close buttons
	if (options.buttons.length > 0){
		var closeButtons = new Element('div').addClass('closeButtons');
		options.buttons.each(function(button){
			if (button.properties && button.properties.className){
				button.properties['class'] = button.properties.className;
				delete button.properties.className;
			}
			var properties = $merge({'class': 'closeSticky'}, button.properties);
			new Element('a').addEvent('click',
				button.onClick || $empty).appendText(
				button.text).inject(closeButtons).setProperties(properties).addClass('button');
		});
		container.adopt(new Element('div').addClass('closeBody').adopt(closeButtons));
	}
	//footer
	container.adopt(
		new Element('div').addClass('bottom').adopt(
				new Element('div').addClass('bottom_ll')
			).adopt(
				new Element('div').addClass('bottom_lr')
		)
	);
	return container;
};


/*
Script: Waiter.js

Adds a semi-transparent overlay over a dom element with a spinnin ajax icon.

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/
var Waiter = new Class({
	Implements: [Options, Events, Chain],
	options: {
		baseHref: 'http://www.cnet.com/html/rb/assets/global/waiter/',
		containerProps: {
			styles: {
				position: 'absolute',
				'text-align': 'center'
			},
			'class':'waiterContainer'
		},
		containerPosition: {},
		msg: false,
		msgProps: {
			styles: {
				'text-align': 'center',
				fontWeight: 'bold'
			},
			'class':'waiterMsg'
		},
		img: {
			src: 'waiter.gif',
			styles: {
				width: 24,
				height: 24
			},
			'class':'waiterImg'
		},
		layer:{
			styles: {
				width: 0,
				height: 0,
				position: 'absolute',
				zIndex: 999,
				display: 'none',
				opacity: 0.9,
				background: '#fff'
			},
			'class': 'waitingDiv'
		},
		useIframeShim: true,
		fxOptions: {}
//	iframeShimOptions: {},
//	onShow: $empty
//	onHide: $empty
	},
	initialize: function(target, options){
		this.target = $(target)||$(document.body);
		this.setOptions(options);
		this.waiterContainer = new Element('div', this.options.containerProps).inject(document.body);
		if (this.options.msg){
			this.msgContainer = new Element('div', this.options.msgProps);
			this.waiterContainer.adopt(this.msgContainer);
			if (!$(this.options.msg)) this.msg = new Element('p').appendText(this.options.msg);
			else this.msg = $(this.options.msg);
			this.msgContainer.adopt(this.msg);
		}
		if (this.options.img) this.waiterImg = $(this.options.img.id) || new Element('img').inject(this.waiterContainer);
		this.waiterOverlay = $(this.options.layer.id) || new Element('div').inject(document.body).adopt(this.waiterContainer);
		this.waiterOverlay.set(this.options.layer);
		try {
			if (this.options.useIframeShim) this.shim = new IframeShim(this.waiterOverlay, this.options.iframeShimOptions);
		} catch(e){
			dbug.log("Waiter attempting to use IframeShim but failed; did you include IframeShim? Error: ", e);
			this.options.useIframeShim = false;
		}
		this.waiterFx = this.waiterFx || new Fx.Elements($$(this.waiterContainer, this.waiterOverlay), this.options.fxOptions);
	},
	toggle: function(element, show){
		//the element or the default
		element = $(element) || $(this.active) || $(this.target);
		if (!$(element)) return this;
		if (this.active && element != this.active) return this.stop(this.start.bind(this, element));
		//if it's not active or show is explicit
		//or show is not explicitly set to false
		//start the effect
		if ((!this.active || show) && show !== false) this.start(element);
		//else if it's active and show isn't explicitly set to true
		//stop the effect
		else if (this.active && !show) this.stop();
		return this;
	},
	reset: function(){
		this.waiterFx.cancel().set({
			0: { opacity:[0]},
			1: { opacity:[0]}
		});
	},
	start: function(element){
		this.reset();
		element = $(element) || $(this.target);
		if (this.options.img){
			this.waiterImg.set($merge(this.options.img, {
				src: this.options.baseHref + this.options.img.src
			}));
		}
		
		var start = function(){
			var dim = element.getComputedSize();
			this.active = element;
			this.waiterOverlay.setStyles({
				width: this.options.layer.width||dim.totalWidth,
				height: this.options.layer.height||dim.totalHeight,
				display: 'block'
			}).setPosition({
				relativeTo: element,
				position: 'upperLeft'
			});
			this.waiterContainer.setPosition({
				relativeTo: this.waiterOverlay
			});
			if (this.options.useIframeShim) this.shim.show();
			this.waiterFx.start({
				0: { opacity:[1] },
				1: { opacity:[this.options.layer.styles.opacity]}
			}).chain(function(){
				if (this.active == element) this.fireEvent('onShow', element);
				this.callChain();
			}.bind(this));
		}.bind(this);

		if (this.active && this.active != element) this.stop(start);
		else start();
		
		return this;
	},
	stop: function(callback){
		if (!this.active){
			if ($type(callback) == "function") callback.attempt();
			return this;
		}
		this.waiterFx.cancel();
		this.waiterFx.clearChain();
		//fade the waiter out
		this.waiterFx.start({
			0: { opacity:[0]},
			1: { opacity:[0]}
		}).chain(function(){
			this.active = null;
			this.waiterOverlay.hide();
			if (this.options.useIframeShim) this.shim.hide();
			this.fireEvent('onHide', this.active);
			this.callChain();
			this.clearChain();
			if ($type(callback) == "function") callback.attempt();
		}.bind(this));
		return this;
	}
});

if (typeof Request != "undefined" && Request.HTML){
	Request.HTML = new Class({
		Extends: Request.HTML,
		options: {
			useWaiter: false,
			waiterOptions: {},
			waiterTarget: false
		},
		initialize: function(options){
			this._send = this.send;
			this.send = function(options){
				if (this.waiter) this.waiter.start().chain(this._send.bind(this, options));
				else this._send(options);
				return this;
			};
			this.parent(options);
			if (this.options.useWaiter && ($(this.options.update) || $(this.options.waiterTarget))){
				this.waiter = new Waiter(this.options.waiterTarget || this.options.update, this.options.waiterOptions);
				['onComplete', 'onException', 'onCancel'].each(function(event){
					this.addEvent(event, this.waiter.stop.bind(this.waiter));
				}, this);
			}
		}
	});
}

function setCNETAssetBaseHref(baseHref){
	if (window.StickyWin && StickyWin.ui){
		var CGFstickyWinHTML = StickyWin.ui.bind(window);
		StickyWin.ui = function(caption, body, options){
		    return CGFstickyWinHTML(caption, body, $merge({
		        baseHref: baseHref + '/stickyWinHTML/'
		    }, options));
		};
		if (StickyWin.alert){
			var CGFsimpleErrorPopup = StickyWin.alert.bind(window);
			StickyWin.alert = function(msghdr, msg, base){
			    return CGFsimpleErrorPopup(msghdr, msg, base||baseHref + "/simple.error.popup");
			};
		}
	}
	if (window.TagMaker){
		var store = {};
		var props = ['image', 'anchor', 'cnetVideo'];
		props.each(function(prop){
			store[prop] = TagMaker[prop];
		});
		TagMaker = new Class({
				Extends: TagMaker,
		    options: {
		        baseHref: baseHref + '/tips/'
		    }
		});
		$extend(TagMaker, store);
	}
	
	if (window.ProductPicker){
		var store = {};
		var props = ['picklets', 'add', 'addAllThese', 'getPicklet'];
		props.each(function(prop){
			store[prop] = ProductPicker[prop];
		});
		ProductPicker = new Class({
				Extends: ProductPicker,
		    options:{
		        baseHref: baseHref + '/Picker'
		    }
		});
		$extend(ProductPicker, store);
	}
	
	if (window.Autocompleter){
		var AcCNET = function(orgClass){
			return {
				Extends: orgClass,
				options: {
					baseHref: baseHref + '/autocompleter/'
				}
			};
		};
		Autocompleter.Base = new Class(AcCNET(Autocompleter.Base));
		if (Autocompleter.Ajax){
			["Base", "Xhtml", "Json"].each(function(c){
				if (Autocompleter.Ajax[c]) Autocompleter.Ajax[c] = new Class(AcCNET(Autocompleter.Ajax[c]));
			});
		}
		if (Autocompleter.Local) Autocompleter.Local = new Class(AcCNET(Autocompleter.Local));
		if (Autocompleter.JsonP) Autocompleter.JsonP = new Class(AcCNET(Autocompleter.JsonP));
	}
	
	if (window.Lightbox){
		Lightbox = new Class({
				Extends: Lightbox,
		    options: {
		        assetBaseUrl: baseHref + '/slimbox/'
		    }
		});
	}
	
	if (window.Waiter){
		Waiter = new Class({
			Extends: Waiter,
			options: {
				baseHref: baseHref + '/waiter/'
			}
		});
	}
};