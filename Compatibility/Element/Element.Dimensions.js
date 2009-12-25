(function(){
	
	function isBody(element){
		return (/^(?:body|html)$/i).test(element.tagName);
	};
	
	var oldgetSize = Element.prototype.getSize;

	Element.implement({
		
		getSize: function(){
			var size;
			if (isBody(this)) size =  this.getWindow().getSize();
			else size = oldgetSize();
			return {
				x : size.x,
				y: size.y,
				size: size,
				scroll: this.getScroll(),
				scrollSize: this.getScrollSize()
			};
		}
	});

})();