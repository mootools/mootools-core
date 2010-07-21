var value_of = expect;

jasmine.Matchers.prototype.should_be = jasmine.Matchers.prototype.toEqual;
jasmine.Matchers.prototype.should_not_be = jasmine.Matchers.prototype.toNotEqual;

jasmine.Matchers.prototype.should_be_true = jasmine.Matchers.prototype.toBeTruthy;
jasmine.Matchers.prototype.should_be_false = jasmine.Matchers.prototype.toBeFalsy;
jasmine.Matchers.prototype.should_be_null = jasmine.Matchers.prototype.toBeNull;
jasmine.Matchers.prototype.should_match = jasmine.Matchers.prototype.toMatch;
jasmine.Matchers.prototype.should_be_empty = function(){
	return !this.actual || (this.actual.length == 0);
};

describe = (function(original){
	var each = 'before each',
		all = 'before all',
		after = 'after all';

	return function(name, object){
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