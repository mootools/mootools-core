//Fx/fx

Fx = Fx || {};

var fx = Fx;

Fx.Base = Fx.Base || new Class({});

Fx.Base.prototype.goTo = Fx.Base.prototype.start;

//Fx.Color/Style

Fx.Color = Fx.Style;

//new Class/Class.create

Class.create = function(properties){
	return new Class(properties || {});
};

//ajax/Ajax

var ajax = Ajax || new Class({});

//Fx.Accordion/Accordion

Fx.Accordion = Accordion || new Class({});

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