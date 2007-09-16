/*
Script: Accordion.js
	Contains <Accordion>

License:
	MIT-style license.

Note:
	The Accordion requires an XHTML doctype.
*/

/*
Class: Accordion
	The Accordion class creates a group of Elements that are toggled when their handles are clicked. When one Element toggles into view, the others toggle out.

Extends:
	<Fx.Elements>

Syntax:
	>var myAccordion = new Accordion(togglers, elements[, options]);

Arguments:
	togglers - (array) The collection of Elements representing the Elements which will be clickable and trigger the opening of sections of the Accordion.
	elements - (array) The collection of Elements the transitions will be applied to.
	options  - (object, optional) All the <Fx> options in addition to options below.

	options (continued):
		display     - (integer: defaults to 0) The index of the element to show at start (with a transition).
		show        - (integer: defaults to 0) The index of the element to be shown initially.
		height      - (boolean: defaults to true) If set to true, a height transition effect will take place when switching between displayed elements.
		width       - (boolean: defaults to false) If set to true, a width transition will take place when switching between displayed elements.
		opacity     - (boolean: defaults to true) If set to true, an opacity transition effect will take place when switching between displayed elements.
		fixedHeight - (boolean: defaults to false) If set to false, displayed elements will have a fixed height.
		fixedWidth  - (boolean: defaults to false) If set to true, displayed elements will have a fixed width.
		alwaysHide  - (boolean: defaults to false) If set to true, it will be possible to close all displayable elements.  Otherwise, one will remain open at all time.

		width (continued):
			Warning:
				CSS mastery is required to make this work!

Returns:
	(class) A new Accordion instance.

Events:
	onActive - (function) Function to execute when an element starts to show.
		Signature:
			>onActive(toggler, element)

		Arguments:
			toggler - (element) The toggler for the Element being displayed.
			element - (element) The Element being displayed.

	onBackground - (function) Function to execute when an element starts to hide.
		Signature:
			>onBackground(toggler, element)

		Arguments:
			toggler - (element) The toggler for the Element being displayed.
			element - (element) The Element being displayed.

Properties:
	togglers  - (array) The collection of Elements that are clicked to open sections of the Accordion.
	elements  - (array) The collection of Elements representing the sections that expand and collapse.
	container - (element or boolean false) An element that contains all the togglers and elements. The container is optional, so if not specified in the options this property is false.
	previous  - (integer) The current open section.

Example:
	[javascript]
		var myAccordion = new Accordion($$('.togglers'), $$('.elements'), {
			display: 2,
			alwaysHide: true
		});
	[/javascript]

See Also:
	<http://demos.mootools.net/Accordion>
*/

var Accordion = new Class({
	
	Extends: Fx.Elements,

	options: {
		/*onActive: $empty,
		onBackground: $empty,*/
		display: 0,
		show: false,
		height: true,
		width: false,
		opacity: true,
		fixedHeight: false,
		fixedWidth: false,
		wait: false,
		alwaysHide: false
	},

	initialize: function(){
		var params = Array.associate(arguments, {'container': 'element', 'options': 'object', 'togglers': true, 'elements': true});
		arguments.callee.parent(params.elements, params.options);
		this.togglers = $$(params.togglers);
		this.container = $(params.container);
		this.previous = -1;
		if (this.options.alwaysHide) this.options.wait = true;
		if ($chk(this.options.show)){
			this.options.display = false;
			this.previous = this.options.show;
		}
		if (this.options.start){
			this.options.display = false;
			this.options.show = false;
		}
		this.effects = {};
		if (this.options.opacity) this.effects.opacity = 'fullOpacity';
		if (this.options.width) this.effects.width = this.options.fixedWidth ? 'fullWidth' : 'offsetWidth';
		if (this.options.height) this.effects.height = this.options.fixedHeight ? 'fullHeight' : 'scrollHeight';
		for (var i = 0, l = this.togglers.length; i < l; i++) this.addSection(this.togglers[i], this.elements[i]);
		this.elements.each(function(el, i){
			if (this.options.show === i){
				this.fireEvent('onActive', [this.togglers[i], el]);
			} else {
				for (var fx in this.effects) el.setStyle(fx, 0);
			}
		}, this);
		if ($chk(this.options.display)) this.display(this.options.display);
	},

	/*
	Method: addSection
		Dynamically adds a new section into the Accordion at the specified position.

	Syntax:
		>myAccordion.addSection(toggler, element[, pos]);

	Arguments:
		toggler - (element) The Element that toggles the Accordion section open.
		element - (element) The Element that should stretch open when the toggler is clicked.
		pos     - (integer, optional) The index at which these objects are to be inserted within the Accordion (defaults to the end).

	Returns:
		(class) This Accordion instance.

	Example:
		[javascript]
			var myAccordion = new Fx.Accordion($$('.togglers'), $$('.elements'));
			myAccordion.addSection('myToggler1', 'myElement1'); // add the section at the end sections.
			myAccordion.addSection('myToggler2', 'myElement2', 0); //add the section at the beginning of the sections.
		[/javascript]
	*/

	addSection: function(toggler, element, pos){
		toggler = $(toggler);
		element = $(element);
		var test = this.togglers.contains(toggler);
		var len = this.togglers.length;
		this.togglers.include(toggler);
		this.elements.include(element);
		if (len && (!test || pos)){
			pos = $pick(pos, len - 1);
			toggler.injectBefore(this.togglers[pos]);
			element.injectAfter(toggler);
		} else if (this.container && !test){
			toggler.inject(this.container);
			element.inject(this.container);
		}
		var idx = this.togglers.indexOf(toggler);
		toggler.addEvent('click', this.display.bind(this, idx));
		if (this.options.height) element.setStyles({'padding-top': 0, 'border-top': 'none', 'padding-bottom': 0, 'border-bottom': 'none'});
		if (this.options.width) element.setStyles({'padding-left': 0, 'border-left': 'none', 'padding-right': 0, 'border-right': 'none'});
		element.fullOpacity = 1;
		if (this.options.fixedWidth) element.fullWidth = this.options.fixedWidth;
		if (this.options.fixedHeight) element.fullHeight = this.options.fixedHeight;
		element.setStyle('overflow', 'hidden');
		if (!test){
			for (var fx in this.effects) element.setStyle(fx, 0);
		}
		return this;
	},

	/*
	Method: display
		Shows a specific section and hides all others. Useful when triggering an accordion from outside.

	Syntax:
		>myAccordion.display(index);

	Arguments:
		index - (mixed) The index of the item to show, or the actual element to be displayed.

	Returns:
		(class) This Accordion instance.

	Example:
		[javascript]
			// Make a ticker-like accordion. Kids don't try this at home.
			var myAccordion = new Accordion('.togglers', '.elements', {
				onComplete: function(){
					this.display.delay(2500, this, (this.previous + 1) % this.togglers.length);
				}
			});
		[/javascript]
	*/

	display: function(index){
		index = ($type(index) == 'element') ? this.elements.indexOf(index) : index;
		if ((this.timer && this.options.wait) || (index === this.previous && !this.options.alwaysHide)) return this;
		this.previous = index;
		var obj = {};
		this.elements.each(function(el, i){
			obj[i] = {};
			var hide = (i != index) || (this.options.alwaysHide && (el.offsetHeight > 0));
			this.fireEvent(hide ? 'onBackground' : 'onActive', [this.togglers[i], el]);
			for (var fx in this.effects) obj[i][fx] = hide ? 0 : el[this.effects[fx]];
		}, this);
		return this.start(obj);
	}

});