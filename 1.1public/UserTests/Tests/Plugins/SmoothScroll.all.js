{
	tests: [
		{
			title: "SmoothScroll",
			description: "Scrolls to each anchor on the page.",
			verify: "When you click on the links on the page does the window scroll smoothly to the location?",
			before: function(){
				new SmoothScroll();
			}
		}
	]
}