{
	tests: [
		{
			title: "Fx.Elements",
			description: "Animates several elements at once.",
			verify: "Did the elements change shape smoothly at the same time?",
			before: function(){
				var myElementsEffects = new Fx.Elements($$('div.exampleBar'));
				myElementsEffects.start({
					'0': { /*	let's change the first element's opacity and width	*/
						'opacity': [0,1],
						'width': [100,200]
					},
					'1': { /*	and the second one's opacity	*/
						'opacity': [0.2, 0.5]
					},
					'2': { /*	and the third's height	*/
					'height': 40 /*	from whatever it's at now to 40	*/
					}
				});
			}
		}
	],
	otherScripts: ['Element.Selectors']
}