/*
---
name: String
requires: ~
provides: ~
...
*/

describe("String Methods", function(){

	// String.capitalize

	it('should capitalize each word', function(){
		expect('i like cookies'.capitalize()).toEqual('I Like Cookies');
		expect('I Like cOOKIES'.capitalize()).toEqual('I Like COOKIES');
	});

	// String.camelCase

	it('should convert a hyphenated string into a camel cased string', function(){
		expect('i-like-cookies'.camelCase()).toEqual('iLikeCookies');
		expect('I-Like-Cookies'.camelCase()).toEqual('ILikeCookies');
	});

	// String.hyphenate

	it('should convert a camel cased string into a hyphenated string', function(){
		expect('iLikeCookies'.hyphenate()).toEqual('i-like-cookies');
		expect('ILikeCookies'.hyphenate()).toEqual('-i-like-cookies');
	});

	// String.clean

	it('should clean all extraneous whitespace from the string', function(){
		expect('  i     like    cookies   '.clean()).toEqual("i like cookies");
		expect('  i\nlike \n cookies \n\t  '.clean()).toEqual("i like cookies");
	});

	// String.trim

	it('should trim left and right whitespace from the string', function(){
		expect('  i like cookies  '.trim()).toEqual('i like cookies');
		expect('  i  \tlike  cookies  '.trim()).toEqual('i  \tlike  cookies');
	});

	//<1.4compat>
	// String.contains
	it('should return true if the string contains a string otherwise false', function(){
		expect('i like cookies'.contains('cookies')).toBeTruthy();
		expect('i,like,cookies'.contains('cookies')).toBeTruthy();
		expect('mootools'.contains('inefficient javascript')).toBeFalsy();
	});

	it('should return true if the string constains the string and separator otherwise false', function(){
		expect('i like cookies'.contains('cookies', ' ')).toBeTruthy();
		expect('i like cookies'.contains('cookies', ',')).toBeFalsy();

		expect('i,like,cookies'.contains('cookies', ' ')).toBeFalsy();
		expect('i,like,cookies'.contains('cookies', ',')).toBeTruthy();
	});
	//</1.4compat>

	// String.test

	it('should return true if the test matches the string otherwise false', function(){
		expect('i like teh cookies'.test('cookies')).toBeTruthy();
		expect('i like cookies'.test('ke coo')).toBeTruthy();
		expect('I LIKE COOKIES'.test('cookie', 'i')).toBeTruthy();
		expect('i like cookies'.test('cookiez')).toBeFalsy();
	});

	it('should return true if the regular expression test matches the string otherwise false', function(){
		expect('i like cookies'.test(/like/)).toBeTruthy();
		expect('i like cookies'.test(/^l/)).toBeFalsy();
	});

	// String.toInt

	it('should convert the string into an integer', function(){
		expect('10'.toInt()).toEqual(10);
		expect('10px'.toInt()).toEqual(10);
		expect('10.10em'.toInt()).toEqual(10);
	});

	it('should convert the string into an integer with a specific base', function(){
		expect('10'.toInt(5)).toEqual(5);
	});

	// String.toFloat

	it('should convert the string into a float', function(){
		expect('10.11'.toFloat()).toEqual(10.11);
		expect('10.55px'.toFloat()).toEqual(10.55);
	});

	// String.rgbToHex

	it('should convert the string into a CSS hex string', function(){
		expect('rgb(255,255,255)'.rgbToHex()).toEqual('#ffffff');
		expect('rgb(255,255,255,0)'.rgbToHex()).toEqual('transparent');
	});

	// String.hexToRgb

	it('should convert the CSS hex string into a CSS rgb string', function(){
		expect('#fff'.hexToRgb()).toEqual('rgb(255,255,255)');
		expect('ff00'.hexToRgb()).toEqual('rgb(255,0,0)');
		expect('#000000'.hexToRgb()).toEqual('rgb(0,0,0)');
	});

	// String.substitute

	it('should substitute values from objects', function(){
		expect('This is {color}.'.substitute({'color': 'blue'})).toEqual('This is blue.');
		expect('This is {color} and {size}.'.substitute({'color': 'blue', 'size': 'small'})).toEqual('This is blue and small.');
	});

	it('should substitute values from arrays', function(){
		expect('This is {0}.'.substitute(['blue'])).toEqual('This is blue.');
		expect('This is {0} and {1}.'.substitute(['blue', 'small'])).toEqual('This is blue and small.');
	});

	it('should remove undefined values', function(){
		expect('Checking {0}, {1}, {2}, {3} and {4}.'.substitute([1, 0, undefined, null])).toEqual('Checking 1, 0, ,  and .');
		expect('This is {not-set}.'.substitute({})).toEqual('This is .');
	});

	it('should ignore escaped placeholders', function(){
		expect('Ignore \\{this} but not {that}.'.substitute({'that': 'the others'})).toEqual('Ignore {this} but not the others.');
	});

	it('should substitute with a custom regex', function(){
		var php = (/\$([\w-]+)/g);
		expect('I feel so $language.'.substitute({'language': 'PHP'}, php)).toEqual('I feel so PHP.');
		var ror = (/#\{([^}]+)\}/g);
		expect('I feel so #{language}.'.substitute({'language': 'RoR'}, ror)).toEqual('I feel so RoR.');
	});

	it('should substitute without goofing up nested curly braces', function(){
		expect("fred {is {not} very} cool".substitute({ 'is {not':'BROKEN' })).not.toEqual("fred BROKEN very} cool");
		expect('this {should {break} mo} betta'.substitute({ 'break':'work' })).toEqual('this {should work mo} betta');
	});

	// String.splice

	it('should remove characters', function () {
		expect('Hello, big world!'.splice(6, 4)).toEqual('Hello, world!');
		expect('Hello, big world!'.splice(6, -4)).toEqual('Hello, big world!');
		expect('Hello, big world!'.splice(6, -4)).not.toEqual('Hello, world!');
		expect('Hello, big world!'.splice(100, 5)).toEqual('Hello, big world!');
		expect('Hello, big world!'.splice(100, 5)).not.toEqual('Hello, world!');
		expect('Hello, big world!'.splice(-11, 4)).toEqual('Hello, world!');
		expect('Hello, big world!'.splice(5, 100)).toEqual('Hello');
	});

	it('should add strings and objects', function () {
		expect('Add here'.splice(3, 0, ' two', ' substrings')).toEqual('Add two substrings here');
		expect('Such a beautiful'.splice(-1, 0, ' array: ', [1, 1, 2, 3, 5])).toEqual('Such a beautiful array: 1,1,2,3,5');
		expect('Add here'.splice(-6, 0, ' substring')).toEqual('Add substring here');
		expect('Add here'.splice(100, 0, ' a substring')).toEqual('Add here a substring');
		expect('added here'.splice(-100, 0, 'Substring is ')).toEqual('Substring is added here');
	});

	it('should combine both add strings and remove characters next to added', function () {
		expect('Replace this word'.splice(8, 4, 'that')).toEqual('Replace that word');
		expect('You can count from an end'.splice(-7, 2, 'the', ' very')).toEqual('You can count from the very end');
	});

	it('should recognize flag', function () {
		expect('Hello, big world!'.splice(6, 4, true)).toEqual(['Hello, world!', ' big']);
		expect('Add here'.splice(100, 0, ' a substring', true)).toEqual(['Add here a substring', '']);
		expect('Replace this word'.splice(8, 4, 'that', true)).toEqual(['Replace that word', 'this']);
		expect('Hello, big world!'.splice(6, 4, false)).toEqual('Hello, world!');
		expect('Add here'.splice(100, 0, ' a substring', false)).toEqual('Add here a substring');
		expect('Replace this word'.splice(8, 4, 'that', false)).toEqual('Replace that word');
		expect('You can get removed string'.splice(12, 14, 'into ', 'the car', true)).toEqual(['You can get into the car', 'removed string']);
		expect('Such a beautiful'.splice(-1, 0, ' array: ', [1, 1, 2, 3, 5], true)).toEqual(['Such a beautiful array: 1,1,2,3,5', '']);
	});

});
