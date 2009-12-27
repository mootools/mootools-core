{
	tests: [
		{
			title: "Droppables",
			description: "Tests the ability to drag an element into a droppable box.",
			verify: "Can you drag the blue box into the Green box? When you do, does the green box turn white?",
			before: function(){
				$('box').makeDraggable({
					droppables: $$($('droppable'))
				});
				$('droppable').addEvent('over', function(){
					this.setStyle('background', 'yellow');
				}).addEvent('leave', function(){
					this.setStyle('background', 'green');
				}).addEvent('drop', function(){
					this.setStyle('background', 'white');
				});
			}
		}
	]
}