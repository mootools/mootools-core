/*=
name: String
description: String prototypes and generics.
requires: Core
=*/

String.implement({

	test: function(regex, params){
		return ((typeOf(regex) == 'string') ? new RegExp(regex, params) : regex).test(this);
	},

	contains: function(string, separator){
		return (separator) ? (separator + this + separator).indexOf(separator + string + separator) > -1 : this.indexOf(string) > -1;
	},

	trim: function(){
		return this.replace(/^\s+|\s+$/g, '');
	},

	clean: function(){
		return this.replace(/\s+/g, ' ').trim();
	},

	camelCase: function(separator){
		return this.replace(new RegExp((separator || '-') + '\\D', 'g'), function(match){
			return match.charAt(1).toUpperCase();
		});
	},

	hyphenate: function(separator){
		return this.replace(/[A-Z]/g, function(match){
			return ((separator || '-') + match.toLowerCase());
		});
	},

	capitalize: function(){
		return this.replace(/\b[a-z]/g, function(match){
			return match.toUpperCase();
		});
	},

	escapeRegExp: function(){
		return this.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
	},

	substitute: function(object, regexp){
		return this.replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name){
			if (match.charAt(0) == '\\') return match.slice(1);
			return (object[name] != null) ? object[name] : '';
		});
	}

});
