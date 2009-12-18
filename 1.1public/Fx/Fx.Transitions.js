/*
Script: Fx.Transitions.js
	Public Specs for Fx.Transitions.js 1.1.2

License:
	MIT-style license.
*/
describe('Fx.Transitions', {

	'Checks the various Fx.Transitions math methods': function(){
		value_of(Fx.Transitions.linear(2)).should_be(2);
		value_of(Fx.Transitions.Pow(2,2)).should_be(64);
		value_of(Fx.Transitions.Expo(2)).should_be(256);
		value_of(Fx.Transitions.Circ(0.5)).should_be(0.1339745962155614);
		value_of(Fx.Transitions.Sine(3)).should_be(1.0000000000000002);
		value_of(Fx.Transitions.Back(2, 1)).should_be(14.472000000000001);
		value_of(Fx.Transitions.Bounce(0.5)).should_be(0.234375);
		value_of(Fx.Transitions.Elastic(-0.2, 2)).should_be(0.000244140625);
		value_of(Fx.Transitions.Quad(2)).should_be(4);
		value_of(Fx.Transitions.Cubic(2)).should_be(8);
		value_of(Fx.Transitions.Quart(2)).should_be(16);
		value_of(Fx.Transitions.Quint(2)).should_be(32);
	}

});