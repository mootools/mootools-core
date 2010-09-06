/*
Script: Request.HTML.js
	Public Specs for Request.HTML.js 1.3

License:
	MIT-style license.
*/

describe('Request.HTML', function(){

	beforeEach(function(){
		this.spy = jasmine.createSpy();
	});

	it('should create an ajax request and detect the correct type of the response (html)', function(){

		runs(function(){
			this.request = new Request.HTML({
				url: '../Helpers/request.php',
				onComplete: this.spy
			}).send({data: {
				'__response': '<body><div><span></span></div></body>', '__type': 'html'
			}});
		});

		waitsFor(800, function(){
			return this.spy.wasCalled;
		});

		runs(function(){
			var response = this.request.response;
			// checks arguments order
			expect(this.spy).toHaveBeenCalledWith(response.tree, response.elements, response.html, response.javascript);
			var onCompleteArgs = this.spy.argsForCall[0];
			expect(onCompleteArgs[0][0].nodeName).toEqual('DIV');
			expect(onCompleteArgs[1][1].nodeName).toEqual('SPAN');
			expect(onCompleteArgs[2]).toEqual('<div><span></span></div>');
			expect(onCompleteArgs[3]).toBeFalsy();
		});

	});
	
	xit('should create an ajax request and correctly generate the tree response from a tr', function(){

		runs(function(){
			this.request = new Request.HTML({
				url: '../Helpers/request.php',
				onComplete: this.spy
			}).send({data: {
				'__response': '<tr><td>text</td></tr>', '__type': 'html'
			}});
		});

		waitsFor(800, function(){
			return this.spy.wasCalled;
		});

		runs(function(){
			var onCompleteArgs = this.spy.argsForCall[0];
			
			expect(onCompleteArgs[0][0].nodeName).toEqual('TR');
			expect(onCompleteArgs[1][1].nodeName).toEqual('TD');
			expect(onCompleteArgs[2]).toEqual('<tr><td>text</td></tr>');
		});

	});
	
	xit('should create an ajax request and correctly generate the tree response from options', function(){

		runs(function(){
			this.request = new Request.HTML({
				url: '../Helpers/request.php',
				onComplete: this.spy
			}).send({data: {
				'__response': '<option>1</option><option>2</option><option>3</option>', '__type': 'html'
			}});
		});

		waitsFor(800, function(){
			return this.spy.wasCalled;
		});

		runs(function(){
			var onCompleteArgs = this.spy.argsForCall[0];
			
			expect(onCompleteArgs[0].length).toEqual(3);
			expect(onCompleteArgs[1].length).toEqual(3);
			expect(onCompleteArgs[2]).toEqual('<option>1</option><option>2</option><option>3</option>');
			expect(onCompleteArgs[3]).toBeFalsy();
			
			var firstOption = onCompleteArgs[0][0];
			expect(firstOption.tagName).toEqual('OPTION');
			expect(firstOption.innerHTML).toEqual('1');
		});

	});
	
	
});
