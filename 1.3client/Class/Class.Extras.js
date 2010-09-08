describe('setOptions', function(){

	it('should allow to pass the document', function(){

		var A = new Class({

			Implements: Options,

			initialize: function(options){
				this.setOptions(options);
			}

		});

		expect(new A({document: document}).options.document == document).toBeTruthy();
	});

});