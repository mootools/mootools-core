/*
Script: String.js
	Specs for String.js

License:
	MIT-style license.
*/

describe('String', {
	
	capitalize: function(){
		value_of('i like cookies'.capitalize()).should_be('I Like Cookies');
		value_of('I Like cOOKIES'.capitalize()).should_be('I Like COOKIES');
	},
	
	camelCase: function(){
		value_of('i-like-cookies'.camelCase()).should_be('iLikeCookies');
		value_of('I-Like-Cookies'.camelCase()).should_be('ILikeCookies');
	},

	hyphenate: function(){
		value_of('iLikeCookies'.hyphenate()).should_be('i-like-cookies');
		value_of('ILikeCookies'.hyphenate()).should_be('-i-like-cookies');
	},

	clean: function(){
		value_of('  i     like    cookies   '.clean()).should_be("i like cookies");
		value_of('  i \n like \n cookies \n\t  '.clean()).should_be("i like cookies");
	},

	trim: function(){
		value_of('  i like cookies  '.trim()).should_be('i like cookies');
		value_of('  i  like  cookies  '.trim()).should_be('i  like  cookies');
	},
	
	contains: function(){
		value_of('i like cookies'.contains('cookies')).should_be_true();
		value_of('i like cookies'.contains('cookies', ' ')).should_be_true();
		value_of('i like cookies'.contains('cookies', ',')).should_be_false();
		value_of('i,like,cookies'.contains('cookies')).should_be_true();
		value_of('i,like,cookies'.contains('cookies', ' ')).should_be_false();
		value_of('i,like,cookies'.contains('cookies', ',')).should_be_true();
	},
	
	test: function(){
		value_of('i like teh cookies'.test('cookies')).should_be_true();
		value_of('i like cookies'.test('ke coo')).should_be_true();
		value_of('i like cookies'.test('cookiez')).should_be_false();
		value_of('i like cookies'.test(/like/)).should_be_true();
		value_of('i like cookies'.test(/^l/)).should_be_false();
	},
	
	toInt: function(){
		value_of('10'.toInt()).should_be(10);
		value_of('10px'.toInt()).should_be(10);
		value_of('10.10em'.toInt()).should_be(10);
		value_of('10'.toInt(5)).should_be(5);
	},

	toFloat: function(){
		value_of('10.11'.toFloat()).should_be(10.11);
		value_of('10.55px'.toFloat()).should_be(10.55);
	},

	rgbToHex: function(){
		value_of('rgb(255,255,255)'.rgbToHex()).should_be('#ffffff');
		value_of('rgb(255,255,255,0)'.rgbToHex()).should_be('transparent');
	},

	hexToRgb: function(){
		value_of('#fff'.hexToRgb()).should_be('rgb(255,255,255)');
		value_of('ff00'.hexToRgb()).should_be('rgb(255,0,0)');
		value_of('#000000'.hexToRgb()).should_be('rgb(0,0,0)');
	}
	
});