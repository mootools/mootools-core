/*
---
name: Request
requires: ~
provides: ~
...
*/

describe('Request', function(){

	var hasWithCredentials = 'withCredentials' in new Browser.Request;

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
		var onComplete = sinon.spy();

		new Request({
			url: '/',
			onComplete: onComplete
		}).send({data: {
			'__response': 'res&amp;ponsé'
		}});

		this.requests[0].respond(200, {'Content-Type': 'text/plain'}, 'res&amp;ponsé');

		// Checks the first argument from the first call.
		expect(onComplete.args[0][0]).to.equal('res&amp;ponsé');
	});

	it('should create a Request with method get and sending data', function(){
		var onComplete = sinon.spy();

		new Request({
			url: '../Helpers/request.php',
			method: 'get',
			onComplete: onComplete
		}).send({data: {'some': 'data'}});

		this.requests[0].respond(200, {'Content-Type': 'text/json'}, 'data');

		expect(onComplete.called).to.equal(true);
		expect(onComplete.args[0][0]).to.equal('data');
	});

	it('the options passed on the send method should rewrite the current ones', function(){
		var onComplete = sinon.spy();

		new Request({
			url: '../Helpers/request.php',
			method: 'get',
			data: {'setup': 'data'},
			onComplete: onComplete
		}).send({method: 'post', data: {'send': 'senddata'}});

		var requested = this.requests[0];

		expect(requested.method.toLowerCase()).to.equal('post');

		requested.respond(200, {'Content-Type': 'text/plain'}, '');

		expect(onComplete.called).to.equal(true);
	});

	xdescribe('(async 1)', function(){

		beforeEach(function(done){
			this.onComplete = sinon.spy(function(){ done(); });
			this.request = new Request({
				url: '../Helpers/request.php',
				onComplete: this.onComplete
			}).send({data: {
				'__type': 'xml',
				'__response': 'response'
			}});
		});

		it('should create an ajax request and as it\'s an invalid XML, onComplete will receive null as the xml document', function(){
			expect(this.onComplete.called).to.equal(true);
			expect(this.onComplete.args[0][0]).to.equal('response');
			expect(this.request.response.text).to.equal('response');
		}, 1500);

	});

	xdescribe('(async 2)', function(){

		beforeEach(function(done){
			this.onComplete = sinon.spy();
			this.request = new Request({
				url: '../Helpers/request.php',
				onComplete: this.onComplete
			}).send({data: {
				'__type': 'xml',
				'__response': 'response'
			}});

			this.chain = sinon.spy(function(){ done(); });
			this.request.chain(this.chain).send({data: {
				'__type': 'xml',
				'__response': '<node>response</node><no></no>'
			}});
		});

		it('should create an ajax request and as it\'s an invalid XML, onComplete will receive null as the xml document', function(){
			expect(this.chain.called).to.equal(true);
			expect(this.onComplete.called).to.equal(true);
			expect(this.onComplete.args[0][0]).to.equal('<node>response</node><no></no>');
			expect(this.request.response.text).to.equal('<node>response</node><no></no>');
		}, 800);

	});

	it('should not overwrite the data object', function(){
		var onComplete = sinon.spy();

		new Request({
			url: '../Helpers/request.php',
			data: {
				__response: 'data'
			},
			onComplete: onComplete
		}).post();

		var requested = this.requests[0];
		requested.respond(200, {'Content-Type': 'text/plain'}, requested.requestBody);

		expect(onComplete.called).to.equal(true);
		expect(onComplete.args[0][0]).to.equal('__response=data');
	});

	it('should not set xhr.withCredentials flag by default', function(){
		var request = new Request({
			url: '/something/or/other'
		}).send();

		expect(request.xhr.withCredentials).to.not.be.ok();
	});

	describe('(thenable)', function(){

		beforeEach(function(){
			this.request = new Request({
				url: '../Helpers/request.php'
			});

			var self = this;
			this.onFulfilled = sinon.spy(function(){ self.expectations.apply(self, arguments); });
			this.onRejected = sinon.spy(function(){ self.expectations.apply(self, arguments); });

			this.request.then(this.onFulfilled, this.onRejected);
			this.request.send();
		});

		it('should fulfill when completed', function(done){
			this.requests[0].respond(200, {'Content-Type': 'text/plain'}, 'res&amp;ponsé');

			this.expectations = function(){
				var error;
				try {
					expect(this.onRejected.called).to.equal(false);
					expect(this.onFulfilled.called).to.equal(true);
					expect(this.onFulfilled.args[0][0]).to.eql({text: 'res&amp;ponsé', xml: null});
				} catch (thrown){
					error = thrown;
				}
				done(error);
			};
		});

		it('should reject when failed', function(done){
			this.requests[0].respond(400, {'Content-Type': 'text/plain'}, 'Nope.');

			this.expectations = function(){
				var error;
				try {
					expect(this.onFulfilled.called).to.equal(false);
					expect(this.onRejected.called).to.equal(true);
					expect(this.onRejected.args[0][0].reason).to.equal('failure');
				} catch (thrown){
					error = thrown;
				}
				done(error);
			};
		});

		it('should reject when cancelled', function(done){
			this.request.cancel();

			this.expectations = function(){
				var error;
				try {
					expect(this.onFulfilled.called).to.equal(false);
					expect(this.onRejected.called).to.equal(true);
					expect(this.onRejected.args[0][0].reason).to.equal('cancel');
				} catch (thrown){
					error = thrown;
				}
				done(error);
			};
		});

	});

	var dit;
//<1.4compat>
	dit = hasWithCredentials ? it : xit;
	dit('should set xhr.withCredentials flag in 1.4 for this.options.user', function(){
		var request = new Request({
			url: '/something/or/other',
			user: 'someone'
		}).send();

		expect(request.xhr.withCredentials).to.equal(true);
	});
//</1.4compat>

	dit = hasWithCredentials ? /*<1.4compat>*/xit || /*</1.4compat>*/it : xit; // Don't run unless no compat.
	dit('should not set xhr.withCredentials flag in 1.5 for this.options.user', function(){
		var request = new Request({
			url: '/something/or/other',
			user: 'someone'
		}).send();

		expect(request.xhr.withCredentials).to.not.be.ok();
	});

	dit('should set xhr.withCredentials flag if options.withCredentials is set', function(){
		var request = new Request({
			url: '/something/or/other',
			withCredentials: true
		}).send();

		expect(request.xhr.withCredentials).to.equal(true);
	});

});
