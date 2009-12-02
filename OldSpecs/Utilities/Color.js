var myColor;
//colors compared with photoshop values.

describe('Color constructor, hex', {

	'before all': function(){
		myColor = new Color('#a2c240');
	},

	'should have the correct rgb': function(){
		value_of(myColor).should_be([162, 194, 64]);
	},

	'should have the correct hsb': function(){
		value_of(myColor.hsb).should_be([75, 67, 76]);
	},

	'should have the correct hex': function(){
		value_of(myColor.hex).should_be('#a2c240');
	}

});

describe('Color constructor, hsb', {

	'before all': function(){
		myColor = new Color('hsb(75, 67, 76)');
	},

	'should have the correct rgb': function(){
		value_of(myColor).should_be([161, 194, 64]);
	},

	'should have the correct hsb': function(){
		value_of(myColor.hsb).should_be([75, 67, 76]);
	},

	'should have the correct hex': function(){
		value_of(myColor.hex).should_be('#a1c240');
	}

});

describe('Color constructor, rgb', {

	'before all': function(){
		myColor = new Color('rgb(162, 194, 64)');
	},

	'should have the correct rgb': function(){
		value_of(myColor).should_be([162, 194, 64]);
	},

	'should have the correct hsb': function(){
		value_of(myColor.hsb).should_be([75, 67, 76]);
	},

	'should have the correct hex': function(){
		value_of(myColor.hex).should_be('#a2c240');
	}

});