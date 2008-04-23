window.addEvent('domready', function() {
	// You can skip the following two lines of code. We need them to make sure demos
	// are runnable on MooTools demos web page.
	if (!window.demo_path) window.demo_path = '';
	var demo_path = window.demo_path;
	// --
	
	var images_path = demo_path + 'images/';
	var gallery = $('gallery');
	
	var addImages = function(images) {
		images.each(function(image) {
			var el = new Element('div', {'class': 'preview'});
			var name = new Element('h3', {'html': image.name}).inject(el);
			var desc = new Element('span', {'html': image.description}).inject(name, 'after');
			var img = new Element('img', {'src': images_path + image.src}).inject(desc, 'after');
			var footer = new Element('span').inject(img, 'after');
			
			if (image.views > 50 && image.views < 250) footer.set({'html': 'popular', 'class': 'popular'});
			else if (image.views > 250) footer.set({'html': 'SUPERpopular', 'class': 'SUPERpopular'});
			else footer.set({'html': 'normal', 'class': 'normal'});
			
			el.inject(gallery);
		});
	};

	$('loadJson').addEvent('click', function(e) {
		e.stop();
		var request = new Request.JSON({
			url: demo_path + 'data.json',
			onComplete: function(jsonObj) {
				addImages(jsonObj.previews);
			}
		}).send();
	});

	$('clearJson').addEvent('click', function(e) {
		e.stop();
		gallery.empty();
	});

});