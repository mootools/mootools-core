{
	tests: [
		{
			title: "Fx.Slide:slideOut",
			description: "Slides a box out of view",
			verify: "Did the box slide out of view?",
			before: function(){
				if (!window.fx_slide_test) window.fx_slide_test = new Fx.Slide('sliderButton', {duration: 500});
				window.fx_slide_test.show().slideOut();
			}
		},
		{
			title: "Fx.Slide:slideIn",
			description: "Slides a box into view",
			verify: "Did the box slide into view?",
			before: function(){
				if (!window.fx_slide_test) window.fx_slide_test = new Fx.Slide('sliderButton', {duration: 500});
				window.fx_slide_test.hide().slideIn();
			}
		},
		{
			title: "Fx.Slide:toggle",
			description: "Slides a box in and out of view",
			verify: "Did the box slide out of view?",
			before: function(){
				if (!window.fx_slide_test) window.fx_slide_test = new Fx.Slide('sliderButton', {duration: 500});
				var toggler = function(){
					window.fx_slide_test.toggle.delay(250, window.fx_slide_test);
				};
				window.fx_slide_test.hide().toggle().chain(toggler).chain(toggler).chain(toggler).chain(toggler);
			}
		}
	]
}