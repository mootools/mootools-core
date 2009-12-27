{
	tests: [
		{
			title: "Sortables:single list",
			description: "Allows you to drag and drop items to sort them.",
			verify: "Can you reorder the list by dragging? Does the new order display below the list? If you scroll the list down a bit does it still let you sort correctly? Note that it won't scroll for you as you drag; that's not part of this test.",
			before: function(){
				var mySort = new Sortables($('SortableExample'), {
					clone: true,
					opacity: 0.6,
					onComplete: function(){
						$('order').set('html', 'order: ' + mySort.serialize())
					}
				});
			}
		}
	],
	otherScripts: ['Element.Position']
}