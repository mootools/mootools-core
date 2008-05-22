window.addEvent('domready', function(){
	// We autogenerate a list on the fly
	var li = [];
	
	for (i = 1; i <= 5; i++)
		li.push(new Element('li', {
			text: 'Item #'+i
		}));
	
	var ul = new Element('ul', {
		'class': 'myList'
	}).inject('sortablesDemo').adopt(li);
	
	// First Example
	new Sortables(ul);
	
	
	// Second Example
	
	// We just clone the list we created before
	var uls = $$([ul.clone(), ul.clone()])
	
	uls[1].getElements('li').setStyle('font-weight', 'bold');
	
	uls.inject('anotherSortablesDemo').addClass('anotherList');
	
	new Sortables(uls, {
		revert: true
	});
});