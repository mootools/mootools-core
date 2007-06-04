/*
Script: Debugger.js
	Creates Firebug <http://www.getfirebug.com> style debugger for browsers without Firebug.

License:
	MIT-style license.
*/

var debug = {
	timers: {},
	pre: function(content, color, bgcolor){
		if (debug.disabled) return;
		if (!debug._body) debug.create();
		var pre = new Element('pre').setStyles({
			'padding': '3px 5px',
			'margin': '0',
			'font': '11px Andale Mono, Monaco, Courier New',
			'border-bottom': '1px solid #eee',
			'color': color || '#222',
			'background-color': bgcolor || '#fff'
		});
		if ($type(content) == "string") pre.appendText(content);
		else pre.adopt(content);
		pre.injectInside(debug._contents);

		debug._scroll.toBottom();
	},

	error: function(error){
		debug.pre(error.name + ': ' + error.message, '#c92f2f', '#fffef0');
	},

	register: function(text){
		debug.messages.remove(text);
		debug.messages.push(text);
		debug.idx = debug.messages.length;
		var toCookie = debug.messages.join('-:-:-').replace(/;/g, '%%%');
		Cookie.set('mootools-debugger-history', toCookie, {duration: 10});
	},

	result: function(args, spacer){
		spacer = $type(spacer) ? spacer : ' ';
		var chunks = [];
		$each(args, function(argument){
			var type = $type(argument);
			if (type){
				if ((type != 'string') && (type != 'element')){
					try {
						argument = Json.toString(argument);
					} catch(e){
						argument = 'object not compatible with Json parser';
					}
				}
				chunks.push({'type': type, 'message': argument});
			}
		});
			var holder = new Element('div');
			if (!chunks.length) return;
		chunks.each(function(chunk){
			var color = '#222';
			switch(chunk.type){
				case 'object': color = '#612fc9'; break;
				case 'string': color = '#85b23e'; break;
				case 'element':
					color = '#3e72b2';
					chunk.message = this.makeElementMsg(chunk.message);
					break;
				case 'boolean': color = '#ff3300'; break;
				case 'array': color = '#953eb2'; break;
			}
			switch(chunk.type){
				case 'element':
					chunk.message.setStyle('color', color).injectInside(holder);
					holder.appendText(spacer);
					break;
				case 'string':
					new Element('span').appendText(chunk.message + spacer).setStyle('color', color).injectInside(holder);
					break;
				default:
					new Element('span').setHTML(chunk.message + spacer).setStyle('color', color).injectInside(holder);
			}
		}, this);
		debug.pre(holder);
	},

	makeElementMsg: function(el){
		var a = new Element('a').addEvent('click', function(e){
			new Fx.Style(el, 'opacity').start(0,1);
			e.stop();
		}.bindWithEvent()).setStyles({'cursor': 'pointer', 'text-decoration': 'none'}).setProperty('href', 'javascript:void(0)');
		var htm = ['&lt;' + el.tagName.toLowerCase()];
		['id', 'className', 'name', 'href', 'title', 'rel', 'type'].each(function(attr){
			if (el[attr]) htm.push(attr + '="' + el[attr] + '"');
		});
		a.innerHTML = htm.join(' ') + '&gt;';
		return a;
	},

	/*
	Property: log
		sends a message to the debugger.
		Arguments:
		messages - any number of strings, objects, etc. to print out
		Note:
		The debugger will allow firebug style log messages:
			%s	- String
		%d, %i	- Integer (numeric formatting is not yet supported)
		%f	- Floating point number (numeric formatting is not yet supported)
		%o	- Object hyperlink
		Example:
			>console.log("the value of x is %s and this paragraph is %o", x, $('id'));
		> the value of x is <some value> and this paragraph is <p>
	*/

	log: function(){
		var args = $A(arguments);
		var spacer = ' ';
		if ($type(args[0]) == 'string'){
			spacer = '';
			var logCollection = [], lastIndex = 0;
			var regexp = /%[sdifo]/gi;
			for (var i = 1; (i < args.length) && (token = regexp.exec(args[0])); i++){
				logCollection.push(args[0].substring(lastIndex, token.index), args[i]);
				lastIndex = regexp.lastIndex;
			}
			regexp.lastIndex = 0;
			if (!lastIndex) return debug.result(args);
			logCollection.push(args[0].substring(lastIndex));
			args = logCollection;
		}
		return debug.result(args, spacer);
	},

	/*
	Property: assert
		Tests that an expression is true. If not, logs a message and throws an error.

	Arguments:
		condition - a boolean expression. If false, message will be logged and an error will be thrown.
		messages - optional, any number of strings, objects, etc. to print out when thruth is false.

	Example:
		>console.assert((value > 0) && (value <= max), "value (%i) was not properly initialized", value);
	*/

	assert: function(condition){
		if (!condition){
			var args = $A(arguments, 1);
			debug.log.apply(debug, args.length ? args : ["Assertion Failure"]);
			throw new Error("Assertion Failure");
		}
	},

	/*
	Property: time
		Starts a timer.
	Argument:
		name - the name of the timer
	*/

	time: function(name){
		debug.timers[name] = new Date().getTime();
	},

	/*
	Property: timeEnd
		Ends a timer and logs that value to the console.
		Argument:
		name - the name of the timer
	*/

	timeEnd: function(name){
		if (debug.timers[name]) debug.log('%s: %s', name, new Date().getTime() - debug.timers[name]);
		else debug.log('no such timer: %s', name);
	},

	/*
	Property: create
		Displays the console area.
	*/
	create: function(){
			//main element
		debug._body = new Element('div').setStyles({
			'position': window.ie6 ? 'absolute' : 'fixed',
			'background': '#fff',
			'font': '11px Andale Mono, Monaco, Courier New',
			'z-index': '996'
		}).injectInside(document.body);

		//links
		debug._actions = new Element('div').setStyles({
			'text-align': 'right',
			'background-color': '#f5f5f5',
			'border-bottom': '1px solid #ddd',
			'border-top': '1px solid #ddd',
			'padding': '2px 10px',
			'margin': '0px',
			'font-size': '10px'
		}).injectInside(debug._body);
		new Element('span').setHTML('CLEAR').injectInside(debug._actions).addEvent('click', function(){
			debug._contents.setHTML('');
		}).setStyle('cursor', 'pointer');
		new Element('span').setHTML('&nbsp;|&nbsp;').injectInside(debug._actions);
		debug._minLink = new Element('span').setHTML('MIN').injectInside(debug._actions).addEvent('click', function(){
			debug.minmax();
		}).setStyle('cursor', 'pointer');
		debug._maxLink = new Element('span').setHTML('MAX').injectInside(debug._actions).addEvent('click', function(){
			debug.minmax(true);
		}).setStyle('cursor', 'pointer');

		var debuggerStatus = Cookie.get('mootools-debugger-status');
		((debuggerStatus && (debuggerStatus.toInt() < 50)) ? debug._minLink : debug._maxLink).setStyle('display', 'none');

		new Element('span').setHTML('&nbsp;|&nbsp;').injectInside(debug._actions);
		new Element('span').setHTML('CLOSE').injectInside(debug._actions).addEvent('click', function(){
			window.removeEvent('resize', debug.resize);
			debug._body.remove();
			debug._body = false;
		}).setStyle('cursor', 'pointer');

		//messages container
		debug._contents = new Element('div').setStyles({
			'position': 'relative',
			'z-index': '9997',
			'height': debuggerStatus || '112px',
			'border-bottom': '1px solid #ddd',
			'overflow': 'auto',
			'background': '#fff'
		}).injectInside(debug._body);
		if (window.ie6) debug._contents.setStyle('width', '100%');

		//input box
		debug._input = new Element('input').setProperty('type', 'text').setStyles({
			'z-index': '9996',
			'width': '98%',
			'background': '#fff',
			'color': '#222',
			'font': '12px Andale Mono, Monaco, Courier New',
			'height': '16px',
			'border': '0',
			'padding': '2px 2px 2px 31px',
			'position': 'relative',
			'margin-top': '-1px'
		}).injectInside(debug._body);

		//>>>
		debug._gts = new Element('div').setHTML("&gt;&gt;&gt;").setStyles({
			'color': '#3e72b2',
			'padding': '2px 5px',
			'background': '#fff',
			'z-index': '9999',
			'position': 'absolute',
			'left': '0'
		}).injectInside(debug._body);

		if (window.webkit){
			debug._input.setStyles({
				'margin-top': '-2px',
				'margin-left': '29px',
				'font-size': '12px',
				'opacity': '0.99'
			});
		};

		debug._scroll = new Fx.Scroll(debug._contents, {duration: 300, wait: false});
		debug.resetHeight();
		window.addEvent('resize', debug.resize);
		if (window.ie6) window.addEvent('scroll', debug.resetHeight);

		debug._input.onkeydown = debug.parseKey.bindWithEvent(debug);
	},

	resetHeight: function(){
		debug._hgt = debug._body.offsetHeight;
		if (!window.webkit) debug._hgt -= 3;
		else debug._hgt -= 1;
		debug._gts.setStyle('top', (debug._hgt - debug._gts.offsetHeight - 1));
		debug.resize();
		debug._scroll.toBottom();
	},

	resize: function(){
		if (window.ie6){
			debug._body.setStyles({
				'top': (window.getScrollTop() + window.getHeight() - debug._hgt - 5),
				'width': (window.getWidth() - 16)
			});
		} else {
			debug._body.setStyles({
				'top': (window.getHeight() - debug._hgt + 1),
				'width': (window.getWidth())
			});
		}

	},

	minmax: function(maximize){
		debug._maxLink.setStyle('display', maximize ? 'none' : '');
		debug._minLink.setStyle('display', maximize ? '' : 'none');
		var size = maximize ? '112px' : '18px';
		debug._contents.style.height = size;
		Cookie.set('mootools-debugger-status', size);
		debug.resetHeight();
	},

	parseKey: function(e){
		var value = debug._input.value;

		switch(e.key){
			case 'enter':
				if (!value) return;
				debug._input.value = '';
				switch(value){
					case 'exit': debug._body.remove(); debug._body = false; return;
					case 'clear':
					case 'clr': debug._contents.setHTML(''); return;
					case 'max': this.minmax(true); return;
					case 'min': this.minmax(); return;
				}

				debug.pre('>>> ' + value, '#3e72b2');

				try {
					var evaluation = eval(value);
					if (evaluation !== undefined) debug.result([evaluation]);
				} catch (err){
					debug.error(err);
				}
				debug.register(value);
				break;

			case 'up':
				e.stop();
				var i = debug.idx - 1;
				if (debug.messages[i]){
					debug._input.value = debug.messages[i];
					debug.idx = i;
				}
				break;

			case 'down':
				e.stop();
				var i = debug.idx + 1;
				if (debug.messages[i]){
					debug._input.value = debug.messages[i];
					debug.idx = i;
				} else {
					debug._input.value = '';
					debug.idx = debug.messages.length;
				}
		}
	}

};

debug.messages = Cookie.get('mootools-debugger-history');
debug.messages = debug.messages ? debug.messages.replace(/%%%/g, ';').split('-:-:-') : [];
debug.idx = debug.messages.length;

if ((typeof console == 'undefined') || !console.warn){
	var console = debug;
	window.onerror = function(msg, url, line){
		console.error({
			'message': msg + '\n >>>>> ' + url + ' (' + line + ')',
			'name': 'Run Time Error'
		});
	};
	if (typeof Ajax != 'undefined'){
		Ajax = Ajax.extend({

			onStateChange: function(){
				this.parent();
				this.log();
			},

			log: function(){
				if (this.transport.readyState == 4){
					try {
						if (debug._body){
							var txt = this.transport.responseText;
							if ($chk(txt)){
								if (txt.length > 100) txt = txt.substring(0, 100) + " ...";
							} else {
								txt = 'undefined';
							}
							debug.log("%s: %s"+"\n"+"status: %s"+"\n"+"responseText: %s", this.options.method, this.url, this.transport.status, txt);
						}
					} catch(e){}
				}
			}
		});
	}
}


