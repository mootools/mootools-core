/*
Script: String.js
	Unit Tests for String.js

License:
	MIT-style license.
*/

Tests.String = new Test.Suite('String', {
	
	test: function(){
		return Test.all(
			$equals('i like teh cookies'.test('cookies'), true),
			$equals('i like cookies'.test('ke coo'), true),
			$equals('i like cookies'.test('cookiez'), false),
			$equals('i like cookies'.test(/like/), true),
			$equals('i like cookies'.test(/^l/), false)
		);
	},
	
	toInt: function(){
		return Test.all(
			$equals('10'.toInt(), 10),
			$equals('10px'.toInt(), 10),
			$equals('10.10em'.toInt(), 10),
			$equals('10'.toInt(5), 5)
		);
	},
	
	toFloat: function(){
		return Test.all(
			$equals('10.11'.toFloat(), 10.11),
			$equals('10.55px'.toFloat(), 10.55)
		);
	},
	
	camelCase: function(){
		return Test.all(
			$equals('i-like-cookies'.camelCase(), 'iLikeCookies'),
			$equals('I-Like-Cookies'.camelCase(), 'ILikeCookies')
		);
	},
	
	hyphenate: function(){
		return Test.all(
			$equals('iLikeCookies'.hyphenate(), 'i-like-cookies'),
			$equals('ILikeCookies'.hyphenate(), '-i-like-cookies')
		);
	},
	
	capitalize: function(){
		return Test.all(
			$equals('i like cookies'.capitalize(), 'I Like Cookies'),
			$equals('I Like cOOKIES'.capitalize(), 'I Like COOKIES')
		);
	},
	
	trim: function(){
		return Test.all(
			$equals('  i like cookies  '.trim(), 'i like cookies'),
			$equals('  i  like  cookies  '.trim(), 'i  like  cookies')
		);
	},
	
	clean: function(){
		return $equals('  i     like    cookies   '.clean(), 'i like cookies');
	},
	
	rgbToHex: function(){
		return Test.all(
			$equals('rgb(255,255,255)'.rgbToHex(), '#ffffff'),
			$equals('rgb(255,255,255,0)'.rgbToHex(), 'transparent')
		);
	},
	
	hexToRgb: function(){
		return Test.all(
			$equals('#fff'.hexToRgb(), 'rgb(255,255,255)'),
			$equals('ff00'.hexToRgb(), 'rgb(255,0,0)'),
			$equals('#000000'.hexToRgb(), 'rgb(0,0,0)')
		);
	},
	
	contains: function(){
		return Test.all(
			$equals('i like cookies'.contains('cookies'), true),
			$equals('i like cookies'.contains('cookies', ' '), true),
			$equals('i like cookies'.contains('cookies', ','), false),
			$equals('i,like,cookies'.contains('cookies'), true),
			$equals('i,like,cookies'.contains('cookies', ' '), false),
			$equals('i,like,cookies'.contains('cookies', ','), true)
		);
	}

});