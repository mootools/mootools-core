window.addEvent('domready', function() {
	
	//create our Accordion instance
	var myAccordion = new Accordion($('accordion'), 'h3.toggler', 'div.element', {
		opacity: false,
		onActive: function(toggler, element){
			toggler.setStyle('color', '#41464D');
		},
		onBackground: function(toggler, element){
			toggler.setStyle('color', '#528CE0');
		}
	});

	//add click event to the "add section" link
	$('add_section').addEvent('click', function(event) {
		event.stop();
		
		// create toggler
		var toggler = new Element('h3', {
			'class': 'toggler',
			'html': 'Common descent'
		});
		
		// create content
		var content = new Element('div', {
			'class': 'element',
			'html': '<p>A group of organisms is said to have common descent if they have a common ancestor. In biology, the theory of universal common descent proposes that all organisms on Earth are descended from a common ancestor or ancestral gene pool.</p><p>A theory of universal common descent based on evolutionary principles was proposed by Charles Darwin in his book The Origin of Species (1859), and later in The Descent of Man (1871). This theory is now generally accepted by biologists, and the last universal common ancestor (LUCA or LUA), that is, the most recent common ancestor of all currently living organisms, is believed to have appeared about 3.9 billion years ago. The theory of a common ancestor between all organisms is one of the principles of evolution, although for single cell organisms and viruses, single phylogeny is disputed</p>'
		});
		
		// position for the new section
		var position = 0;
		
		// add the section to our myAccordion using the addSection method
		myAccordion.addSection(toggler, content, position);
	});
});