Window.implement({
	
	getSize: function(){
		return {
			size: this.document.getOffsetSize(),
			scroll: this.document.getScroll(),
			scrollSize: this.document.getScrollSize()
		};
	},
	
	getHeight: function(){
		return this.document.getOffsetSize().y;
	},
	
	getWidth: function(){
		return this.document.getOffsetSize().x;		
	},
	
	getScrollTop: function(){
		return this.document.getScroll().y;		
	},
	
	getScrollLeft: function(){
		return this.document.getScroll().x;
	},
	
	getScrollHeight: function(){
		return this.document.getScrollSize().y;
	},
	
	getScrollWidth: function(){
		return this.document.getScrollSize().x;
	}
	
});

Element.implement({
	
	getSize: function(){
		return {
			size: this.getOffsetSize(),
			scroll: this.getScroll(),
			scrollSize: this.getScrollSize()
		};
	},
	
	getTop: function(){
		return this.getPosition().y;
	},
	
	getLeft: function(){
		return this.getPosition().x;
	}
	
});