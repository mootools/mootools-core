/*
---
name: Request.JSON
requires: ~
provides: ~
...
*/

describe('Request.JSON', function(){

	beforeEach(function(){
		this.spy = sinon.spy();
		this.xhr = sinon.useFakeXMLHttpRequest();
		var requests = this.requests = [];
		this.xhr.onCreate = function(xhr){
			requests.push(xhr);
		};
	});

	afterEach(function(){
		this.xhr.restore();
	});

	it('should create a JSON request', function(){
		var response = '{"ok":true}';

		this.spy.identity = 'Requst.JSON';
		this.request = new Request.JSON({
			url: '../Helpers/request.php',
			onComplete: this.spy
		}).send({data: {
			'__response': response
		}});

		this.requests[0].respond(200, {'Content-Type': 'text/json'}, response);
		expect(this.spy.called).to.equal(true);

		// Checks the first argument from the first call.
		expect(this.spy.args[0][0]).to.eql({ok: true});
	});

	it('should fire the error event', function(){
		var response = '{"ok":function(){invalid;}}';

		this.spy.identity = 'Requst.JSON error';
		this.request = new Request.JSON({
			url: '../Helpers/request.php',
			onError: this.spy
		}).send({data: {
			'__response': response
		}});

		this.requests[0].respond(200, {'Content-Type': 'text/json'}, response);
		expect(this.spy.called).to.equal(true);

		// Checks the first argument from the first call.
		expect(this.spy.args[0][0]).to.equal('{"ok":function(){invalid;}}');
	});

});
