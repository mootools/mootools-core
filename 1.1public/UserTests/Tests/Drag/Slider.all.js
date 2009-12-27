{
	tests: [
		{
			title: "Slider (100 steps, no snap)",
			description: "Allows you to drag a 'knob' to change a value.",
			verify: "When you drag the black box horizontally does the number below change to reflect the position?",
			before: function(){
				var mySlide = new Slider($('area'), $('knob'), {
					onChange: function(pos){
						$('upd').set('html', pos);
					}
				}).set(0);
			}
		},
		{
			title: "Slider (10 steps, snap on)",
			description: "Allows you to drag a 'knob' to change a value.",
			verify: "When you drag the black box horizontally does the number below change to reflect the position?",
			before: function(){
				var mySlide = new Slider($('area2'), $('knob2'), {
					steps: 10,
					snap: true,
					onChange: function(pos){
						$('upd2').set('html', pos);
					}
				}).set(0);
			}
		}
	]
}