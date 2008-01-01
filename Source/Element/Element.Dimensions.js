/*
Script: Element.Dimensions.js
	Contains methods to work with size, scroll, or positioning of Elements and the window object.

License:
	MIT-style license.

Note:
	Dimensions requires an XHTML doctype.
*/

(function(){

function $body(el){
	return el.tagName.toLowerCase() == 'body';
};

Element.implement({

	positioned: function(){
		return $body(this) || (Element.getComputedStyle(this, 'position') != 'static');
	},

	getOffsetParent: function(){
		if ($body(this)) return null;
		if (!Browser.Engine.trident) return $(this.offsetParent);
		var el = this;
		while ((el = el.parentNode)){
			if (Element.positioned(el)) return $(el);
		}
		return null;
	},

	getSize: function(){
		return ($body(this)) ? this.getWindow().getSize() : {x: this.offsetWidth, y: this.offsetHeight};
	},

	getScrollSize: function(){
		return ($body(this)) ? this.getWindow().getScrollSize() : {x: this.scrollWidth, y: this.scrollHeight};
	},

	getScroll: function(){
		return ($body(this)) ? this.getWindow().getScroll() : {x: this.scrollLeft, y: this.scrollTop};
	},

	scrollTo: function(x, y){
		if ($body(this)) return this.getWindow().scrollTo(x, y);
		this.scrollLeft = x;
		this.scrollTop = y;
		return this;
	},

	getPosition: function(relative){
		var el = this, position = {x: 0, y: 0};
		if ($body(el)) return position;
		do {
			position.x += el.offsetLeft;
			position.y += el.offsetTop;
		} while((el = el.offsetParent));
		var rpos = (relative) ? $(relative).getPosition() : {x: 0, y: 0};
		return {x: position.x - rpos.x, y: position.y - rpos.y};

		var rpos = (relative) ? $(relative).getPosition() : {x: 0, y: 0};
		return {x: position.x - rpos.x, y: position.y - rpos.y};
	},

	getCoordinates: function(element){
		if ($body(this)) return this.getWindow().getCoordinates();
		var position = this.getPosition(element), size = this.getSize();
		var obj = {top: position.y, left: position.x, width: size.x, height: size.y};
		obj.right = obj.left + obj.width;
		obj.bottom = obj.top + obj.height;
		return obj;
	},

	getRelativePosition: function(){
		return this.getPosition(this.getOffsetParent());
	},

	computePosition: function(obj){
		return {
			left: obj.x - (this.getComputedStyle('margin-left').toInt() || 0),
			top: obj.y - (this.getComputedStyle('margin-top').toInt() || 0)
		};
	},

	position: function(obj){
		return this.setStyles(this.computePosition(obj));
	}

});

})();

Native.implement([Window, Document], {

	getSize: function(){
		var html = this.getDocument().documentElement;
		if (Browser.Engine.webkit419) return {x: this.innerWidth, y: this.innerHeight};
		return {x: html.clientWidth, y: html.clientHeight};
	},

	getScroll: function(){
		var html = this.getDocument().documentElement;
		return {x: $pick(this.pageXOffset, html.scrollLeft), y: $pick(this.pageYOffset, html.scrollTop)};
	},

	getScrollSize: function(){
		var html = this.getDocument().documentElement, body = this.getDocument().body;
		if (Browser.Engine.trident) return {x: Math.max(html.clientWidth, html.scrollWidth), y: Math.max(html.clientHeight, html.scrollHeight)};
		if (!Browser.Engine.webkit) return {x: body.scrollWidth, y: body.scrollHeight};
		return {x: html.scrollWidth, y: html.scrollHeight};
	},

	getPosition: function(){
		return {x: 0, y: 0};
	},

	getCoordinates: function(){
		var size = this.getSize();
		return {top: 0, left: 0, height: size.y, width: size.x, bottom: size.y, right: size.x};
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