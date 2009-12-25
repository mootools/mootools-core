(function(){
	
	function isBody(element){
		return (/^(?:body|html)$/i).test(element.tagName);
	};

	Element.implement({
	
		getSize: function(){
			var size = isBody(this) ? this.getWindow().getSize() : {x: this.offsetWidth, y: this.offsetHeight};
			return $merge(size, {
				size: size,
				scroll: this.getScroll(),
				scrollSize: this.getScrollSize()
			})
		}
	
	});
});