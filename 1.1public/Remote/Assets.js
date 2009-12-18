/*
Script: Assets.js
	Public Specs for Assets.js 1.1.2

License:
	MIT-style license.
*/
describe('Assets', {

	'Assets.javascript': function(){
		new Asset.javascript('1.1public/Remote/Assets.javascript.test.js', {
			id: 'asset_js'
		});
		value_of(document.head.getElement('#asset_js').getTag()).should_be('script');
	},
	'Assets.css': function(){
		new Asset.css('1.1public/Remote/Assets.css.test.css', {
			id: 'asset_css'
		});
		value_of(document.head.getElement('#asset_css').getTag()).should_be('link');
	},
	'Assets.image': function(){
		var img = new Asset.image('foo.png', {
			id: 'asset_img'
		});
		value_of(img.getProperty('src')).should_be('foo.png');
	},
	'Assets.image': function(){
		var paths = ['foo', 'bar'];
		var imgs = new Asset.images(paths);
		value_of(imgs.map(function(img){return img.getProperty('src');})).should_be(paths);
	}
});
