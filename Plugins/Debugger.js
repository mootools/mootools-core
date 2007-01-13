/*
Script: Debugger.js
	Creates fiebug <http://www.getfirebug.com> style debugging for browsers without firefox & firebug.
		
Authors:
	Valerio Proietti, <http://mad4milk.net> && Aaron Newton (http://clientside.cnet.com)

License:
	MIT-style license.
*/

var debug = {
	
	messages: (Cookie.get('mootools-debugger-history')) ? Cookie.get('mootools-debugger-history').replace(/%%%/g, ';').split('-:-:-') : [],
	
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
		if($type(content) == "string") pre.appendText(content);
		else pre.adopt(content);
		pre.injectInside(debug._contents);

		debug._scroll.toBottom();
	},

	write: function(text){
		debug.pre('>>> ' + text, '#3e72b2');
	},

	error: function(error){
		debug.pre(error.name + ': ' + error.message, '#c92f2f', '#fffef0');
	},

	register: function(text){
		debug.messages.remove(text);
		debug.messages.push(text);
		debug.idx = debug.messages.length;
		var toCookie = debug.messages.join('-:-:-').replace(/;/g, '%%%');
		Cookie.set('mootools-debugger-history', toCookie, 2);
	},

	result: function(args, spacer){
		spacer = $type(spacer)?spacer:' ';
		var chunks = [];
		$A(args).each(function(argument){
				var type = $type(argument);
			if (type){
					if (type == 'string') chunks.push({'type': 'string', 'message': argument});
					else if(type == "element") chunks.push({'type':'element','message':argument});
					else {
						try {
							var jsonString = Json.toString(argument);
							chunks.push({'type': type, 'message': Json.toString(argument)});
						} catch(e) {
							chunks.push({'type': type, 'message': 'object not compatable with Json parser'});
						}
					}
			}
		});
		
		var holder = new Element('div');
		
		if (chunks.length <= 0) return;
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
			if(chunk.type == 'element') {
				chunk.message.setStyle('color', color).injectInside(holder);
				holder.appendText(spacer);
			} else if(chunk.type == 'string')
				new Element('span').appendText(chunk.message+spacer).setStyle('color', color).injectInside(holder);
			else  new Element('span').setHTML(chunk.message+spacer).setStyle('color', color).injectInside(holder);
		}.bind(this));
		debug.pre(holder);
	},
	
	makeElementMsg: function(el){
		var a = new Element('a').addEvent('click', function(e){
			new Fx.Style(el, 'opacity').custom(0,1);
			e = new Event(e).stop();
		}).setStyles({'cursor':'pointer','text-decoration':'none'}).setProperty('href','javascript:void(0)');
		var htm = ['&lt;'+el.tagName.toLowerCase()];
		['id', 'className', 'name', 'href', 'title', 'rel', 'type'].each(function(attr){
			if (el[attr]) htm.push(attr+'="'+el[attr]+'"');
		});
		a.innerHTML = htm.join(' ')+'&gt;';
		return a;
	},

/*	Property: log
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
			var tokens = args[0].match(/(%[.\w\d]+)/g);
			var logCollection = [];
			if (!tokens) return debug.result(args);
			tokens.each(function(token, i){
				logCollection.push(args[0].substring(0, args[0].indexOf(token)));
				logCollection.push(args[i+1]);
				args[0] = args[0].substring(args[0].indexOf(token)+token.length,args[0].length);
			});
			args = logCollection
		}
		return debug.result(args, spacer);
	},
/*	Property: time
		Starts a timer.
		
		Argument:
		name - the name of the timer
	*/
	time: function(name){
		debug.timers[name] = new Date().getTime();
	},
/*	Property: timeEnd
		Ends a timer and logs that value to the console.
		
		Argument:
		name - the name of the timer
	*/
	timeEnd: function(name){
		if (debug.timers[name]) debug.log('%s: %s', name, new Date().getTime() - debug.timers[name]);
		else debug.log('no such timer: %s', name);
	},

/*	Property: create
		Displays the console area.
	*/
	create: function(){
		
		//main element
		debug._body = new Element('div').setStyles({
			'width': '100%',
			'position':'fixed',
			'background':'#fff',
			'font': '11px Andale Mono, Monaco, Courier New',
			'z-index':'996'
		}).injectInside(document.body);

		if (window.ie6) debug._body.setStyles({
			'position':'absolute',
			'width': Window.getWidth()-13+'px'
		})
		
		//links
		debug._actions = new Element('div').setStyles({
			'text-align':'right',
			'background-color':'#f5f5f5',
			'border-bottom':'1px solid #ddd',
			'border-top':'1px solid #ddd',
			'padding': '2px 10px',
			'margin':'0px',
			'font-size': '10px'
		}).injectInside(debug._body);
		new Element('span').setHTML('CLEAR').injectInside(debug._actions).addEvent('click',function(){
				debug._contents.setHTML('');
		}).setStyle('cursor','pointer');
		new Element('span').setHTML('&nbsp;|&nbsp;').injectInside(debug._actions);
		debug._minLink = new Element('span').setHTML('MIN').injectInside(debug._actions).addEvent('click',function(){
			this.setStyle('display', 'none');
			debug._maxLink.setStyle('display','inline');
			debug.minimize();
		}).setStyle('cursor','pointer');
		debug._maxLink = new Element('span').setHTML('MAX').injectInside(debug._actions).addEvent('click',function(){
			this.setStyle('display', 'none');
			debug._minLink.setStyle('display','inline');
			debug.maximize();
		}).setStyle('cursor','pointer');
		if(Cookie.get('mootools-debugger-status') && Cookie.get('mootools-debugger-status').toInt() < 50)
			debug._minLink.setStyle('display','none');
		else debug._maxLink.setStyle('display','none');
			
		new Element('span').setHTML('&nbsp;|&nbsp;').injectInside(debug._actions);
		new Element('span').setHTML('CLOSE').injectInside(debug._actions).addEvent('click',function(){
			debug._body.remove();
			debug._body = false;
		}).setStyle('cursor','pointer');
		
		//messages container
		debug._contents = new Element('div').setStyles({
			'position': 'relative',
			'z-index': '9997',
			'height': (Cookie.get('mootools-debugger-status')) ? Cookie.get('mootools-debugger-status') : '112px',
			'border-bottom': '1px solid #ddd',
			'overflow': 'auto',
			'background': '#fff'
		}).injectInside(debug._body);
		if(window.ie6)debug._contents.setStyle('width','101%');
		//input box
		debug._input = new Element('input').setProperties({
			'type': 'text'
		}).setStyles({
			'z-index': '9996',
			'width': '98%',
			'background': '#fff',
			'color': '#222',
			'font': '12px Andale Mono, Monaco, Courier New',
			'height':'16px',
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
		
		if (window.khtml){
			debug._input.setStyles({
				'margin-top': '-2px',
				'margin-left': '29px',
				'font-size': '12px',
				'opacity': '0.99'
			});
		};
		
		debug._scroll = new Fx.Scroll(debug._contents, {duration: 300, wait: false});
		debug.resetHeight();
		if(window.ie6)window.addEvent('scroll', debug.resetHeight);

		debug._input.onkeydown = debug.parseKey.bindWithEvent(debug);
	},
	
	resetHeight: function(){
		var hgt = debug._body.offsetHeight;
		
		if (window.khtml) hgt = hgt-3;
		var resize = function(){
			if (debug._body) debug._body.setStyles({
					'top': Window.getHeight()-hgt+1+'px',
				'width': Window.getWidth()-13+'px'
				});
			else window.removeEvent('resize', resize);
		};
		window.removeEvent('resize', resize);
		window.addEvent('resize', resize);
		debug._gts.setStyle('top', hgt-debug._gts.offsetHeight-1+'px');
		debug._body.setStyle('top', Window.getHeight()-hgt+1+'px');
		debug._scroll.toBottom();
	},
	minimize: function(){
				debug._contents.setStyle('height', '18px');
				Cookie.set('mootools-debugger-status', '18px');
				debug.resetHeight();
	},
	maximize: function(){
				debug._contents.setStyle('height', '112px');
				Cookie.set('mootools-debugger-status', '112px');
				debug.resetHeight();
	},

	parseKey: function(e){
		
		var value = debug._input.value;
		
		var error = false;
		
		if (e.key == 'enter'){
			if (!value) return false;
			
			if (value == 'exit'){
				debug._body.remove();
				debug._body = false;
				return debug._input.value = '';
			} else if (['clear', 'clr'].test(value)){
				debug._contents.setHTML('');
				return debug._input.value = '';
			} else if (value == 'max'){
				this.maximize();
				return debug._input.value = '';
			} else if (value == 'min'){
				this.minimize();
				return debug._input.value = '';
			}

			debug.write(value);

			try {
				var evaluation = eval(value);
				if (evaluation) debug.result([evaluation]);
			} catch (err){
				error = true;
				debug.error(err);
			} finally {
				if (!error){
					debug.register(value);
					debug._input.value = '';
				}
			}
		} else if (e.key == 'up'){
			e.stop();
			var i = debug.idx-1;
			if (debug.messages[i]){
				debug._input.value = debug.messages[i];
				debug.idx = i;
			}
		} else if (e.key == 'down'){
			e.stop();
			var i = debug.idx+1;
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

debug.idx = debug.messages.length;

if (!console || !console.warn){
	var console = debug;
	window.onerror = function(msg, url, line) {
	  console.error({
		 	'message': msg+"\n >>>>> "+url+" ("+line+")",
			'name': 'Run Time Error'
		});
	};
	Ajax = Ajax.extend({
		onStateChange: function(){
			this.parent();
			this.log();
		},
		log: function(){
			if(this.transport.readyState == 4) {
				try {
					if(debug._body) {
						var txt = this.transport.responseText;
						if($chk(txt) && txt.length > 100) txt = txt.substring(0, 100) + " ...";
						else if(!$chk(txt)) txt = 'undefined';
						var breaker = "\n";
						debug.log('%s: %s'+breaker+'status: %s'+breaker+'responseText: %s', this.options.method, this.url, this.transport.status, txt);
					}
				}catch(e){}
			}
		}
	});
}

