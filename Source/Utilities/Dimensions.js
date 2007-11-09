(function(){

var objects = function(self){
	var doc, element = false;
	switch ($type(self)){
		case 'element': doc = self.ownerDocument; element = true; break;
		case 'window': doc = self.document; break;
		case 'document': doc = self; break;
	}
	return {doc: doc, win: doc.window, self: self, element: (element && self !== doc.body && self !== doc.html)};
};

var Dimensions = {

	positioned: function(self){
		if (!objects(self).element) return true;
		var style = self.style.position || (self.style.position = Element.getComputedStyle(self, 'position'));
		return (style !== 'static');
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
			if (objs.element){
				return self['offset' + dims[Z]];
			} else {
				if (Browser.Engine.webkit419) return objs.win['inner' + dims[Z]];
				if (Browser.Engine.presto) return objs.doc.body['client' + dims[Z]];
				return objs.doc.documentElement['client' + dims[Z]];
			}
		})();
		return obj;
	},

	getScrollSize: function(self){
		var obj = {}, dims = {X: 'Width', Y: 'Height'}, objs = objects(self);
		for (var Z in dims) obj[Z.toLowerCase()] = (function(){
			if (objs.element){
				return self['scroll' + dims[Z]];
			} else {
				if (Browser.Engine.trident) return Math.max(objs.doc.documentElement['offset' + dims[Z]], objs.doc.documentElement['scroll' + dims[Z]]);
				if (Browser.Engine.webkit) return objs.doc.body['scroll' + dims[Z]];
				return objs.doc.documentElement.scrollWidth;
			}
		})();
		return obj;
	},

	getScroll: function(self){
		var obj = {}, dims = {X: 'Left', Y: 'Top'}, objs = objects(self);
		for (var Z in dims) obj[Z.toLowerCase()] = (function(){
			return (objs.element) ? self['scroll' + dims[Z]] : objs.win['page' + Z + 'Offset'] || objs.doc.documentElement['scroll' + dims[Z]];
		})();
		return obj;
	},

	getPosition: function(self, client){
		if (!objects(self).element) return {x: 0, y: 0};

		var el = self, left = self.offsetLeft, top = self.offsetTop;

		if (Browser.Engine.trident){
			while ((el = el.offsetParent) && !Dimensions.positioned(el)){
				left += el.offsetLeft;
				top += el.offsetTop;
			}
			el = self;
		}

		var position = {x: left, y: top}, isPositioned = Dimensions.positioned(self);

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
		if (!objects(self).element || relative === self) return {x: 0, y: 0};
		var el = self, left = 0, top = 0, position;

		while (el){
			var offsetParent = Dimensions.getOffsetParent(el);
			if (!offsetParent) break;
			position = Dimensions.getPosition(el, objects(offsetParent).element);
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
		var scroll, el = this, position = {left: obj.x - this.getComputedStyle('margin-left').toInt(), top: obj.y - this.getComputedStyle('margin-top').toInt()};
		if (client){
			scroll = Dimensions.getScroll(Dimensions.getOffsetParent(this));
			position.left += scroll.x;
			position.top += scroll.y;
		}
		if (Browser.Engine.presto){
			while ((el = el.parentNode) && el !== this.offsetParent){
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