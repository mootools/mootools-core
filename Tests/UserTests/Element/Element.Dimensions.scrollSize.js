{
	tests: [
		{
			title: "Element.scrollSize",
			description: "Checks the scrollsize of the document.",
			verify: "Do the sizes injected into the document content seem correct (the scrollsize should be larger than the frame size)?",
			before: function(){
				$('value').set('html', 'frame size: {frame}, scroll size: {scroll}'.substitute({
					frame: document.body.getSize().y,
					scroll: document.body.getScrollSize().y
				}));
			}
		}
	]
}