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

})();