
Element.extend = function(obj){
	console.warn('Element.extend is deprecated. Use Element.implement');
	Element.implement(obj);
};

Elements.extend = function(obj){
	console.warn('Elements.extend is deprecated. Use Elements.implement');
	Elements.implement(obj);
};

Element.implement({
	
	remove : function(){
		console.warn('el.remove is deprecated. Use el.dispose');
		return this.dispose();
	},
	
	getLastChild : function(){
		console.warn('el.getLastChild is deprecated. Use el.getLast');
		return this.getLast();
	},

    getFormElements: function(){
		console.warn('el.getFormElements is deprecated.');
        return this.getElements('input, textarea, select');
    },

    replaceWith: function(el){
		console.warn('el.replaceWith is deprecated.');
        el = $(el);
        $(this.parentNode).replaceChild(el, this); // wrapped for ie
        return el;
    },
    
    removeElements: function(){
		console.warn('el.removeElements is deprecated. use el.dispose()');
        return this.dispose();
    },

    getText: function(){
		console.warn('el.getText is deprecated. use el.get("text")');
        return this.get('text');
    },

    setText: function(text){
		console.warn('el.setText is deprecated. use el.set("text",value)');
        return this.set('text', text);
    },

    setHTML: function(){
		console.warn('el.setHTML is deprecated. use el.set("html",value)');
        return this.set('html', arguments);
    },
    
    getHTML: function(){
		console.warn('el.getHTML is deprecated. use el.get("html")');
        return this.get('html');
    },

    getTag: function(){
		console.warn('el.getTag is deprecated. use el.get("tag")');
        return this.get('tag');
    },

    setOpacity: function(op){
		console.warn('el.setOpacity is deprecated. use el.set("opacity",value)');
        return this.set('opacity', op);
    },

    getValue: function(){
		console.warn('el.getValue is deprecated. use el.get("value")');
        return this.get('value')
    },
    
    // Very slightly modified from mootools
    toQueryString: function(){
		console.warn('warning el.toQueryString is slightly different');
        var queryString = [];
        this.getElements('input, select, textarea').each(function(el){
            if (!el.name || el.disabled) return;
            var value = (el.tagName.toLowerCase() == 'select') ? Element.getSelected(el).map(function(opt){
                return opt.value;
            }) : ((el.type == 'radio' || el.type == 'checkbox') && !el.checked) ? null : el.value;
            $splat(value).each(function(val){
                /*if (val)*/ queryString.push(el.name + '=' + encodeURIComponent(val));
            });
        });
        return queryString.join('&');
    },

    effect: function(property, options){
		console.warn('el.effect is deprecated. use el.tween');
        return new Fx.Tween(this, $extend({property: property}, options));
    },

    effects: function(options){
		console.warn('el.effects is deprecated. use el.morph');
        return new Fx.Morph(this, options);
    },

    filterByTag: function(tag){
		console.warn('el.filterByTag is deprecated.');
        return this.filter(tag);
    },

    filterByClass: function(className){
		console.warn('el.filterByClass is deprecated.');
        return this.filter('.' + className);
    },

    filterById: function(id){
		console.warn('el.filterById is deprecated.');
        return this.filter('#' + id);
    },

    filterByAttribute: function(name, operator, value){
		console.warn('el.filterByAttribute is deprecated.');
        return this.filter('[' + name + (operator || '') + (value || '') + ']');
    }

});


window.extend = document.extend = function(properties){
	console.warn('(window||document).extend is deprecated');
    for (var property in properties) this[property] = properties[property];
};
