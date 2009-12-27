{
	tests: [
		{
			title: "Accordion",
			description: "Closes one as you open another.",
			verify: "When you click on headers do their contents display, hiding the previously visible item?",
			before: function(){
				if (!window.acc) window.acc = new Accordion($$('dt'), $$('dd'));
			}
		},
		{
			title: "Accordion",
			description: "Dynamically add sections to an existing accordion.",
			verify: "Is there a 'fourth section' does it respond like the others?",
			before : function(){
				if (!window.acc) window.acc = new Accordion($$('dt'), $$('dd'));
				var container = $('accordionExample').getElement('dl');
				window.acc.addSection(
					new Element('dt',{'class': 'toggle'}).setHTML('<b>fourth section</b>').inject(container),
					new Element('dd',{'class': 'stretcher'}).setHTML("I'm the content for the fourth section.").inject(container),
					3
				);
			}
		},
		{
			title: "Accordion:always hide",
			description: "Allows sections to be hidden without exposing another",
			verify: "Can you click on an element to expose it, and click it again to hide it without another opening?",
			before: function(){
				if (!window.acc) window.acc = new Accordion($$('dt'), $$('dd'));
				window.acc = new Accordion($$('dt'), $$('dd'),{
					display: -1,
					alwaysHide: true
				});
			}
		}
	],
	otherScripts: ["Element.Selectors"]
}