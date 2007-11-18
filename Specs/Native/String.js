/*
Script: String.js
	Specs for String.js

License:
	MIT-style license.
*/

describe('String.capitalize', {

	'should capitalize each word': function(){
		value_of('i like cookies'.capitalize()).should_be('I Like Cookies');
		value_of('I Like cOOKIES'.capitalize()).should_be('I Like COOKIES');
	}

});

describe('String.camelCase', {

	'should convert a hyphenated string into a camel cased string': function(){
		value_of('i-like-cookies'.camelCase()).should_be('iLikeCookies');
		value_of('I-Like-Cookies'.camelCase()).should_be('ILikeCookies');
	}

});

describe('String.hyphenate', {

	'should convert a camel cased string into a hyphenated string': function(){
		value_of('iLikeCookies'.hyphenate()).should_be('i-like-cookies');
		value_of('ILikeCookies'.hyphenate()).should_be('-i-like-cookies');
	}

});

describe('String.clean', {

	'should clean all extraneous whitespace from the string': function(){
		value_of('  i     like    cookies   '.clean()).should_be("i like cookies");
		value_of('  i \n like \n cookies \n\t  '.clean()).should_be("i like cookies");
	}

});

describe('String.trim', {

	'should trim left and right whitespace from the string': function(){
		value_of('  i like cookies  '.trim()).should_be('i like cookies');
		value_of('  i  like  cookies  '.trim()).should_be('i  like  cookies');
	}

});

describe('String.contains', {

	'should return true if the string contains a string, otherwise false': function(){
		value_of('i like cookies'.contains('cookies')).should_be_true();
		value_of('i,like,cookies'.contains('cookies')).should_be_true();
		value_of('mootools'.contains('inefficient javascript')).should_be_false();
	},

	'should return true if the string constains the string and separator, otherwise false': function(){
		value_of('i like cookies'.contains('cookies', ' ')).should_be_true();
		value_of('i like cookies'.contains('cookies', ',')).should_be_false();

		value_of('i,like,cookies'.contains('cookies', ' ')).should_be_false();
		value_of('i,like,cookies'.contains('cookies', ',')).should_be_true();
	}

});

describe('String.test', {

	'should return true if the test matches the string, otherwise false': function(){
		value_of('i like teh cookies'.test('cookies')).should_be_true();
		value_of('i like cookies'.test('ke coo')).should_be_true();
		value_of('I LIKE COOKIES'.test('cookie', 'i')).should_be_true();
		value_of('i like cookies'.test('cookiez')).should_be_false();
	},

	'should return true if the regular expression test matches the string, otherwise false': function(){
		value_of('i like cookies'.test(/like/)).should_be_true();
		value_of('i like cookies'.test(/^l/)).should_be_false();
	}

});

describe('String.toInt', {

	'should convert the string into an integer': function(){
		value_of('10'.toInt()).should_be(10);
		value_of('10px'.toInt()).should_be(10);
		value_of('10.10em'.toInt()).should_be(10);
	},

	'should convert the string into an integer with a specific base': function(){
		value_of('10'.toInt(5)).should_be(5);
	}

});

describe('String.toFloat', {

	'should convert the string into a float': function(){
		value_of('10.11'.toFloat()).should_be(10.11);
		value_of('10.55px'.toFloat()).should_be(10.55);
	}

});

describe('String.rgbToHex', {

	'should convert the string into a CSS hex string': function(){
		value_of('rgb(255,255,255)'.rgbToHex()).should_be('#ffffff');
		value_of('rgb(255,255,255,0)'.rgbToHex()).should_be('transparent');
	}

});

describe('String.hexToRgb', {

	'should convert the CSS hex string into a CSS rgb string': function(){
		value_of('#fff'.hexToRgb()).should_be('rgb(255,255,255)');
		value_of('ff00'.hexToRgb()).should_be('rgb(255,0,0)');
		value_of('#000000'.hexToRgb()).should_be('rgb(0,0,0)');
	}

});

describe('String.stripScripts', {

	'should strip all script tags from a string': function(){
		value_of('<div><script type="text/javascript" src="file.js"></script></div>'.stripScripts()).should_be('<div></div>');
	},

	'should execute the stripped tags from the string': function(){
		value_of('<div><script type="text/javascript"> var stripScriptsSpec = 42; </script></div>'.stripScripts(true)).should_be('<div></div>');
		value_of(window.stripScriptsSpec).should_be(42);
		value_of('<div><script>\n// <!--\nvar stripScriptsSpec = 24;\n//-->\n</script></div>'.stripScripts(true)).should_be('<div></div>');
		value_of(window.stripScriptsSpec).should_be(24);
		value_of('<div><script>\n/*<![CDATA[*/\nvar stripScriptsSpec = 4242;\n/*]]>*/</script></div>'.stripScripts(true)).should_be('<div></div>');
		value_of(window.stripScriptsSpec).should_be(4242);
	}

});