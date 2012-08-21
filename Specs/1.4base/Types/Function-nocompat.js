
describe('Function.bind', function(){

	it('should still be possible to use it as constructor', function(){
		function Alien(type) {
			this.type = type;
		}

		var thisArg = {};
		var Tribble = Alien.bind(thisArg, 'Polygeminus grex');

		// `thisArg` should **not** be used for the `this` binding when called as a constructor
		var fuzzball = new Tribble('Klingon');
		expect(fuzzball.type).toEqual('Polygeminus grex');
	});

	it('when using .call(thisArg) on a bound function, it should ignore the thisArg of .call', function(){
		var fn = function(){
			return [this.foo].concat(Array.slice(arguments));
		};

		expect(fn.bind({foo: 'bar'})()).toEqual(['bar']);
		expect(fn.bind({foo: 'bar'}, 'first').call({foo: 'yeah!'}, 'yooo')).toEqual(['bar', 'first', 'yooo']);

		var bound = fn.bind({foo: 'bar'});
		var bound2 = fn.bind({foo: 'yep'});
		var inst = new bound;
		inst.foo = 'noo!!';
		expect(bound2.call(inst, 'yoo', 'howdy')).toEqual(['yep', 'yoo', 'howdy']);
	});

});
