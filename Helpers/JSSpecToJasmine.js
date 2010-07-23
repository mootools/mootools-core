value_of = expect;

(function(prototype){

prototype.should_be = prototype.toEqual;
prototype.should_not_be = prototype.toNotEqual;

prototype.should_be_true = prototype.toBeTruthy;
prototype.should_be_false = prototype.toBeFalsy;
prototype.should_be_null = prototype.toBeNull;
prototype.should_match = prototype.toMatch;
prototype.should_be_empty = function(){
	return !this.actual || (this.actual.length == 0);
};

})(jasmine.Matchers.prototype);

describe = (function(original){
	var each = 'before each',
		all = 'before all',
		after = 'after all';

	return function(name, object){
		if (object instanceof Function){
			original(name, object);
			return;
		}

		original(name, function(){
			var beforeAll = object[all],
				bfEach = object[each],
				aAll = object[after];

			beforeEach(function(){
				if (beforeAll){
					beforeAll();
					beforeAll = null;
				}

				if (bfEach) bfEach();
			});

			delete object[all];
			delete object[each];
			delete object[after];

			for (var key in object)
				it(key, object[key]);

			if (aAll) it('cleans up', aAll);
		});
	};
})(describe);