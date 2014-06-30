/*
---
name: Request
requires: ~
provides: ~
...
*/

describe('Request', function(){

	beforeEach(function(){
		this.xhr = sinon.useFakeXMLHttpRequest();
		var requests = this.requests = [];
		this.xhr.onCreate = function(xhr){
			requests.push(xhr);
		};
	});

	afterEach(function(){
		this.xhr.restore();
	});

	it('should create an ajax request', function(){
		var onComplete = jasmine.createSpy('Request onComplete');

		var request = new Request({
			url: '/',
			onComplete: onComplete
		}).send({data: {
			'__response': 'res&amp;ponsé'
		}});

		this.requests[0].respond(200, {'Content-Type': 'text/plain'}, 'res&amp;ponsé');

		// checks the first argument from the first call
		expect(onComplete.argsForCall[0][0]).toEqual('res&amp;ponsé');

	});

	it('should create a Request with method get and sending data', function(){

		var onComplete = jasmine.createSpy('Request onComplete data');

		var request = new Request({
			url: '../Helpers/request.php',
			method: 'get',
			onComplete: onComplete
		}).send({data: {'some': 'data'}});

		this.requests[0].respond(200, {'Content-Type': 'text/json'}, 'data');

		expect(onComplete.wasCalled).toBe(true);

		expect(onComplete.argsForCall[0][0]).toEqual('data');

	});

	it('the options passed on the send method should rewrite the current ones', function(){

		var onComplete = jasmine.createSpy('Request onComplete rewrite data');
		var request = new Request({
			url: '../Helpers/request.php',
			method: 'get',
			data: {'setup': 'data'},
			onComplete: onComplete
		}).send({method: 'post', data: {'send': 'senddata'}});

		var requested = this.requests[0];

		expect(requested.method.toLowerCase()).toBe('post');

		requested.respond(200, {'Content-Type': 'text/plain'}, '');

		expect(onComplete.wasCalled).toBe(true);
	});

	xit('(async) should create an ajax request and as it\'s an invalid XML, onComplete will receive null as the xml document', function(){

		runs(function(){
			this.onComplete = jasmine.createSpy();
			this.request = new Request({
				url: '../Helpers/request.php',
				onComplete: this.onComplete
			}).send({data: {
				'__type': 'xml',
				'__response': 'response'
			}});
		});

		waitsFor(800, function(){
			return this.onComplete.wasCalled;
		});

		runs(function(){
			expect(this.onComplete.argsForCall[0][0]).toEqual('response');
			expect(this.request.response.text).toEqual('response');
		});

		runs(function(){
			this.chain = jasmine.createSpy();
			this.request.chain(this.chain).send({data: {
				'__type': 'xml',
				'__response': '<node>response</node><no></no>'
			}});
		});

		waitsFor(800, function(){
			return this.chain.wasCalled;
		});

		runs(function(){
			expect(this.onComplete.argsForCall[0][0]).toEqual('<node>response</node><no></no>');
			expect(this.request.response.text).toEqual('<node>response</node><no></no>');
		});

	});

	it('should not overwrite the data object', function(){

		var onComplete = jasmine.createSpy('Request onComplete overwrite protection');
		var request = new Request({
			url: '../Helpers/request.php',
			data: {
				__response: 'data'
			},
			onComplete: onComplete
		}).post();

		var requested = this.requests[0];
		requested.respond(200, {'Content-Type': 'text/plain'}, requested.requestBody)

		expect(onComplete.wasCalled).toBe(true);

		expect(onComplete.argsForCall[0][0]).toEqual('__response=data');

	});

	it('should not set xhr.withCredentials flag by default', function(){
		var request = new Request({
			url: '/something/or/other'
		}).send();

		expect(request.xhr.withCredentials).toBeFalsy();
	});

	/*<1.4compat>*/
	it('should set xhr.withCredentials flag in 1.4 for this.options.user', function(){
		var request = new Request({
			url: '/something/or/other',
			user: 'someone'
		}).send();

		expect(request.xhr.withCredentials).toBe(true);
	});
	/*</1.4compat>*/

	var dit = /*<1.4compat>*/xit || /*</1.4compat>*/it; // don't run unless no compat
	dit('should not set xhr.withCredentials flag in 1.5 for this.options.user', function(){
		var request = new Request({
			url: '/something/or/other',
			user: 'someone'
		}).send();

		expect(request.xhr.withCredentials).toBeFalsy();
	});

	dit('should set xhr.withCredentials flag if options.withCredentials is set', function(){
		var request = new Request({
			url: '/something/or/other',
			withCredentials: true
		}).send();

		expect(request.xhr.withCredentials).toBe(true);
	});
});
