/*
Script: Element.Dimensions.js
	Contains methods to work with size, scroll, or positioning of Elements and the window object.

License:
	MIT-style license.
*/

(function(){

var get = {

	style: function(el, style){
		return Element.getComputedStyle(el, style).toInt() || 0;
	},

	borders: function(el){
		if (is.body(el)) return {x: 0, y: 0};
		return (Browser.Engine.trident) ? get.clientPosition(el) : {
			x: get.style(el, 'border-left-width'), y: get.style(el, 'border-top-width')
		};
	},

	margins: function(el){
		if (is.body(el)) return {x: 0, y: 0};
		return {x: get.style(el, 'margin-left'), y: get.style(el, 'margin-top')};
	},

	offsetParent: function(el){
		if (is.body(el)) return null;
		if (!Browser.Engine.trident) return el.offsetParent;
		while ((el = el.parentNode)){
			if (is.positioned(el)) return el;
		}
		return null;
	},

	offsetPosition: function(el){
		return {x: el.offsetLeft, y: el.offsetTop};
	},

	offsetSize: function(el){
		return {x: el.offsetWidth, y: el.offsetHeight};
	},

	scrollSize: function(el){
		return {x: el.scrollWidth, y: el.scrollHeight};
	},

	scrollPosition: function(el){
		return {x: el.scrollLeft, y: el.scrollTop};
	},

	clientPosition: function(el){
		return {x: el.clientLeft, y: el.clientTop};
	},

	clientSize: function(el){
		return {x: el.clientWidth, y: el.clientHeight};
	}

};


var is = {

	body: function(el){
		var tag = el.tagName.toLowerCase();
		return (tag == 'body' || tag == 'html');
	},

	positioned: function(el){
		if (is.body(el)) return true;
		var position = Element.getComputedStyle(el, 'position');
		return (Browser.Engine.trident) ? (position == 'absolute' || position == 'fixed') : (position != 'static');
	}

};

Element.implement({

	positioned: function(){
		return is.positioned(this);
	},

	getOffsetParent: function(){
		return $(get.offsetParent(this));
	},

	getSize: function(){
		if (is.body(this)) return this.getWindow().getSize();
		return get.offsetSize(this);
	},

	getScrollSize: function(){
		if (is.body(this)) return this.getWindow().getScrollSize();
		return get.scrollSize(this);
	},

	getScroll: function(){
		if (is.body(this)) return this.getWindow().getScroll();
		return get.scrollPosition(this);
	},

	scrollTo: function(x, y){
		if (is.body(this)){
			this.getWindow().scrollTo(x, y);
		} else {
			this.scrollLeft = x;
			this.scrollTop = y;
		}
		return this;
	},

	getPosition: function(relative){
		if (is.body(this)) return {x: 0, y: 0};
		var el = this, position = get.offsetPosition(el);
		while ((el = get.offsetParent(el)) && !is.body(el)){
			var borders = (!Browser.Engine.presto) ? get.borders(el) : {x: 0, y: 0};
			var offsets = get.offsetPosition(el);
			position.x += offsets.x + borders.x;
			position.y += offsets.y  + borders.y;
		}
		if (relative === true){
			var add = get.borders(this);
			position.x += add.x;
			position.y += add.y;
		}
		relative = $(relative);
		var rpos = (relative) ? relative.getPosition(true) : {x: 0, y: 0};
		return {x: position.x - rpos.x, y: position.y - rpos.y};
	},

	getCoordinates: function(element){
		if (is.body(this)) return this.getWindow().getCoordinates();
		var position = this.getPosition(element), size = get.offsetSize(this);
		var obj = {left: position.x, top: position.y, width: size.x, height: size.y};
		obj.right = obj.left + obj.width;
		obj.bottom = obj.top + obj.height;
		return obj;
	},

	getRelativePosition: function(){
		return this.getPosition(get.offsetParent(this));
	},

	computePosition: function(obj){
		var margins = get.margins(this);
		return {left: obj.x - margins.x, top: obj.y - margins.y};
	},

	position: function(obj){
		return this.setStyles(this.computePosition(obj));
	}

});

Native.implement([Window, Document], {

	getSize: function(){
		var doc = this.getDocument(), win = this.getWindow(), html = doc.documentElement, body = doc.body;
		if (Browser.Engine.webkit419) return {x: win.innerWidth, y: win.innerHeight};
		if (Browser.Engine.presto925) return get.clientSize(body);
		return get.clientSize(html);
	},

	getScroll: function(){
		var win = this.getWindow(), html = this.getDocument().documentElement;
		return {x: $pick(win.pageXOffset, html.scrollLeft), y: $pick(win.pageYOffset, html.scrollTop)};
	},

	getScrollSize: function(){
		var doc = this.getDocument(), html = doc.documentElement, body = doc.body;
		if (Browser.Engine.trident) return {x: Math.max(html.clientWidth, html.scrollWidth), y: Math.max(html.clientHeight, html.scrollHeight)};
		if (Browser.Engine.webkit) return get.scrollSize(body);
		return get.scrollSize(html);
	},

	getPosition: function(){
		return {x: 0, y: 0};
	},

	getCoordinates: function(){
		var size = this.getSize();
		return {top: 0, left: 0, bottom: size.y, right: size.x, height: size.y, width: size.x};
	}

});

})();

Native.implement([Window, Document, Element], {

	getHeight: function(){
		return this.getSize().y;
	},

	getWidth: function(){
		return this.getSize().x;
	},

	getScrollTop: function(){
		return this.getScroll().y;
	},

	getScrollLeft: function(){
		return this.getScroll().x;
	},

	getScrollHeight: function(){
		return this.getScrollSize().y;
	},

	getScrollWidth: function(){
		return this.getScrollSize().x;
	},

	getTop: function(){
		return this.getPosition().y;
	},

	getLeft: function(){
		return this.getPosition().x;
	}

});