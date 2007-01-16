//Fx/fx

Fx = Fx || {};

var fx = Fx;

Fx.Base = Fx.Base || new Class();

Fx.Base.implement({
	goTo: function(to){return this.start(to)}
});

//Fx.Color/Style

Fx.Color = Fx.Style;

//ajax/Ajax

var ajax = Ajax;

//Fx.Accordion/Accordion

Fx.Accordion = Accordion || new Class();

Fx.Accordion.implement({
	showThisHideOpen: function(i){return this.display(i)}
});

//Fx.Transitions

Object.extend(Fx, Fx.Transitions || {});

//Element ClassNames

Element.extend({
	addClassName: Element.prototype.addClass,
	removeClassName: Element.prototype.removeClass,
	toggleClassName: Element.prototype.toggleClass
});

//$S selector

var $S = $$;

//Elements action

Elements.extend({
	action: function(actions){
		this.each(function(el){
			el = $(el);
			if (actions.initialize) actions.initialize.apply(el);
			for(var action in actions){
				if (action.test(/^on\w+$/)){
					el[action] = actions[action];
				} else {
					var evt = action.match(/^(\w+)event$/);
					if (evt) el.addEvent(evt[1], actions[action]);
				}
			}
		});
	}
});

/* Section: Utility Functions */

/*
Function: $Element
	Applies a method with the passed in args to the passed in element. Useful if you dont want to extend the element

	Arguments:
		el - the element
		method - a string representing the Element Class method to execute on that element
		args - an array representing the arguments to pass to that method

	Example:
		>$Element(el, 'hasClass', className) //true or false
*/

function $Element(el, method, args){
	if ($type(el) == 'string') el = document.getElementById(el);
	if ($type(el) != 'element') return false;
	if (!args) args = [];
	else if ($type(args) != 'array') args = [args];
	return Element.prototype[method].apply(el, args);
};