/*
---
name: Browser Specs
description: n/a
requires: [Core/Browser]
provides: [Browser.Specs]
...
*/

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
		// Uncomment once this is fixed
		// ie11v2: {
		// 	desc: 'Internet Explorer 11 v2',
		// 	string: 'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv 11.0) like Gecko',
		// 	expect: {
		// 		name: 'ie',
		// 		version: 11
		// 	}
		// },
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
