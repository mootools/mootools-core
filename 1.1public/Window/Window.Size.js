/*
Script: Element.Dimensions.js
	Specs for Element.Dimensions.js

License:
	MIT-style license.
*/

(function(){

	describe('Window.getSize', {
		
		'Window.getSize should return values': function(){
			value_of(Window.getSize().scroll.x).should_not_be_undefined();
			value_of(Window.getSize().scroll.y).should_not_be_undefined();
			value_of(Window.getSize().scrollSize.x).should_not_be_undefined();
			value_of(Window.getSize().scrollSize.y).should_not_be_undefined();
			value_of(Window.getSize().size.x).should_not_be_undefined();
			value_of(Window.getSize().size.y).should_not_be_undefined();
		}
		
	});
	
	describe('Window.getPosition', {
		
		'should return x:0/y:0': function(){
			value_of(Window.getPosition()).should_be({x: 0, y: 0});
		}
		
	});

	describe('Window scroll values', {
		
		'should get the scroll values of the window': function(){
			value_of(Window.getScrollTop()).should_not_be_undefined();
			value_of(Window.getScrollLeft()).should_not_be_undefined();
			value_of(Window.getScrollHeight()).should_not_be_undefined();
			value_of(Window.getScrollWidth()).should_not_be_undefined();
		}
		
	});

	describe('Window height/width values', {
		
		'should get the height/width values of the window': function(){
			value_of(Window.getWidth()).should_not_be_undefined();
			value_of(Window.getHeight()).should_not_be_undefined();
		}
		
	});


})();
