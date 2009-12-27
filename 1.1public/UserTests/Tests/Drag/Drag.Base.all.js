{
	tests: [
		{
			title: "Drag Resizing",
			description: "Tests the ability to resize an element with a handle.",
			verify: "Can you resize the text area with the little bar below it?",
			before: function(){
				window.dragger = $('comment').makeResizable({
					handle: $('textresizer'),
					modifiers: {x: false, y: 'height'}
				});
			}
		},
		{
			title: "Disable Resizing",
			description: "Disables the resizing.",
			verify: "Are you now unable to resize the TextArea?",
			before: function(){
				window.dragger.detach();
			}
		}
	]
}