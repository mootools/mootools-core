Element.implement({

	getFormElements: function(){
		return this.getElements('input, textarea, select');
	}

});