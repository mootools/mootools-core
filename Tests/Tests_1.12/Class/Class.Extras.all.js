{
	tests: [
		{
			title: "Chain",
			description: "Tests chain for 1.11.",
			verify: "Do you see a list of 5 log messages?",
			before: function(){
				var chain = new Chain();
				var i = 1;
				$('foo').empty();
				var stamp = function(){
					new Element('li').appendText('chain count: ' + i).inject($('foo'));
					i++;
					chain.callChain();
				};
				chain.chain(stamp);
				chain.chain(stamp);
				chain.chain(stamp);
				chain.chain(stamp);
				chain.chain(stamp);
				chain.callChain();
			}
		}
	],
	otherScripts: ['Element']
}