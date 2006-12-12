/*	
Script: Accordion.js
	Fx.Elements and Accordion.
		
Dependencies:
	<Moo.js>, <Function.js>, <Array.js>, <String.js>, <Element.js>, <Fx.js>

Author:
	Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.
*/

/*
Class: Fx.Elements
	Fx.Elements allows you to apply any number of styles trantisions to a selection of elements. Wonky syntax but very powerful. Used internally by the accordion.

Arguments:
	elements - a collection of elements the effects will be applied to.
	options - same as <Fx.Base> options.
*/

Fx.Elements = Fx.Base.extend({

	initialize: function(elements, options){
		this.elements = [];
		elements.each(function(el){
			this.elements.push($(el));
		}, this);
		this.setOptions(options);
		this.now = {};
	},

	setNow: function(){
		for (var i in this.from){
			var iFrom = this.from[i];
			var iTo = this.to[i];
			var iNow = this.now[i] = {};
			for (var p in iFrom) iNow[p] = this.compute(iFrom[p], iTo[p]);
		}
	},

	/*
	Property: custom
		Applies the passed in style transitions to each object named (see example). Each item in the collection is refered to as a numerical string ("1" for instance). The first item is "0", the second "1", etc.
		
	Example:
		(start code)
		var myElementsEffects = new Fx.Elements($$('a'));
		myElementsEffects.custom({
			'0': { //let's change the first element's opacity and width
				'opacity': [0,1],
				'width': [100,200]
			},
			'1': { //and the second one's opacity
				'opacity': [0.2, 0.5]
			}
		});
		(end)
	*/

	custom: function(objObjs){
		if (this.timer && this.options.wait) return;
		var from = {};
		var to = {};
		for (var i in objObjs){
			var iProps = objObjs[i];
			var iFrom = from[i] = {};
			var iTo = to[i] = {};
			for (var prop in iProps){
				iFrom[prop] = iProps[prop][0];
				iTo[prop] = iProps[prop][1];
			}
		}
		return this.parent(from, to);
	},

	increase: function(){
		for (var i in this.now){
			var iNow = this.now[i];
			for (var p in iNow) this.setStyle(this.elements[i.toInt()], p, iNow[p]);
		}
	}

});

/*
Class: Fx.Accordion
	The Fx.Accordion function creates a group of elements that are toggled when their handles are clicked. When one elements toggles in, the others toggles back.

Arguments:
	elements - required, a collection of elements the transitions will be applied to.
	togglers - required, a collection of elements, the elements handlers.
	options - optional, see options below, and <Fx.Base> options.

Options:
	start - either 'open-first' or 'first-open'. 'open-first' will slide that element open, while 'first-open' will just show that element as open immediately with no transition.
	fixedHeight - integer, if you want your accordion to have a fixed height. defaults to false.
	fixedWidth - integer, if you want your accordion to have a fixed width. defaults to false.
	alwaysHide - boolean, if you want the ability to close your only-open item. defaults to false.
	wait - boolean. means that open and close transitions can cancel current ones (so if you click
	 on items before the previous finishes transitioning, the clicked transition will fire canceling the previous). true means that if one element is sliding open or closed, clicking on another will have no effect. for Accordion defaults to false.
	onActive - function to execute when an element starts to show
	onBackground - function to execute when an element starts to hide
	height - boolean, will add a height transition to the accordion if true. defaults to true.
	opacity - boolean, will add an opacity transition to the accordion if true. defaults to true.
	width - boolean, will add a width transition to the accordion if true. defaults to false, css mastery is required to make this work!
*/

Fx.Accordion = Fx.Elements.extend({

	extendOptions: function(options){
		Object.extend(this.options, Object.extend({
			start: 'open-first',
			fixedHeight: false,
			fixedWidth: false,
			alwaysHide: false,
			wait: false,
			onActive: Class.empty,
			onBackground: Class.empty,
			height: true,
			opacity: true,
			width: false
		}, options || {}));
	},

	initialize: function(togglers, elements, options){
		this.parent(elements, options);
		this.extendOptions(options);
		this.previousClick = 'nan';
		togglers.each(function(tog, i){
			$(tog).addEvent('click', function(){this.showThisHideOpen(i)}.bind(this));
		}, this);
		this.togglers = togglers;
		this.h = {}; this.w = {}; this.o = {};
		this.elements.each(function(el, i){
			this.now[i] = {};
			$(el).setStyles({'height': 0, 'overflow': 'hidden'});
		}, this);
		switch(this.options.start){
			case 'first-open': this.elements[0].setStyle('height', this.elements[0].scrollHeight+this.options.unit); break;
			case 'open-first': this.showThisHideOpen(0); break;
		}
	},

	hideThis: function(i){
		if (this.options.height) this.h = {'height': [this.elements[i].offsetHeight, 0]};
		if (this.options.width) this.w = {'width': [this.elements[i].offsetWidth, 0]};
		if (this.options.opacity) this.o = {'opacity': [this.now[i]['opacity'] || 1, 0]};
	},

	showThis: function(i){
		if (this.options.height) this.h = {'height': [this.elements[i].offsetHeight, this.options.fixedHeight || this.elements[i].scrollHeight]};
		if (this.options.width) this.w = {'width': [this.elements[i].offsetWidth, this.options.fixedWidth || this.elements[i].scrollWidth]};
		if (this.options.opacity) this.o = {'opacity': [this.now[i]['opacity'] || 0, 1]};
	},

	/*
	Property: showThisHideOpen
		Shows a specific item and hides all others. Useful when triggering an accordion from outside.
		
	Arguments:
		iToShow - the index of the item to show.
	*/

	showThisHideOpen: function(iToShow){
		if (iToShow != this.previousClick || this.options.alwaysHide){
			this.previousClick = iToShow;
			var objObjs = {};
			var err = false;
			var madeInactive = false;
			this.elements.each(function(el, i){
				this.now[i] = this.now[i] || {};
				if (i != iToShow){
					this.hideThis(i);
				} else if (this.options.alwaysHide){
					if (el.offsetHeight == el.scrollHeight){
						this.hideThis(i);
						madeInactive = true;
					} else if (el.offsetHeight == 0){
						this.showThis(i);
					} else {
						err = true;
					}
				} else if (this.options.wait && this.timer){
					this.previousClick = 'nan';
					err = true;
				} else {
					this.showThis(i);
				}
				objObjs[i] = Object.extend(this.h, Object.extend(this.o, this.w));
			}, this);
			if (err) return;
			if (!madeInactive) this.options.onActive.call(this, this.togglers[iToShow], iToShow);
			this.togglers.each(function(tog, i){
				if (i != iToShow || madeInactive) this.options.onBackground.call(this, tog, i);
			}, this);
			return this.custom(objObjs);
		}
	}

});