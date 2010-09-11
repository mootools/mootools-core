describe('IFrame', function(){

	it('should call onload', function(){
		runs(function(){
			this.onComplete = jasmine.createSpy();

			this.iframe = new IFrame({
				src: 'http://' + document.location.host,
				onload: this.onComplete
			}).inject(document.body);
		});

		waitsFor(500, function(){
			(function(){
				this.iframe.destroy();
			}).delay(500, this);

			return this.onComplete.wasCalled;
		});

	})

});