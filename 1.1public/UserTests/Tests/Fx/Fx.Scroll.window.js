{
	tests: [
		{
			title: "Fx.Scroll:toBottom",
			description: "Scrolls the box to the bottom",
			verify: "Did the box scroll to the bottom?",
			before: function(){
				if (!window.window_scroll_test_fx) window.window_scroll_test_fx = new Fx.Scroll($(window), {duration: 500});
				window.window_scroll_test_fx.toBottom();
			}
		},
		{
			title: "Fx.Scroll:toRight",
			description: "Scrolls the box to the right",
			verify: "Did the box scroll to the right?",
			before: function(){
				if (!window.window_scroll_test_fx) window.window_scroll_test_fx = new Fx.Scroll($(window), {duration: 500});
				window.window_scroll_test_fx.toRight();
			}
		},
		{
			title: "Fx.Scroll:toTop",
			description: "Scrolls the box to the top",
			verify: "Did the box scroll to the top?",
			before: function(){
				if (!window.window_scroll_test_fx) window.window_scroll_test_fx = new Fx.Scroll($(window), {duration: 500});
				window.window_scroll_test_fx.toTop();
			}
		},
		{
			title: "Fx.Scroll:toLeft",
			description: "Scrolls the box to the left",
			verify: "Did the box scroll to the left?",
			before: function(){
				if (!window.window_scroll_test_fx) window.window_scroll_test_fx = new Fx.Scroll($(window), {duration: 500});
				window.window_scroll_test_fx.toLeft();
			}
		},
		{
			title: "Fx.Scroll:toElement",
			description: "Scrolls the box to the red item",
			verify: "Did the box scroll to the red item?",
			before: function(){
				if (!window.window_scroll_test_fx) window.window_scroll_test_fx = new Fx.Scroll($(window), {duration: 500});
				window.window_scroll_test_fx.toElement('red');
			}
		}
	]
}