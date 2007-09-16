/*
Script: String.js
	Unit Tests for String.js

License:
	MIT-style license.
*/

Tests.String = new Test.Suite('String', {
	
	test: function(){
		this.end(
			Assert.isTrue('i like teh cookies'.test('cookies')),
			Assert.isTrue('i like cookies'.test('ke coo')),
			Assert.isFalse('i like cookies'.test('cookiez')),
			Assert.isTrue('i like cookies'.test(/like/)),
			Assert.isFalse('i like cookies'.test(/^l/))
		);
	},
	
	toInt: function(){
		this.end(
			Assert.equals('10'.toInt(), 10),
			Assert.equals('10px'.toInt(), 10),
			Assert.equals('10.10em'.toInt(), 10),
			Assert.equals('10'.toInt(5), 5)
		);
	},
	
	toFloat: function(){
		this.end(
			Assert.equals('10.11'.toFloat(), 10.11),
			Assert.equals('10.55px'.toFloat(), 10.55)
		);
	},
	
	camelCase: function(){
		this.end(
			Assert.equals('i-like-cookies'.camelCase(), 'iLikeCookies'),
			Assert.equals('I-Like-Cookies'.camelCase(), 'ILikeCookies')
		);
	},
	
	hyphenate: function(){
		this.end(
			Assert.equals('iLikeCookies'.hyphenate(), 'i-like-cookies'),
			Assert.equals('ILikeCookies'.hyphenate(), '-i-like-cookies')
		);
	},
	
	capitalize: function(){
		this.end(
			Assert.equals('i like cookies'.capitalize(), 'I Like Cookies'),
			Assert.equals('I Like cOOKIES'.capitalize(), 'I Like COOKIES')
		);
	},
	
	trim: function(){
		this.end(
			Assert.equals('  i like cookies  '.trim(), 'i like cookies'),
			Assert.equals('  i  like  cookies  '.trim(), 'i  like  cookies')
		);
	},
	
	clean: function(){
		this.end(Assert.equals('  i     like    cookies   '.clean(), 'i like cookies'));
	},
	
	rgbToHex: function(){
		this.end(
			Assert.equals('rgb(255,255,255)'.rgbToHex(), '#ffffff'),
			Assert.equals('rgb(255,255,255,0)'.rgbToHex(), 'transparent')
		);
	},
	
	hexToRgb: function(){
		this.end(
			Assert.equals('#fff'.hexToRgb(), 'rgb(255,255,255)'),
			Assert.equals('ff00'.hexToRgb(), 'rgb(255,0,0)'),
			Assert.equals('#000000'.hexToRgb(), 'rgb(0,0,0)')
		);
	},
	
	contains: function(){
		this.end(
			Assert.isTrue('i like cookies'.contains('cookies')),
			Assert.isTrue('i like cookies'.contains('cookies', ' ')),
			Assert.isFalse('i like cookies'.contains('cookies', ',')),
			Assert.isTrue('i,like,cookies'.contains('cookies')),
			Assert.isFalse('i,like,cookies'.contains('cookies', ' ')),
			Assert.isTrue('i,like,cookies'.contains('cookies', ','))
		);
	}

});