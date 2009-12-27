{
	tests: [
		{
			title: "Drag Moving in a container",
			description: "Tests the ability to drag an element limited to a container.",
			verify: "Can you drag the red box around but only within the container?",
			before: function(){
				if (window.dragger) window.dragger.detach();
				$('box').makeDraggable({
					container: $('container')
				});
			}
		}
	]
}