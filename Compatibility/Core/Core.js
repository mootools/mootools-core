Document.implement({

	extend: $extend

});

Window.implement({

	extend: $extend

});

window.extend(Client.Engine);

(function(){
	var natives = [Array, Function, String, RegExp, Number];
	for(var i = 0, l = natives.length; i < l; i++){
		natives[i].extend = natives[i].implement;
	}
})();