Class: Accordion {#Accordion}
=============================

The Accordion class creates a group of Elements that are toggled when their handles are clicked. When one Element toggles into view, the others toggle out.

### Notes:

- Accordion requires the page to be in [Standards Mode](http://hsivonen.iki.fi/doctype/).
- Accordion elements will have their paddings and borders removed in order to make the transition display correctly.  Best practice is to use the accordion elements as containers for elements that are styled exactly as you like.

### Extends:

[Fx.Elements][]

### Syntax:

	var myAccordion = new Accordion(togglers, elements[, options]);

### Arguments:

1. togglers - (*array*) The collection of Elements which will be clickable and trigger the opening of sections of the Accordion.
2. elements - (*array*) The collection of Elements the transitions will be applied to.
3. options  - (*object*, optional) All the [Fx][] options in addition to options below.

#### Options:

* display     - (*integer*: defaults to 0) The index of the element to show at start (with a transition).
* show        - (*integer*: defaults to 0) The index of the element to be shown initially.
* height      - (*boolean*: defaults to true) If set to true, a height transition effect will take place when switching between displayed elements.
* width       - (*boolean*: defaults to false) If set to true, a width transition will take place when switching between displayed elements.
* opacity     - (*boolean*: defaults to true) If set to true, an opacity transition effect will take place when switching between displayed elements.
* fixedHeight - (*boolean*: defaults to false) If set to false, displayed elements will have a fixed height.
* fixedWidth  - (*boolean*: defaults to false) If set to true, displayed elements will have a fixed width.
* alwaysHide  - (*boolean*: defaults to false) If set to true, it will be possible to close all displayable elements. Otherwise, one will remain open at all time.
* width       - (*boolean*: defaults to false) If set to true, it will add a width transition to the accordion. Warning: css mastery is required to make this work!

### Returns:

* (*object*) A new Accordion instance.

## Events:

### active

* (*function*) Function to execute when an element starts to show.

#### Signature:

	onActive(toggler, element)

#### Arguments:

1. toggler - (*element*) The toggler for the Element being displayed.
2. element - (*element*) The Element being displayed.

### background

* (*function*) Function to execute when an element starts to hide.

#### Signature:

	onBackground(toggler, element)

#### Arguments:

1. *toggler* - (element) The toggler for the Element being displayed.
2. *element* - (element) The Element being displayed.

### Examples:

	var myAccordion = new Accordion($$('.togglers'), $$('.elements'), {
		display: 2,
		alwaysHide: true
	});

### Demos:

- Accordion - <http://demos.mootools.net/Accordion>



Accordion Method: addSection {#Accordion:addSection}
----------------------------------------------------

Dynamically adds a new section into the Accordion at the specified position.

###	Syntax:

	myAccordion.addSection(toggler, element[, pos]);

###	Arguments:

1. toggler - (*element*) The Element that toggles the Accordion section open.
2. element - (*element*) The Element that should stretch open when the toggler is clicked.
3. pos     - (*integer*, optional) The index at which these objects are to be inserted within the Accordion (defaults to the end).

###	Returns:

* (*object*) This Accordion instance.

### Examples:

	var myAccordion = new Accordion($$('.togglers'), $$('.elements'));
	myAccordion.addSection('myToggler1', 'myElement1'); // add the section at the end sections.
	myAccordion.addSection('myToggler2', 'myElement2', 0); //add the section at the beginning of the sections.



Accordion Method: display {#Accordion:display}
----------------------------------------------

Shows a specific section and hides all others. Useful when triggering an accordion from outside.

###	Syntax:

	myAccordion.display(index);

###	Arguments:

1. index - (*mixed*) The index of the item to show, or the actual element to be displayed.

### Returns:

* (*object*) This Accordion instance.

### Examples:

	// Make a ticker-like accordion. Kids don't try this at home.
	var myAccordion = new Accordion('.togglers', '.elements', {
		onComplete: function(){
			this.display.delay(2500, this, (this.previous + 1) % this.togglers.length);
		}
	});



[Fx]: /Fx/Fx
[Fx.Elements]: /Fx/Fx.Elements