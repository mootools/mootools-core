/*
Script: Swiff.Uploader.js
	Contains <Swiff.Uploader>

Author:
	Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.
*/

/*
Class: Swiff.Text
	creates flash textField objects. Takes care of object creation and injection.

Arguments:
	swf - the path to Swiff.Text.Swf
	where - where to inject the swf.
	text - the text to write to the textField object.
	options - options for the textField display.

Options:
	color - the color of the text, defaults to '#111111'
	size - the size of the text, defaults to '30'
	bold - bold text? defaults to false
	italic - italic text? defaults to false
	underline - underlined text? defaults to false
	spacing - integer, text-spacing of the text. defaults to false
	shadow - an object representing the shadow of the text. defaults to false - see Shadow below
	font - the embedded font name in your flash file. defaults to 'font'.
	display - the display of your text. 'inline' or 'block';
	bgcolor - the bgcolor of the text. defaults to false (none);

Shadow:
	distance - '2',
	angle - '45',
	color - '#000000',
	opacity - '0.5',
	blur - '2'
*/

Swiff.Text = new Class({

	setOptions: function(options){
		options = Object.extend({
			color: '#111111',
			size: '30',
			bold: false,
			italic: false,
			underline: false,
			spacing: false,
			shadow: false,
			font: 'font',
			display: 'block',
			bgcolor: false
		}, options || {});
		options.color = options.color.replace('#', '0x');
		if (options.shadow) options.shadow = this.setShadow(options.shadow);
		return options;
	},

	setShadow: function(shadow){
		if (shadow === true) shadow = {};
		return Object.extend({
			distance: '2',
			angle: '45',
			color: '#000000',
			opacity: '0.5',
			blur: '2'
		}, shadow || {});
	},

	initialize: function(swf, where, text, options){
		if (Swiff.getVersion() < 8) return false;
		this.where = $(where);
		this.txt = text;
		this.options = this.setOptions(options);
		var wmode = 'transparent';
		if (this.options.bgcolor) wmode = 'opaque';
		this.object = new Swiff(swf, {
			width: '100%',
			height: '1',
			bgcolor: this.options.bgcolor,
			wmode: wmode,
			vars: {'onLoad': this.loaded.bind(this)}
		});
		this.where.adopt(this.object);
		if (this.options.initialize) this.options.initialize.call(this);
		return this;
	},

	loaded: function(){
		this.setStyles(this.options);
		this.setText(this.txt);
		this.render(this.options.shadow, true);
	},

	setStyles: function(obj){
		if (obj.color) obj.color = obj.color.replace('#', '0x');
		Swiff.remote(this.object, 'setStyles', obj.color, obj.size, obj.bold, obj.italic, obj.underline, obj.spacing, obj.font);
		return this;
	},

	setText: function(text){
		Swiff.remote(this.object, 'setText', text);
		return this;
	},

	render: function(shadow, resize){
		if (shadow) Swiff.remote(this.object, 'makeShadow', shadow.distance, shadow.angle, shadow.color.replace('#', '0x'), shadow.opacity, shadow.blur, 1);
		var size = Swiff.remote(this.object, 'render', shadow);
		if (resize) this.setSize.create({'bind': this, 'arguments': [size[0], size[1]], 'delay': 10})();
		return this;
	},

	setSize: function(width, height){
		if (this.options.shadow) height = height.toInt() + this.options.shadow.distance.toInt() + this.options.shadow.blur.toInt();
		this.object.height = height;
		if (this.options.display == 'inline') this.object.width = width;
	}

});

/*
Class: Swiff.ReplaceText
	extends Swiff.Text and inherits all its options and methods.
	Used to replace a block of text with flash text. Will read the style of your text.

Arguments:
	swf - the path to Swiff.Text.Swf
	el - the element to replace.
	overrides - same as Swiff.Text Options. Will override the current stylesheet.

More Options:
	ratio - an integer representing the ratio of the flash font versus the html one. For example use 0.8 if the flash font is bigger than the html one.
	debug - use true to fine-tune the flash font settings. defaults to false.
*/

Swiff.ReplaceText = Swiff.Text.extend({

	initialize: function(swf, el, overrides){
		el = $(el);
		this.options = Object.extend({
			debug: false,
			color: el.getStyle('color'),
			size: el.getStyle('height').toInt(),
			spacing: el.getStyle('letter-spacing').toInt(),
			underline: (el.getStyle('text-decoration') == 'underline'),
			bold: (el.getStyle('font-weight') == 'bold'),
			italic: (el.getStyle('font-style') == 'italic'),
			ratio: 1
		}, overrides);
		this.options.size *= this.options.ratio;
		var htm = el.innerHTML;
		el.setHTML('');
		this.span = new Element('span').injectInside(el).setHTML(htm).addClass('swiff');
		this.parent(swf, el, htm, this.options);
	},

	render: function(shadow, size){
		if (size && !this.options.debug) this.span.setStyle('display', 'none');
		return this.parent(shadow, size);
	}

});

Swiff.ReplaceElements = function(swf, elements, overrides){
	$each(elements, function(element){
		new Swiff.ReplaceText(swf, element, overrides);
	});
};