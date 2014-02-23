/*
---
name: Browser
requires: ~
provides: ~
...
*/

//<1.2compat>
describe('$exec', function(){

	it('should evaluate on global scope', function(){
		$exec.call($exec, 'var execSpec = 42');
		expect(window.execSpec).toEqual(42);
	});

	it('should return the evaluated script', function(){
		expect($exec('$empty();')).toEqual('$empty();');
	});

});
//</1.2compat>

describe('Browser.exec', function(){

	it('should evaluate on global scope', function(){
		Browser.exec.call($exec, 'var execSpec = 42');
		expect(window.execSpec).toEqual(42);
	});

	it('should return the evaluated script', function(){
		expect(Browser.exec('function(){ return "evil"; }()')).toEqual('evil');
	});

});

// String.stripScripts

describe('String.stripScripts', function(){

	it('should strip all script tags from a string', function(){
		expect('<div><script type="text/javascript" src="file.js"></script></div>'.stripScripts()).toEqual('<div></div>');
	});

	it('should execute the stripped tags from the string', function(){
		expect('<div><script type="text/javascript"> var stripScriptsSpec = 42; </script></div>'.stripScripts(true)).toEqual('<div></div>');
		expect(window.stripScriptsSpec).toEqual(42);
		expect('<div><script>\n// <!--\nvar stripScriptsSpec = 24;\n//-->\n</script></div>'.stripScripts(true)).toEqual('<div></div>');
		expect(window.stripScriptsSpec).toEqual(24);
		expect('<div><script>\n/*<![CDATA[*/\nvar stripScriptsSpec = 4242;\n/*]]>*/</script></div>'.stripScripts(true)).toEqual('<div></div>');
		expect(window.stripScriptsSpec).toEqual(4242);
	});

});


describe('Document', function(){

	it('should hold the parent window', function(){
		expect(document.window).toEqual(window);
	});

	it('should hold the head element', function(){
		expect(document.head.tagName.toLowerCase()).toEqual('head');
	});

});

describe('Window', function(){

	it('should set the Element prototype', function(){
		expect($defined(window.Element.prototype)).toBeTruthy();
	});

});

describe('Browser', function(){

	it('should think it is executed in a browser', function(){
		var isPhantomJS = !!navigator.userAgent.match(/phantomjs/i);
		expect(isPhantomJS || Browser.ie || Browser.safari || Browser.chrome || Browser.firefox || Browser.opera).toEqual(true);
	});

	it('should assume the IE version is emulated by the documentMode (X-UA-Compatible)', function(){
		if (Browser.ie && document.documentMode) expect(Browser.version).toEqual(document.documentMode);
	});

});

describe('Browser.parse', function(){

	var parse = Browser.parse;
	var userAgents = {
		ie6: {
			desc: 'Internet Explorer 6',
			string: 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2; Win64; x64; SV1; .NET CLR 2.0.50727)',
			expect: {
				name: 'ie',
				version: 6
			}
		},
		ie7: {
			desc: 'Internet Explorer 7',
			string: 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)',
			expect: {
				name: 'ie',
				version: 7
			}
		},
		ie8: {
			desc: 'Internet Explorer 8',
			string: 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)',
			expect: {
				name: 'ie',
				version: 8
			}
		},
		ie9: {
			desc: 'Internet Explorer 9',
			string: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)',
			expect: {
				name: 'ie',
				version: 9
			}
		},
		ie10: {
			desc: 'Internet Explorer 10',
			string: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)',
			expect: {
				name: 'ie',
				version: 10
			}
		},
		ie11: {
			desc: 'Internet Explorer 11',
			string: 'Mozilla/5.0 (IE 11.0; Windows NT 6.3; Trident/7.0; .NET4.0E; .NET4.0C; rv:11.0) like Gecko',
			expect: {
				name: 'ie',
				version: 11
			}
		},
		ie11v2: {
			desc: 'Internet Explorer 11 v2',
			string: 'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv 11.0) like Gecko',
			expect: {
				name: 'ie',
				version: 11
			}
		},
		ieCompat: {
			desc: 'Internet Explorer 10 in IE7 compatibility',
			string: 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/6.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)',
			expect: {
				name: 'ie',
				version: 7
			}
		},
		firefox: {
			desc: 'Firefox v24',
			string: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:24.0) Gecko/20100101 Firefox/24.0',
			expect: {
				name: 'firefox',
				version: 24
			}
		},
		opera10: {
			desc: 'Opera 10',
			string: 'Opera/9.80 (Windows NT 5.1; U; cs) Presto/2.2.15 Version/10.00',
			expect: {
				name: 'opera',
				version: 10
			}
		},
		opera11: {
			desc: 'Opera 11.62',
			string: 'Opera/9.80 (Windows NT 6.1; WOW64; U; pt) Presto/2.10.229 Version/11.62',
			expect: {
				name: 'opera',
				version: 11.62
			}
		},
		opera12: {
			desc: 'Opera 12.14',
			string: 'Opera/9.80 (Windows NT 6.0) Presto/2.12.388 Version/12.14',
			expect: {
				name: 'opera',
				version: 12.14
			}
		},
		safari: {
			desc: 'Safari 6.1',
			string: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.71 (KHTML, like Gecko) Version/6.1 Safari/537.71',
			expect: {
				name: 'safari',
				version: 6.1
			}
		},
		chrome: {
			desc: 'Chrome 31',
			string: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.57 Safari/537.36',
			expect: {
				name: 'chrome',
				version: 31
			}
		}
	};

	var testUA = function(ua){
		return function(){
			var browser = parse(ua.string.toLowerCase(), '');
			Object.forEach(ua.expect, runExpects, browser);
		}
	}

	var runExpects = function(val, key){
		expect(this[key]).toEqual(val);
	}

	Object.forEach(userAgents, function(obj){
		it('should parse ' + obj.desc + ' user agent string', testUA(obj));
	});

});
