{
	tests: [
		{
			title: "Drag Moving",
			description: "Tests the ability to drag an element.",
			verify: "Can you drag the red box around??",
			before: function(){
				$('box').makeDraggable();
			}
		}
	]
}