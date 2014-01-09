/*
---

Script: Core.js
description: Public Specs for Core.js 1.2

License: MIT-style license.

requires: [Core/Cookie]
provides: [1.2.Cookie.Specs]

...
*/

describe('Cookie', {

	"should set a cookie": function(){
		Cookie.write('test', 1);


	}

});
