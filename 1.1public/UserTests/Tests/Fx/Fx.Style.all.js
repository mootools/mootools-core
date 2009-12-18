{
	tests: [
		{
			title: "Fx.Style",
			description: "Animates a single element style.",
			verify: "Did the element change width smoothly?",
			before: function(){
				var fx = new Fx.Style('example', 'width', {
					duration: 500
				});
				fx.start(50, 0);
				reset();
			}
		},
		{
			title: "Element.effect",
			description: "Uses the Element.effect shortcut to animate the element.",
			verify: "Did the element change width smoothly?",
			before: function(){
				$('example').effect('width', { duration: 500 }).start(50, 0);
				reset();
			}
		},
		{
			title: "Fx.Style:hide",
			description: "Calls the hide method to hide the element without a transition.",
			verify: "Did the element hide immediately?",
			before: function(){
				var fx = new Fx.Style('example', 'opacity');
				fx.hide();
				reset();
			}
		},
		{
			title: "Fx.Style:set",
			description: "Calls the set method to set the element property immediately.",
			verify: "Did the element hide immediately?",
			before: function(){
				var fx = new Fx.Style('example', 'opacity');
				fx.set(0);
				reset();
			}
		},
		{
			title: "Chained effects",
			description: "Uses the Element.effect shortcut to animate the element. Runs several animations chained together",
			verify: "Did the element change width 3 times (50 to 0, 0 to 100, 100 to 50) smoothly?",
			before: function(){
				var fx = $('example').effect('width', { duration: 500 });
				fx.start(50, 0).chain(function(){
					fx.start(0, 100);
				}).chain(function(){
					fx.start(100, 50);
				});
				reset();
			}
		},
		{
			title: "Fx.Transitions test",
			description: "Shows an effect with numerous transitions.",
			verify: "Did the element change position smoothly with a different transition each time?",
			before: function(){
				var fx = $('example').effect('top', {
					duration: 1200,
					transition: Fx.Transitions.Elastic.easeOut
				})
				fx.start(100, 200).chain(function(){
					fx.setOptions({
						transition: Fx.Transitions.Expo.easeInOut
					}).start(200, 100);
				}).chain(function(){
					fx.setOptions({
						transition: Fx.Transitions.Bounce.easeOut
					}).start(100, 200);
				}).chain(function(){
					fx.setOptions({
						transition: Fx.Transitions.Back.easeOut
					}).start(200, 100);
				});
			}
		}
	],
	otherScripts: ['Fx.Transitions']
}