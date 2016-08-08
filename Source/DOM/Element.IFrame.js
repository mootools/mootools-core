/*
---
name: DOM.Element.IFrame
description: Contains an IFrame constructor
requires: [DOM.Element]
provides: DOM.Element.IFrame
...
*/

(function(){

DOM.Element.IFrame = new Class({

	Extends: DOM.Element,

	Matches: 'iframe',

	initialize: function(iframe, props){
		var type = typeOf(iframe);
		if (!(type == 'string'
			|| (type == 'element' && iframe.tagName.toLowerCase() == 'iframe')
			|| (instanceOf(iframe, DOM))
		)){
			iframe = 'iframe';
			props = iframe;
		}

		iframe = new DOM.Element(iframe, null, true);

		if (!props) props = {};

		props.id = props.name = (props.id
			|| props.name
			|| (iframe.get('id')
			|| iframe.get('name'))
			|| 'IFrame_' + String.uniqueID());

		var onload = props.onload;
		delete props.onload;

		iframe.set(props);

		if (onload){
			var onLoad = function(){
				onload.call(iframe.node.contentWindow);
			};

			if (window.frames[props.id]) onLoad();
			else iframe.addEventListener('load', onLoad);
		}

		return iframe;
	}

});

})();
