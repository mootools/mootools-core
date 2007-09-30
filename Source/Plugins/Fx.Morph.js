/*
Script: Fx.Morph.js
	Contains <Fx.Morph>.

License:
	MIT-style license.
*/

/*
Class: Fx.Morph
	Smoothly Morph the Element reflecting the properties of a specified class name defined in anywhere in the CSS.

Extends:
	<Fx.Styles>

Syntax:
	>var myFx = new Fx.Morph(el[, options]);

Arguments:
	el      - (mixed) A string ID of the Element or an Element to apply the style transitions to.
	options - (object, optional) The <Fx> options object.

Returns:
	(class) A new Fx.Morph class instance.

Example:
	[javascript]
		var myMorph = new Fx.Morph('myElement', {duration: 1000, transition: Fx.Transitions.Sine.easeOut});
		myMorph.start('myClassName');
	[/javascript]

Notes:
	- This is still experimental.
	- It only works with 'transitionable' properties.
	- The className will NOT be added onComplete.
	- This Effect is intended to work only with properties found in external styesheet. For custom properties see <Fx.Styles>

See Also:
	<http://www.w3.org/TR/CSS21/propidx.html>, <Fx.Styles>
*/

Fx.Morph = new Class({

	Extends: Fx.Styles,

	/*
	Method: start
		Executes a transition to the current properties of the specified className.

	Syntax:
		>myFx.start(className);

	Arguments:
		className - (string) The string of the CSS class to match.

	Returns:
		(class) This Fx.Morph class instance.

	Example:
		[javascript]
			var myFx = new Fx.Morph('myElement').start('.myClass');
		[/javascript]
	*/

	start: function(className){
		var to = {};
		Array.each(document.styleSheets, function(sheet, j){
			var rules = sheet.rules || sheet.cssRules;
			Array.each(rules, function(rule, i){
				if (!rule.selectorText.test('\.' + className + '$') || !rule.style) return;
				Element.Styles.each(function(value, style){
					if (rule.style[style]){
						var ruleStyle = rule.style[style];
						to[style] = (style.test(/color/i) && ruleStyle.test(/^rgb/)) ? ruleStyle.rgbToHex() : ruleStyle;
					}
				});
			});
		});
		return arguments.callee.parent(to);
	}

});

/*
Native: Element
	Custom Native to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

Element.implement({

	/*
	Method: morph
		Transform this Element to the CSS properties as defined by the className.

	Syntax:
		>myElement.morph(className[, options]);

	Arguments:
		className - (string) The string of the CSS class to match.
		options   - (object, optional) The <Fx> options object.

	Returns:
		(class) A Fx.Morph instance.

	Example:
		[javascript]
			var myFx = $('myElement', {
				duration: 1000,
				transition: Fx.Transitions.Pow.easeOut,
				onStart: function(){
					alert("It's morphing time!");
				},
				onComplete: function(){
					alert("Go Power Mooers! Go!");
				}
			}).morph('.myClass');
		[/javascript]
	*/

	morph: function(className, options){
		var morph = this.$attributes.morph;
		if (!morph) this.$attributes.morph = new Fx.Morph(this, {wait: false});
		if (options) morph.setOptions(options);
		return morph.start(className);
	}

});