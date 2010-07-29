/*
Script: Request.js
	Public Specs for Request.js 1.3

License:
	MIT-style license.
*/

describe('Request', function(){

	it('should create an ajax request', function(){

		runs(function(){
			this.onComplete = jasmine.createSpy();
			this.request = new Request({
				url: 'Helpers/request.php',
				onComplete: this.onComplete
			}).send({data: {
				'__response': 'response'
			}});
		});
		
		waitsFor(800, function(){
			return this.onComplete.wasCalled;
		});
		
		runs(function(){
			expect(this.onComplete).toHaveBeenCalledWith('response', null);
		});
		
	});
	
	it('should create an ajax request and as it\'s an invalid XML, onComplete will receive null as the xml document', function(){

		runs(function(){
			this.onComplete = jasmine.createSpy();
			this.request = new Request({
				url: 'Helpers/request.php',
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
			expect(this.onComplete).toHaveBeenCalledWith('response', null);
			expect(this.request.response.xml).toEqual(null);
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
			expect(this.request.response.xml).toEqual(null);
			expect(this.request.response.text).toEqual('<node>response</node><no></no>');
		});
		
	});
	
	it('should return null if the response has no xml mime/type', function(){

		runs(function(){
			this.onComplete = jasmine.createSpy();
			this.request = new Request({
				url: 'Helpers/request.php',
				onComplete: this.onComplete
			}).send({data: {
				'__response': '<node>response</node><no></no>'
			}});
		});
		
		waitsFor(800, function(){
			return this.onComplete.wasCalled;
		});
		
		runs(function(){
			expect(this.onComplete).toHaveBeenCalledWith('<node>response</node><no></no>', null);
		});
		
	});

});
