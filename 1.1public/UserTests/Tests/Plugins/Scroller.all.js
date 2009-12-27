{
	tests: [
		{
			title: "Scroller",
			description: "Scrolls the element as you drag the box around.",
			verify: "When you drag the red box to the edges of the text content does the text content scroll?",
			before: function(){
				var scr = new Scroller('scrollExample');
				$('box').makeDraggable({
					onStart: function(){
						scr.start();
					},
					onComplete: function(){
						scr.stop();
					}
				})
			}
		}
	],
	otherScripts: ['Drag.Move']
}