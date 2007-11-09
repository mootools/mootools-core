/*
Script: Dimensions.js
	Contains methods to work with size, scroll, or positioning of Elements and the document.

License:
	MIT-style license.

Note:
	Dimensions requires an XHTML doctype.
*/

(function(){

var objects = function(self){
	var doc, great = true;
	switch ($type(self)){
		case 'window': doc = self.document; break;
		case 'document': doc = self; break;
		case 'element': doc = self.ownerDocument; great = false;
	}
	return {doc: doc, win: doc.window, self: self, great: (great || self === doc.body || self === doc.html)};
};

var great = function(self){
	return objects(self).great;
};

var Dimensions = {

	positioned: function(self){
		if (great(self)) return true;
		var style = self.style.position || (self.style.position = Element.getComputedStyle(self, 'position'));
		return (style != 'static');
	},

	getOffsetParent: function(self){
		if (!Browser.Engine.trident) return self.offsetParent;
		var el = self;
		while ((el = el.parentNode)){
			if (Dimensions.positioned(el)) return el;
		}
		return false;
	},

	getOffsetSize: function(self){
		var obj = {}, dims = {X: 'Width', Y: 'Height'}, objs = objects(self);
		for (var Z in dims) obj[Z.toLowerCase()] = (function(){
			if (objs.great){
				if (Browser.Engine.webkit419) return objs.win['inner' + dims[Z]];
				if (Browser.Engine.presto) return objs.doc.body['client' + dims[Z]];
				return objs.doc.documentElement['client' + dims[Z]];
			} else {
				return self['offset' + dims[Z]];
			}
		})();
		return obj;
	},
	
	getScrollSize: function(self){
		var obj = {}, dims = {X: 'Width', Y: 'Height'}, objs = objects(self);
		for (var Z in dims) obj[Z.toLowerCase()] = (function(){
			if (objs.great){
				if (Browser.Engine.trident) return Math.max(objs.doc.documentElement['offset' + dims[Z]], objs.doc.documentElement['scroll' + dims[Z]]);
				if (Browser.Engine.webkit) return objs.doc.body['scroll' + dims[Z]];
				return objs.doc.documentElement.scrollWidth;
			} else {
				return self['scroll' + dims[Z]];
			}
		})();
		return obj;
	},
	
	getScroll: function(self){
		var obj = {}, dims = {X: 'Left', Y: 'Top'}, objs = objects(self);
		for (var Z in dims) obj[Z.toLowerCase()] = (function(){
			return (objs.great) ? objs.win['page' + Z + 'Offset'] || objs.doc.documentElement['scroll' + dims[Z]] : self['scroll' + dims[Z]];
		})();
		return obj;
	},
	
	getPosition: function(self, client){
		if (great(self)) return {x: 0, y: 0};
		
		var el = self, left = self.offsetLeft, top = self.offsetTop;

		if (Browser.Engine.trident){
			while ((el = el.offsetParent) && !Dimensions.positioned(el)){
				left += el.offsetLeft;
				top += el.offsetTop;
			}
			el = self;
		}
		
		var position = {x: left, y: top};
		
		var isPositioned = Dimensions.positioned(self);
		while ((el = el.parentNode)){
			var isOffsetParent = Dimensions.positioned(el);
			if ((!isOffsetParent || client) && ((!isPositioned || isOffsetParent) || Browser.Engine.presto)){
				var scroll = Dimensions.getScroll(el);
				position.x -= scroll.x;
				position.y -= scroll.y;
			}
			if (isOffsetParent) break;
		}

		return position;
	},
	
	getAbsolutePosition: function(self, relative){
		if (great(self) || relative == self) return {x: 0, y: 0};
		var el = self, left = 0, top = 0, position;
		
		while (el){
			var offsetParent = Dimensions.getOffsetParent(el);
			if (!offsetParent) break;
			position = Dimensions.getPosition(el, !great(offsetParent));
			left += position.x;
			top += position.y;
			el = offsetParent;
		}
		
		var rpos = (relative) ? Dimensions.getAbsolutePosition($(relative, true)) : {x: 0, y: 0};
		return {x: left - rpos.x, y: top - rpos.y};
	},
	
	getCoordinates: function(self, relative){
		var position = Dimensions.getAbsolutePosition(self, relative), size = Dimensions.getOffsetSize(self);
		var obj = {'top': position.y, 'left': position.x, 'width': size.x, 'height': size.y};
		obj.right = obj.left + obj.width;
		obj.bottom = obj.top + obj.height;
		return obj;
	}

};

var methods = {};

Hash.each(Dimensions, function(value, key){
	methods[key] = function(arg){
		return value(this, arg);
	};
});

Native.implement([Element, Document], methods);

Document.implement({
	
	scrollTo: function(x, y){
		this.window.scrollTo(x, y);
	}
	
});

Element.implement({
	
	scrollTo: function(x, y){
		this.scrollLeft = x;
		this.scrollTop = y;
	},
	
	computePosition: function(obj, client){
		var scroll, el = this, position = {left: obj.x - this.getComputedStyle('margin-left').toInt() || 0, top: obj.y - this.getComputedStyle('margin-top').toInt() || 0};
		if (client){
			scroll = Dimensions.getScroll(Dimensions.getOffsetParent(this));
			position.left += scroll.x;
			position.top += scroll.y;
		}
		if (Browser.Engine.presto){
			while ((el = el.parentNode) && el != this.offsetParent){
				scroll = Dimensions.getScroll(el);
				position.left += scroll.x;
				position.top += scroll.y;
			}
		}
		return position;
	},
	
	setPosition: function(obj, client){
		return this.setStyles(this.computePosition(obj, client));
	}

});

})();