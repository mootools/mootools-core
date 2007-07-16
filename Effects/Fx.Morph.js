/*
Script: Fx.Morph.js
	Contains <Fx.Morph>.

License:
	MIT-style license.
*/

/*
Class: Fx.Morph
	Smoothly Morph the element reflecting the properties of a specified class name defined in anywhere in the CSS.
	Inherits methods, properties, options and events from <Fx.Styles>.
	
Notes:
	- This is still a wip.
	- It only works with 'transitionable' properties.
	- The className will NOT be added onComplete.
	- This Effect is intended to work only with properties found in external styesheet. For custom properties see <Fx.Styles>

Arguments:
	el - the $(element) to apply the style transition to

Example:
	>var myMorph = new Fx.Morph('myElement', {duration:500});
	>myMorph.start('myClassName');
*/

Fx.Morph = new Class({
	
	Extends: Fx.Styles,
	
	/*
	Property: start
		Executes a transition to the current properties of the specified className.

	Arguments:
		obj - an object containing keys that specify css properties to alter and values that specify either the from/to values (as an array)
		or just the end value (an integer).

	Example:
		see <Fx.Styles>
	*/

	start: function(className){
		var to = {};
		$each(document.styleSheets, function(style){
			var rules = style.rules || style.cssRules;
			$each(rules, function(rule){
				if (!rule.selectorText.test('\.' + className + '$')) return;
				for (var style in Element.Styles.All){
					if (!rule.style || !rule.style[style]) return;
					var ruleStyle = rule.style[style];
					to[style] = (style.test(/color/i) && ruleStyle.test(/^rgb/)) ? ruleStyle.rgbToHex() : ruleStyle;
				};
			});
		});
		return this.parent(to);
	}
	
});