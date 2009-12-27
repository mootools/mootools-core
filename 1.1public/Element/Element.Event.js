/*
Script: Element.Event.js
	Specs for Element.Event.js

License:
	MIT-style license.
*/

(function(){
	var e;
	function listen(evnt, elem, func) {
		if (elem.addEventListener) {	// W3C DOM
				elem.addEventListener(evnt,func,false);
		} else if (elem.attachEvent) { // IE DOM
				var r = elem.attachEvent("on"+evnt, func);
				return r;
		}
	};
	
	
	listen('load', window, function(event) {
		e = new Event(event);
	});
	
	describe('Element.Event', {
		
		'Event target should be the document': function(){
			value_of(e.target).should_be(document);
		},
		
		'Event type should be "load"': function(){
			value_of(e.type).should_be("load");
		},
		
		'Event methods should be present': function(){
			value_of($type(e.preventDefault)).should_be('function');
			value_of($type(e.stop)).should_be('function');
			value_of($type(e.stop)).should_be('function');
		}
		
	});
	

})();
