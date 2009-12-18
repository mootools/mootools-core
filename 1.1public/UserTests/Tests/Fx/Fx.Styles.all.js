{
	tests: [
		{
			title: "Fx.Styles",
			description: "Animates a two element styles.",
			verify: "Did the element change width and height smoothly?",
			before: function(){
				var fx = new Fx.Styles('example', {
					duration: 500
				});
				fx.start({
					width: [50, 100],
					height: [50, 100]
				});
				reset();
			}
		},
		{
			title: "Element.effects",
			description: "Uses the Element.effects shortcut to animate the element.",
			verify: "Did the element change width and height smoothly?",
			before: function(){
				$('example').effects({ duration: 500 }).start({
					width: [50, 100],
					height: [50, 100]
				});
				reset();
			}
		},
		{
			title: "Fx.Styles:set",
			description: "Calls the set method to set the element properties immediately.",
			verify: "Did the element change size immediately?",
			before: function(){
				var fx = new Fx.Styles('example');
				fx.set({
					width: 200,
					height: 200
				});
				reset();
			}
		},
		{
			title: "Chained effects",
			description: "Uses the Element.effects shortcut to animate the element. Runs several animations chained together",
			verify: "Did the element change width and height 3 times (50 to 0, 0 to 100, 100 to 50) smoothly?",
			before: function(){
				var fx = $('example').effects({ duration: 500 });
				fx.start({
					width: [50, 100],
					height: [50, 100]
				}).chain(function(){
					fx.start({
						width: [100, 0],
						height: [100, 0]
					});
				}).chain(function(){
					fx.start({
						width: [0, 50],
						height: [0, 50]
					});
				});
				reset();
			}
		},
		{
			title: "Fx.Transitions test",
			description: "Shows an effect with numerous transitions.",
			verify: "Did the element change position smoothly with a different transition each time?",
			before: function(){
				var fx = $('example').effects({
					duration: 1200,
					transition: Fx.Transitions.Elastic.easeOut
				})
				fx.start({
					top: [100, 200],
					left: [100, 200]
				}).chain(function(){
					fx.setOptions({
						transition: Fx.Transitions.Expo.easeInOut
					}).start({
						top: [200, 100],
						left: [200, 100]
					});
				}).chain(function(){
					fx.setOptions({
						transition: Fx.Transitions.Bounce.easeOut
					}).start({
						top: [100, 200],
						left: [100, 200]
					});
				}).chain(function(){
					fx.setOptions({
						transition: Fx.Transitions.Back.easeOut
					}).start({
						top: [200, 100],
						left: [200, 100]
					});
				});
			}
		}
	],
	otherScripts: ['Fx.Transitions']
}