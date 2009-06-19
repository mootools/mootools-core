{
	tests: [{
		title: "Element.iframe",
		description: "Tests the loading of IFrames.",
		verify: "Did the text \"Loaded!\" show up?",
		before: function(){
			var result = $('result');
			new IFrame('existingFrame', { onload: function(){ 
				result.set('text', 'First frame loaded.');
				(new IFrame({ src: 'test_frame.html?' + $time, onload: function(){
					result.set('text', 'Loaded!');
				}})).inject('frames');
			}});
		}
	}]
}