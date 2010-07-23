describe('typeOf Client', {

	"should return 'collection' for HTMLElements collections": function(){
		value_of(typeOf(document.getElementsByTagName('*'))).should_be('collection');
	},

	"should return 'element' for an Element": function(){
		var div = document.createElement('div');
		value_of(typeOf(div)).should_be('element');
	},

	"should return 'elements' for Elements": function(){
		if ('Elements' in window) value_of(typeOf(new Elements)).should_be('elements');
	},

	"should return 'window' for the window object": function(){
		value_of(typeOf(window)).should_be('window');
	},

	"should return 'document' for the document object": function(){
		value_of(typeOf(document)).should_be('document');
	}

});

describe('Array.from', {

	'should return an array for an Elements collection': function(){
		var div1 = document.createElement('div');
		var div2 = document.createElement('div');
		var div3 = document.createElement('div');

		div1.appendChild(div2);
		div1.appendChild(div3);

		var array = Array.from(div1.getElementsByTagName('*'));
		value_of(Type.isArray(array)).should_be_true();
	}

});