(function(){

	var getPosition = Element.prototype.getPosition;
	var getCoordinates = Element.prototype.getCoordinates;

	function isBody(element){
		return (/^(?:body|html)$/i).test(element.tagName);
	};

	var getSize = Element.prototype.getSize;

	Element.implement({
	
		getSize: function(){
			console.warn('1.1 > 1.2: NOTE: getSize is different in 1.2; it no longer returns values for size, scroll, and scrollSize, but instead just returns x/y values for the dimensions of the element.');
			var size = getSize.apply(this, arguments);
			return $merge(size, {
				size: size,
				scroll: this.getScroll(),
				scrollSize: this.getScrollSize()
			});
		},

		getPosition: function(relative){
			if (relative && $type(relative) == "array") {
				console.warn('1.1 > 1.2: Element.getPosition no longer accepts an array of overflown elements but rather, optionally, a single element to get relative coordinates.');
			}
			return getPosition.apply(this, arguments);
		},

		getCoordinates: function(relative){
			if (relative && $type(relative) == "array") {
				console.warn('1.1 > 1.2: Element.getCoordinates no longer accepts an array of overflown elements but rather, optionally, a single element to get relative coordinates.');
			}
			return getCoordinates.apply(this, arguments);
		}
	
	});

	Native.implement([Document, Window], {

		getSize: function(){
			console.warn('1.1 > 1.2: NOTE: getSize is different in 1.2; it no longer returns values for size, scroll, and scrollSize, but instead just returns x/y values for the dimensions of the element.');
			var size;
			var win = this.getWindow();
			var doc = this.getDocument();
			doc = (!doc.compatMode || doc.compatMode == 'CSS1Compat') ? doc.html : doc.body;
			if (Browser.Engine.presto || Browser.Engine.webkit){
				size =  {x: win.innerWidth, y: win.innerHeight};
			} else {
				size = {x: doc.clientWidth, y: doc.clientHeight};
			}
			return $extend(size, {
				size: size,
				scroll: {x: win.pageXOffset || doc.scrollLeft, y: win.pageYOffset || doc.scrollTop},
				scrollSize: {x: Math.max(doc.scrollWidth, size.x), y: Math.max(doc.scrollHeight, size.y)}
			});
		}

	});

})();