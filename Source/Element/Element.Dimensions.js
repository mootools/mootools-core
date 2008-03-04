/*
Script: Element.Dimensions.js
	Contains methods to work with size, scroll, or positioning of Elements and the window object.

License:
	MIT-style license.

Note:
	Dimensions requires an XHTML doctype.
*/

(function(){

var get = {

	borders: function(el){
		if (is.body(el)) return {x: 0, y: 0};
		return (Browser.Engine.trident) ? {
			x: el.clientLeft, y: el.clientTop
		} : {
			x: get.style(el, 'border-left-width'), y: get.style(el, 'border-top-width')
		};
	},
	
	parent: function(el){
		if (is.body(el)) return null;
		if (!Browser.Engine.trident) return $(el.offsetParent);
		while ((el = el.parentNode)){
			if (is.positioned(el)) return $(el);
		}
		return null;
	},
	
	style: function(el, style){
		return Element.getComputedStyle(el, style).toInt() || 0;
	},

	margins: function(el){
		return {x: get.style(el, 'margin-left'), y: get.style(el, 'margin-top')};
	},

	offsets: function(el){
		return {x: el.offsetLeft, y: el.offsetTop};
	},

	size: function(el){
		return {x: el.offsetWidth, y: el.offsetHeight};
	},

	full: function(el){
		return {x: el.scrollWidth, y: el.scrollHeight};
	},

	scrolls: function(el){
		return {x: el.scrollLeft, y: el.scrollTop};
	}
	
};


var is = {
	
	body: function(el){
		var tag = el.tagName.toLowerCase();
		return !!(tag == 'body' || tag == 'html');
	},

	positioned: function(el){
		return (get.style(el, 'position') != 'static');
	}
	
};

Element.implement({
	
	positioned: function(){
		if (is.body(this)) return true;
		return is.positioned(this);
	},
	
	getOffsetParent: function(){
		return get.parent(this);
	},
	
	getSize: function(){
		if (is.body(this)) return this.getWindow().getSize();
		return get.size(this);
	},
	
	getScrollSize: function(){
		if (is.body(this)) return this.getWindow().getScrollSize();
		return get.full(this);
	},
	
	getScroll: function(){
		if (is.body(this)) return this.getWindow().getScroll();
		return get.scrolls(this);
	},
	
	scrollTo: function(x, y){
		if (is.body(this)){
			this.getWindow().scrollTo(x, y);
		} else {
			this.scrollLeft = x;
			this.scrollTop = y;
		}
	},
	
	getPosition: function(relative, addborders){
		if (is.body(this)) return {x: 0, y: 0};
		var el = this, position = get.offsets(el);
		while ((el = el.offsetParent)){
			var borders = get.borders(el), offsets = get.offsets(el);
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
		var position = this.getPosition(element), size = get.size(this);
		var obj = {left: position.x, top: position.y, width: size.x, height: size.y};
		obj.right = obj.left + obj.width;
		obj.bottom = obj.top + obj.height;
		return obj;
	},
	
	getRelativePosition: function(){
		return this.getPosition(get.parent(this));
	},
	
	computePosition: function(obj){
		var margins = get.margins(this);
		return {left: obj.x - margins.x, top: obj.y - margins.y};
	},

	position: function(obj){
		return this.setStyles(this.computePosition(obj));
	}
	
});

})();

Native.implement([Window, Document], {

	getSize: function(){
		var doc = this.getDocument(), win = this.getWindow(), html = doc.documentElement, body = doc.body;
		if (Browser.Engine.webkit419) return {x: win.innerWidth, y: win.innerHeight};
		if (Browser.Engine.presto925) return {x: body.clientWidth, y: body.clientHeight};
		return {x: html.clientWidth, y: html.clientHeight};
	},

	getScroll: function(){
		var win = this.getWindow(), html = this.getDocument().documentElement;
		return {x: $pick(win.pageXOffset, html.scrollLeft), y: $pick(win.pageYOffset, html.scrollTop)};
	},

	getScrollSize: function(){
		var doc = this.getDocument(), html = doc.documentElement, body = doc.body;
		if (Browser.Engine.trident) return {x: Math.max(html.clientWidth, html.scrollWidth), y: Math.max(html.clientHeight, html.scrollHeight)};
		if (Browser.Engine.webkit) return get.full(body);
		return get.full(html);
	},
	
	getPosition: function(){
		return {x: 0, y: 0};
	},
	
	getCoordinates: function(){
		var size = this.getSize();
		return {top: 0, left: 0, bottom: size.y, right: size.x, height: size.y, width: size.x};
	}

});

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