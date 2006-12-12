/*	
Script: Tips.js
	Tooltips, BubbleTips, whatever they are, they will appear on mouseover
	
Dependencies:
	<Moo.js>, <Function.js>, <Array.js>, <String.js>, <Element.js>, <Fx.js>
	
Author:
	Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.
	
Credits:
	Tips.js is based on Bubble Tooltips (<http://web-graphics.com/mtarchive/001717.php>) by Alessandro Fulcitiniti <http://web-graphics.com>
*/

/*
Class: Tips
	Display a tip on any element with a title and/or href.

Arguments: 
	elements - a collection of elements to apply the tooltips to on mouseover.
	options - an object. See options Below.

Options: 
	transitionStart - the transition effect used to show the tip (see <Fx.Transitions>).
	transitionEnd - the transition effect used to hide the tip (see <Fx.Transitions>).
	maxTitleChars - the maximum number of characters to display in the title of the tip. defaults to 30.
	fxDuration - the duration (in ms) for the transition effect when the tip to appears and disappears. defaults to 150.
	maxOpacity - how opaque to make the tooltip (0 = 0% opaque, 1= 100% opaque). defaults to 1.
	timeOut - the delay to wait to show the tip (how long the user must hover to have the tooltip appear). defaults to 100.
	className - the class name to apply to the tooltip

Example:
	(start code)
	<img src="/images/i.png" title="The body of the tooltip is stored in the title" tooltitle="The Title of the Tooltip" class="toolTipImg"/>
	<script>
		var myTips = new Tips($S('.toolTipImg'), {
			maxTitleChars: 50, //I like my captions a little long
			maxOpacity: .9, //let's leave a little transparancy in there
		});
	</script>
	(end)
*/

var Tips = new Class({

	setOptions: function(options){
		this.options = {
			transitionStart: Fx.Transitions.sineInOut,
			transitionEnd: Fx.Transitions.sineInOut,
			maxTitleChars: 30,
			fxDuration: 150,
			maxOpacity: 1,
			timeOut: 100,
			className: 'tooltip'
		};
		Object.extend(this.options, options || {});
	},

	initialize: function(elements, options){
		this.elements = elements;
		this.setOptions(options);
		this.toolTip = new Element('div').addClassName(this.options.className).setStyle('position', 'absolute').injectInside(document.body);
		this.toolTitle = new Element('H4').injectInside(this.toolTip);
		this.toolText = new Element('p').injectInside(this.toolTip);
		this.fx = new fx.Style(this.toolTip, 'opacity', {duration: this.options.fxDuration, wait: false}).hide();
		$A(elements).each(function(el){
			$(el).myText = el.title || false;
			if (el.myText) el.removeAttribute('title');
			if (el.href){
				if (el.href.test('http://')) el.myTitle = el.href.replace('http://', '');
				if (el.href.length > this.options.maxTitleChars) el.myTitle = el.href.substr(0,this.options.maxTitleChars-3)+"...";
			}
			if (el.myText && el.myText.test('::')){
				var dual = el.myText.split('::');
				el.myTitle = dual[0].trim();
				el.myText = dual[1].trim();
			} 
			el.onmouseover = function(){
				this.show(el);
				return false;
			}.bind(this);
			el.onmousemove = this.locate.bindAsEventListener(this);
			el.onmouseout = function(){
				this.timer = $clear(this.timer);
				this.disappear();
			}.bind(this);
		}, this);
	},

	show: function(el){
		this.toolTitle.innerHTML = el.myTitle;
		this.toolText.innerHTML = el.myText;
		this.timer = $clear(this.timer);
		this.fx.options.transition = this.options.transitionStart;
		this.timer = this.appear.delay(this.options.timeOut, this);
	},

	appear: function(){
		this.fx.custom(this.fx.now, this.options.maxOpacity);
	},

	locate: function(evt){
		var doc = document.documentElement;
		this.toolTip.setStyles({'top': evt.clientY + doc.scrollTop + 15 + 'px', 'left': evt.clientX + doc.scrollLeft - 30 + 'px'});
	},

	disappear: function(){
		this.fx.options.transition = this.options.transitionEnd;
		this.fx.custom(this.fx.now, 0);
	}

});