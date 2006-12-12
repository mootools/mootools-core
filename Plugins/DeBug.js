//part of mootools.js - by Valerio Proietti (http://mad4milk.net). MIT-style license.
//Debug.js : nice crossbrowser javascript debugger - depends on ??

var $debug = {
	
	submit: function(evt){
		var error = false;
		evt = evt || window.event;
		if (evt.keyCode == 13) {
			if (!this.value) return;
			$debug.currentCommand = $debug.commands.length;
			try {
				$debug.write(eval(this.value));
			} catch (err){
				error = true;
				$debug.write(err);
			} finally {
				if (!error) { 
					$debug.commands.push(this.value);
					this.value = '';
				}
			}
		} else if (evt.keyCode == 38) {
			$debug.commandUp();
		} else if 	(evt.keyCode == 40) {
			$debug.commandDown();
		}
	},
	
	commands: [],
	
	commandUp: function(){
		if ($debug.commands[$debug.currentCommand]){
			$debug.swapColors();
			$debug.inputs.value = $debug.commands[$debug.currentCommand];
			$debug.currentCommand = $debug.currentCommand-1;
		}
	},
	
	commandDown: function(){
		if ($debug.commands[$debug.currentCommand+1]){
			$debug.swapColors();
			$debug.inputs.value = $debug.commands[$debug.currentCommand+1];
			$debug.currentCommand = $debug.currentCommand+1;
		}
	},
	
	swapColors: function(){
		if ($debug.currentColor == '#ddd') {
			$debug.console.setStyle('background-color', '#ccc');
			$debug.currentColor = '#ccc';
		} else {
			$debug.console.setStyle('background-color', '#ddd');
			$debug.currentColor = '#ddd';
		}
	},

	create: function(){
		
		$debug.currentColor = '#ddd';
		
		new Element('style').setProperties({
			'type': 'text/css',
			'media': 'screen'
		}).injectInside(document.getElementsByTagName('head')[0]).appendText($debug.css);
		
		$debug.main = new Element('div').injectInside(document.body).addClass('moobug').setStyles({
			'top': 100+Window.getScrollTop()+'px',
			'left': Window.getWidth()/2-150+'px'
		});
		
		$debug.dragger = new Element('div').injectInside($debug.main).addClass('moobug_drag');
		
		$debug.closer = new Element('div').injectInside($debug.dragger).addClass('moobug_close');
		
		$debug.expander = new Element('div').injectInside($debug.dragger).addClass('moobug_expand');

		$debug.dragger.appendText('moobugger');
		
		var mainLeft = $debug.main.effect('left', {duration: 300, transition: Fx.backOut, wait: false});
		var mainTop = $debug.main.effect('top', {duration: 300, transition: Fx.backOut, wait: false});
		
		if (window.ActiveXObject) var position = 'absolute';
		else var position = 'fixed';
		
		$debug.main.setStyle('position', position);
		
		$debug.dragfx = new Drag.Move($debug.main, {
			handle: $debug.dragger,
			onComplete: function(){
				if (this.element.getTop() < 10) mainTop.custom(this.element.getTop(), 10);
				if (this.element.getLeft() < 10) mainLeft.custom(this.element.getLeft(), 10);
			}
		});
		
		$debug.mainOpacity = $debug.main.effect('opacity', {duration: 200, wait: false}).set(0);
		
		$debug.bugsContainer = new Element('div').injectInside($debug.main).addClass('moobug_bugscontainer');
		
		$debug.bugs = new Element('div').injectInside($debug.bugsContainer).addClass('moobug_bugs');
		$debug.bugsHeight = $debug.bugs.effect('height', {duration: 1000, transition: Fx.quadIn});
		$debug.effects = new Fx.Styles($debug.main, {duration: 1000, transition: Fx.quadIn});
		
		var setBugsScrollTop = function(evt){
			var delta = 0;
			if (evt.wheelDelta) {
				delta = evt.wheelDelta/120;
				if (window.opera) delta = -delta;
			} else if (evt.detail) {
				delta = -evt.detail/3;
			}
			
			$debug.bugs.scrollTop -= delta*2;
		};
		
		if ($debug.bugs.addEventListener) $debug.bugs.addEventListener('DOMMouseScroll', setBugsScrollTop.bindAsEventListener($debug.bugs), false);
		else $debug.bugs.onmousewheel = setBugsScrollTop.bindAsEventListener($debug.bugs);
		
		$debug.scroller = new Fx.Scroll($debug.bugs, {duration: 200, wait: false});
		
		$debug.console = new Element('div').addClass('moobug_console').injectInside($debug.main);
		$debug.inputs = new Element('input').setProperties({
			'type': 'text', 
			'autocomplete': 'off'
		}).addClass('moobug_input').injectInside($debug.console);
		
		$debug.inputs.onkeydown = $debug.submit;
		
		if (Cookie.get('moobug_commands')) {
			$debug.commands = Cookie.get('moobug_commands').split(':::::');
		}
		
		$debug.currentCommand = $debug.commands.length-1;
		
		$debug.resizer = new Element('div').addClass('moobug_resize').injectInside($debug.main);
		
		$debug.mainOpacity.goTo(1);
		
		if (!window.ActiveXObject){
			$debug.closer = $debug.closer.replaceWith(new Element('img').setProperty('src', 'data:image/png;base64,\
				iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAABGdBTUEAANbY1E9YMgAAABl0RVh0\
				U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABhSURBVHjadE/BEcAgCEM3gL10WLoXK1Dz\
				wFJqveOMSS5EYuaxxnG7O8VkvgHQc6aZXSIyFtYgO4Rk0mqA3hB9EF7JSCKAkrgNse4vKVYTin86\
				1HevxGG15t/tDsU4bwEGAL1IOEpjYO9qAAAAAElFTkSuQmCC').addClass('moobug_close').setStyle('background', 'none'));
				
			$debug.expander = $debug.expander.replaceWith(new Element('img').setProperty('src', 'data:image/png;base64,\
				iVBORw0KGgoAAAANSUhEUgAAAAsAAAAJCAYAAADkZNYtAAAABGdBTUEAANbY1E9YMgAAABl0RVh0\
				U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABjSURBVHjalJABCsAgCEXNG+i98rDtXl7B\
				6TDYCqR9kCzf70dgZjCLiLqXZW+xf88RUszcfRnw1cjzR1iAm6FF1AqqanPAFpNgceOWELAcwoIe\
				eR0YJDjMN1YGyTnAn3++BRgAo4lMLEPm7s4AAAAASUVORK5CYII=').addClass('moobug_expand').setStyle('background', 'none'));
		} else {
			$debug.main.setStyle('font-size', '12px');
			$debug.bugs.setStyle('font-size', '11px');
			$debug.inputs.setStyle('font-size', '11px');
		}
		
		$debug.expanded = false;
		
		$debug.closer.onclick = function(){
			$debug.destroy();
		};
		
		$debug.expander.onclick = function(){
			
			if (!$debug.expanded){
				$debug.expanded = true;
				$debug.dragfx.pause();
				$debug.dragger.setStyle('cursor', 'default');
				
				$debug.bugsHeight.custom($debug.bugs.offsetHeight, 100).chain(function(){
					$debug.scroller.custom($debug.bugs.scrollTop, $debug.bugs.scrollHeight+1);
					$debug.main.setStyle('width', '100%');
				});
				$debug.effects.custom({
					'top': [$debug.main.getTop(), Window.getHeight()-165],
					'left': [$debug.main.getLeft(), 0],
					'width': [$debug.main.offsetWidth, Window.getWidth()]
				});
			} else {
				$debug.expanded = false;
				$debug.dragfx.resume();
				$debug.dragger.setStyle('cursor', 'move');
				
				var h = $debug.bugs.scrollHeight;
				var j;
				
				if (h > 300) j = 300;
				else j = h;
				
				$debug.bugsHeight.custom(100, j);
				
				$debug.effects.custom({
					'top': [Window.getHeight()-165, 100],
					'left': [0, Window.getWidth()/2-150],
					'width': [Window.getWidth(), 300]
				}).chain(function(){
					$debug.bugs.scrollTop = $debug.bugs.scrollHeight;
					$debug.bugs.setStyle('height', 'auto');
					$debug.checkHeight();
				});
			}
		};
		
		window.addEvent('unload', function(){
			Cookie.set('moobug_commands', $debug.commands.join(':::::'));
		});
	},
	
	checkHeight: function(){
		if ($debug.bugs.scrollHeight > 300) {
			$debug.bugs.setStyle('height', '300px');
		} else {
			$debug.bugs.setStyle('height', 'auto');
		}
	},
	
	destroy: function(){
		$debug.main.onmouseover = null;
		$debug.main.onmouseout = null;
		$debug.mainOpacity.goTo(0).chain(function(){
			$debug.main.remove();
			$debug.main = null;
		});
	},
	
	test: function(fn, args, bind){
		if (!$debug.main) $debug.create();
		var error = false;
		try {
			fn.apply(bind || fn, args);
		} catch (catched){
			$debug.write(catched);
			error = true;
		} finally {
			if (!error) $debug.write('function ok');
		}
	},
	
	write: function(message){
		if (!$debug.main) $debug.create();
		if (!$debug.expanded) $debug.checkHeight();
		var container = new Element('div').injectInside($debug.bugs).setStyles({
			'height': '0',
			'overflow': 'hidden'
		});
		var line = new Element('p').addClass('moobug_line').injectInside(container);
		var deleter = new Element('div').addClass('moobug_del').injectInside(line);
		
		if (!window.ActiveXObject) {
			deleter = deleter.replaceWith(new Element('img').setProperty('src', 'data:image/png;base64,\
			iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAABGdBTUEAANbY1E9YMgAAABl0RVh0\
			U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABfSURBVHjajI7RDYAwCEQPVtI12mFxDXfC\
			Qmut4IckhOvl9QC6obRWn6qYvfhkAk9VnHpgp9K03KZBL8PB8CaLjj9jMru0FT0hASY69J0kw/93\
			EycgrxZejHlDAOslwAAzHzpAOYR3jQAAAABJRU5ErkJggg==').addClass('moobug_del').setStyle('background', 'none'));
		}
		
		line.appendText(message);
		
		var containerEffects = container.effects({duration: 300, wait: false});
		
		containerEffects.custom({'opacity': [0,1], 'height': [0, container.scrollHeight]});
		
		$debug.scroller.custom($debug.bugs.scrollTop, $debug.bugs.scrollHeight+1);
		
		deleter.onclick = function(){
			deleter.onclick = null;
			containerEffects.custom({'opacity': [1,0], 'height': [container.scrollHeight, 0]}).chain(function(){
				container.remove();
				$debug.scroller.custom($debug.bugs.scrollTop, $debug.bugs.scrollHeight+1);
			});
		};
	},
	
	parseFunction: function(fn){
		var txt = fn.toString().match(/^function[\s]*\((.*)\)[\s]*$/);
	},
	
	css: '\
	.moobug {\
		width: 300px;\
		background: #111;\
		font: 10px "Monaco", "Andale Mono", "Courier New";\
		color: #fff;\
	}\
	.moobug_close {\
		margin: 3px 4px 0 2px;\
		float: left;\
		height: 9px;\
		width: 9px;\
		background: #111;\
		cursor: pointer;\
	}\
	.moobug_expand {\
		margin: 3px 10px 0 2px;\
		float: left;\
		height: 9px;\
		width: 11px;\
		background: #111;\
		cursor: pointer;\
	}\
	.moobug_del {\
		margin: 1px 10px 2px 2px;\
		float: left;\
		height: 9px;\
		width: 9px;\
		background: #ff3300;\
		cursor: pointer;\
	}\
	.moobug_line {\
		clear: both;\
		padding: 3px 0;\
		border-bottom: 1px solid #333;\
		margin: 0;\
	}\
	.moobug_bugs {\
		overflow: hidden;\
		font-size: 9px;\
	}\
	.moobug_bugscontainer {\
		padding: 5px 5px 10px;\
	}\
	.moobug_console {\
		background: #fff;\
		padding: 1px;\
		background: #ddd;\
		overflow: hidden;\
	}\
	.moobug_input {\
		padding: 1px 2px;\
		color: #111;\
		font-size: 9px;\
		width: 99%;\
		border: 0;\
		font: 10px "Monaco", "Andale Mono", "Courier New";\
		background: none;\
	}\
	.moobug_drag {\
		cursor: move;\
		text-align: right;\
		background: #ff3300;\
		color: #000;\
		padding: 5px;\
	}\
	.moobug_resize {\
		background: #ff3300;\
		height: 10px;\
	}'

};