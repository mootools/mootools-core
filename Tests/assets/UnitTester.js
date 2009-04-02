setCNETAssetBaseHref('assets/');
/*
Script: UnitTester.js

License:
	MIT-style license.
*/

$E = document.getElement.bind(document);

/* redefine Request so it always execs scripts and uses method: get */

var Request = new Class({

	Extends: Request,
	
	options: {
		method: 'get',
		includeScripts: true
	},

/* redefine processScripts so that it doesn't attempt to read headers; this enables the tester to
	 run locally w/o a web server for browsers that allow it */

	processScripts: function(text){
		return text;
		if (this.options.evalResponse) return $exec(text);
		return text.stripScripts(this.options.evalScripts);
	}

});


/*
Script: UnitTester.js
	Automatically builds unit tests based on an external js script, loading the html, js, and any depedencies.

License:
	MIT-style license.
*/


var UnitTester = new Class({
	Implements: [Events, Options],
	options: {
		autoplay: true
	},
	testScripts: {
		//include as many sources as you like
		//provide the directory that contians tests.json
		demos: 'DemoTests/'
	},
	tests: {},
	sources: {
		//list any locations that contain a MooTools organized
		//code repository (eg: Source/scripts.json)
		DemoScripts: 'DemoScripts/'
	},
	data: {},
	initialize: function(sources, testScripts, options){
		this.setOptions(options);
		this.sources = sources || this.sources;
		this.testScripts = testScripts || this.testScripts;
		this.waiter = new Waiter($('script'), {
			msg: 'Loading dependencies'
		});
		//when sources are loaded, inject the tree of tests into the nav
		this.addEvent('onReady', function(target, sources){
			if (sources == this.sources) this.mapTree();
			else this.setupLoaderSelection();
		}.bind(this));
		//load each test and source
		$each(this.sources, function(v, k){
			this.loadSource(k, '/Source/scripts.json', this.data, this.sources);
		}, this);
		$each(this.testScripts, function(v, k){
			this.loadSource(k, '/tests.json', this.tests, this.testScripts);
		}, this);
		//set up the textarea that lets you run your own code
		this.setupManual();
	},
	//fetch the test iframe
	getFrame: function(){
		if (Browser.Engine.webkit) return frames["testFrame"];
		return $('testFrame').contentWindow;
	},
	//load a scripts.json set
	loadSource: function(source, suffix, target, sources){
		this.request(sources[source]+suffix, function(result){
			this.loadJson(source, result, target, sources);
		}.bind(this));
	},
	//handle scripts.json decoding
	loadJson: function(source, result, target, sources){
		if (result){
			target[source] = JSON.decode(result);
			this.dataLoaded(target, sources);
		}
	},
	//manage loaded data; fire onReady when all sources are loaded
	dataLoaded: function(target, sources){
		var loaded = true;
		$each(sources, function(v, k){
			if (!target[k]) loaded = false;
		}, this);
		if (loaded) this.fireEvent('onReady', [target, sources]);
	},
	//map dependencies
	deps: {},
	pathMap: {},
	//create a map of source to paths
	mapTree: function(){
		$each(this.data, function(data, source){
			$each(data, function(scripts, folder){
				$each(scripts, function(details, script){
					this.deps[source+':'+folder+':'+script] = details.deps;
					this.pathMap[script] = source+':'+folder+':'+script;
				}, this);
			}, this);
		}, this);
	},
	//get the dependencies for a given script
	getDepsForScript: function(script){
		return this.deps[this.pathMap[script]];
	},
	//calculate the dependencies for a given script
	calculateDependencies: function(script){
		var reqs = [];
		if (script == "None") return reqs;
		var deps = this.getDepsForScript(script);
		if (!deps){
			dbug.log('dependencies not mapped: script: %o, map: %o, :deps: %o', script, this.pathMap, this.deps);
		} else {
			deps.each(function(scr){
				if (scr == script || scr == "None") return;
				if (!reqs.contains(scr)) reqs.combine(this.calculateDependencies(scr));
				reqs.include(scr);
			}, this);
			return reqs;
		}
	},
	//get the path for a script
	getPath: function(script){
		try {
			var chunks = this.pathMap[script].split(':');
			var dir = this.sources[chunks[0]] + '/Source/';
			chunks.erase(chunks[0]);
			return dir + chunks.join('/') + '.js';
		} catch(e){
			return script;
		}
	},
	//dbug is loaded already by default - technically, it maps to the dbug in the parent window
	loadedScripts: ['dbug'],
	//load the missing dependencies for a given script
	loadDependencies: function(script, target, win){
		var scripts = this.calculateDependencies(script).include(script);
		scripts = scripts.filter(function(s){return !this.loadedScripts.contains(s)}, this);
		this.loadedScripts.combine(scripts);
		if (scripts.length){
			scripts.filter(function(scr){
				return scr != "None"
			}).each(function(scr){
				this.loadScr(scr, target, win);
			}.bind(this));
		} else {
			this.fireEvent('scriptsLoaded');
		}
	},
	//keep track of how many scripts we're loading at a given time so the user
	//this just stacks up scripts so that they have a buffer of 100ms between loading
	//I found that injecting them into the iframe without it caused issues in
	//some browsers
	loaders: [],
	clearLoaders: function(){
		this.loaders.empty();
	},
	//loads a script; if there is a script loading, pushes it onto the stack
	loadScr: function(scr, target, win){
		var run = this.loaders.length == 0;
		this.waiter.start();
		win = win||this.getFrame();
		target = target||win.document.getElementsByTagName('head')[0];
		var finish = function(){
			if (this.loaders[0]){
				try {
					this.loaders[0].apply(this);
				} catch(e){}
			}	else {
				this.waiter.stop();
				this.fireEvent('scriptsLoaded');
			}
		};
		this.loaders.push(function(){
			if (scr.contains('dbug.js')){
				finish.delay(100, this);
			} else	if (Browser.Engine.trident){
				win.$LoadScript(this.getPath(scr));
				finish.delay(100, this);
			} else {
				try {
					var s = new Element('script', {
						src: this.getPath(scr)+"?noCache="+new Date().getTime(),
						'type': 'text/javascript',
						events: {
							load: finish.bind(this)
						}
					}).inject(target);
				} catch(e){
				}
			}
			this.loaders.erase(this.loaders[0]);
		});
		if (run) this.loaders[0].delay(100, this);
	},
	//creates the left nav of all the tests
	setupLoaderSelection: function(){
		var sel = $('testLoaderSel').empty();
		$('testLoaderSel').setStyle('opacity', 0);
		var dts = [];
		var dds = [];
		$each(this.tests, function(tests, section){
			new Element('h3', {html: section}).inject(sel);
			$each(tests, function(dir, dirName){
				new Element('h4', {html: dirName}).inject(sel);
				$each(dir, function(tests, script){
					var dt = new Element('dt', {html: script}).inject(sel);
					dts.push(dt);
					var container = new Element('div', {'class':'testList'}).inject(dt, 'after');
					dds.push(container);
					if (tests.length == 1){
						var dd = new Element('dd').inject(container).hide();
						dd.store('testindex', 0);
						dd.store('testPath', section+'/'+dirName+'/'+script+'/'+tests[0]);
						dt.addEvent('click', function(){
							this.loadTest(section+'/'+dirName+'/'+script+'/'+tests[0]);
							selectTest(dd);
						}.bind(this));
						dt.store('testPath', section+'/'+dirName+'/'+script+'/'+tests[0]);
					} else {
						tests.each(function(test, i){
							var dd = new Element('dd', {
								html: '&raquo; '+test
							}).inject(container);
							dd.store('testindex', i);
							dd.store('testPath', section+'/'+dirName+'/'+script+'/'+tests);
							dd.addEvent('click', function(){
								this.loadTest(section+'/'+dirName+'/'+script+'/'+test);
								selectTest(dd);
							}.bind(this));
						}, this);
					}
				}, this);
			}, this);
		}, this);
		var selectTest  = function(container){
			dds.each(function(div){
				div.getElements('dd').each(function(dd){
					if (container != dd) dd.removeClass('selected');
					else dd.addClass('selected');
				});
				div.getElements('dt').removeClass('selected');
			});
			var dt = $E('dd.selected').getParent().getPrevious('dt');
			if (dt) dt.addClass('selected');
		};
		new Accordion(dts, dds, {
			duration: 250
		});
		$('testLoaderSel').tween('opacity', 1);
	},
	//gets the test json for a given path
	getTestFilePath: function(testPath){
		var chunks = testPath.split('/');
		var base = chunks[0];
		var dir = chunks[1];
		chunks.splice(chunks.indexOf(base), 1);
		if (chunks.contains(dir) >= 0) chunks.splice(chunks.indexOf(dir), 1);
		var script = chunks[0];
		var file = chunks.join('.');
		var name = base+': '+dir+' &raquo; '+file;
		var filePath = this.testScripts[base]+dir+'/'+file;
		return {
			filePath: filePath,
			script: script,
			name: name,
			dir: dir,
			file: file,
			base: base
		};
	},
	//loads a test given a path
	loadTest: function(testPath){
		console.log('load: ', testPath);
		this.clearLoaders();
		this.getFrame().location.href = this.getFrame().location.href.split("#")[0];
		$('testFrame').removeEvents('load');
		$('testFrame').addEvent('load', function(){
			testPath = testPath || $('testLoaderSel').get('value');
			if (!testPath) return;
			var test = this.getTestFilePath(testPath);
			this.removeEvents('scriptsLoaded').addEvent('scriptsLoaded', function(){
				var dr = function(){
					this.removeEvents('scriptsLoaded');
					this.exec(this.currentTest['scripts']);
					dbug.log('test scripts loaded');
					this.loadScr('assets/fireDomReady.js');
					if (this.options.autoplay) this.runTest.delay(100, this, 0);
				}.bind(this);
				this.removeEvents('scriptsLoaded').addEvent('scriptsLoaded', dr);
				if (this.testObjs.otherScripts){
					var head = this.getFrame().document.getElementsByTagName('head')[0];
					this.testObjs.otherScripts.each(function(s){
						this.loadDependencies(s, head, this.getFrame())
					}, this);
				} else {
					dr();
				}
			});
			this.request(test.filePath+'.html', function(result){
				this.loadTestHtml(test.name, result, test.script);
				this.request(test.filePath+'.js', function(result){
					this.loadTestJs(result);
				}.bind(this));
			}.bind(this));
		}.bind(this));
	},
	//the current test
	currentTest: {},
	//load the html into the iframe
	loadTestHtml: function(name, html, script){
		if ($defined(name)){
			this.currentTest['name'] = name;
			this.currentTest['html'] = html;
		}
		var head = this.getFrame().document.getElementsByTagName('head')[0];
		this.loadedScripts.empty();
		this.loadDependencies(script, head, this.getFrame())
		
		var body = this.getFrame().document.body;
		body.innerHTML = '<h1>'+this.currentTest['name']+'</h1>';
		var scripts = '';
		var styles = '';
		var links = '';
		var text = this.currentTest['html'].replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(){
			scripts += arguments[1] + '\n';
			return '';
		});
		if (!Browser.Engine.trident){
			text = this.currentTest['html'].replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, function(){
				styles += arguments[1] + '\n';
				return '';
			});
		}
		this.currentTest['scripts'] = scripts;
		this.currentTest['html'] = text;
		if (!this.currentTest['html'])	{
			body.innerHTML += "No HTML for this test.";
		} else {
			body.innerHTML += this.currentTest['html'];
		}
		if (styles){
				var style = new Element('style');
				style.inject(head);
				$(style).set('text', styles);
		}
	},
	//sets up the manual code entry textarea
	setupManual: function(){
		var code = $E('#testFrameContainer textarea');
		code.makeResizable({
			handle: $E('#testFrameContainer div.handle'),
			modifiers: {x: null}
		});
		code.addEvent('keydown', function(e){
			if ((e.control||e.meta) && e.key == "enter"){
				e.stop();
				this.exec(code.get('value'));
			}
		}.bind(this));
		$E('#testFrameContainer button').addEvent('click', function(){
			this.exec(code.get('value'));
		}.bind(this));
	},
	//loads the json for a given test into the test menu 
	//js = the test.js contents
	loadTestJs: function(js){
		this.currentTest['js'] = js;
		if (this.currentTest['js']){
			$('tests').empty();
			this.waiter.start();
			this.testObjs = JSON.decode(this.currentTest['js']);
			this.testElements = [];
			this.testResults = [];
			var tmpl = $('testTemplate').get('html');
			this.testObjs.tests.each(function(test, i){
				var html = tmpl.substitute(test);
				var testEl = new Element('div').addClass('testBlock').set('html', html).inject($('tests'));
				this.testElements[i] = testEl;
				var btn = testEl.getElement('button');
				var code = testEl.getElement('textarea');
				var ver = testEl.getElement('div.verify');
				var handle = testEl.getElement('div.handle');
				var header = testEl.getElement('dt b');
				header.addEvent('click', function(){
					testEl.getElement('dd').get('reveal').toggle();
				});
				var interactive = code.get('value') != "";
				if (!interactive){
					code.dispose();
					handle.dispose();
				} else {
					code.makeResizable({
						handle: handle,
						modifiers: {x: null}
					});
				}
				if (!test.verify){
					ver.dispose();
				} else {
					ver.getElement('a.pass').addEvent('click', this.pass.bind(this, i))
					ver.getElement('a.fail').addEvent('click', this.fail.bind(this, i))
				}
				btn.addEvent('click', function(){
					this.runTest(i);
				}.bind(this));
			}, this);
		}
	},
	//execs a chunk of code in the frame; 
	//if wrapFunc is true, it'll wrap the string like (val)()
	exec: function(val, wrapFunc){
		if (!val) return;
		this.getFrame().dbug = dbug;
		if (val){
			if (wrapFunc) val = '('+val+')()';
			return this.getFrame().$exec(val);
		}
	},
	//starts a test
	runTest: function(testIndex){
		$E('iframe').contentWindow.dbug = dbug;
		$E('iframe').contentWindow.dbug.enable(true)
		var container = this.testElements[testIndex];
		var code = container.getElement('textarea');
		var ver = container.getElement('div.verify');
		var test = this.testObjs.tests[testIndex];
		dbug.log('---- %s :: %s ----', this.currentTest.name.replace('&raquo;', '::'), test.title);
		try {
			if (test.before) this.exec(test.before.toString(), true);
			if (code) this.exec(code.get('value'));
			if (test.post){
				if (!this.exec(test.post.toString(), true)){
					alert('The conditions for this test have failed.');
					this.fail(testIndex);
				}
			}
		} catch (e){
			dbug.log('test failed: ', e);
			this.fail(testIndex);
			return;
		}
		container.addClass('selected');
		if (ver){
			ver.reveal();
		} else {
			this.pass(testIndex);
		}
	},
	//executed when a test passes
	//i = index of the successful test
	pass: function(i){
		this.testElements[i].addClass('passed').removeClass('failed').removeClass('selected');
		this.testResults[i] = true;
		this.testElements[i].getElement('dd').dissolve();
		this.evaluateAll();
		if (this.options.autoplay) this.loadNextTest(i);
	},
	//executed when a test failes
	//i = index of the failed test
	fail: function(i){
		this.testElements[i].removeClass('passed').addClass('failed').removeClass('selected');
		this.testResults[i] = false;
		this.evaluateAll();
		if (this.options.autoplay) this.loadNextTest(i);
	},
	loadNextTest: function(current){
		var div, dt;
		if (this.testElements[current+1]){
			//load the next test in the currently loaded set
			this.runTest(current+1);
		} else {
			
			var dd = $E('dd.selected');
			var next = dd.getNext('dd');
			if (!next){
				dt = dd.getParent().getNext('dt');
				if (dt && dt.retrieve('testPath')){
					next = dt;
				}	else if (dt){
					div = dt.getNext();
					if (div && div.get('tag') == 'div'){
						next = div.getElement('dd');
					}
				}
			}
			if (next){
				new StickyWin({
					content: StickyWin.ui("Move to next test?", "Would you like to move to the next set of tests?", {
						buttons: [
							{text: 'Cancel'},
							{
								text: 'Next Tests >>',
								onClick: function(){
									if (div) dt.fireEvent('click');
									next.fireEvent('click');								
								}
							}
						]
					})
				});
			}
			
		}
	},
	//evaluates if all the tests have passed (used to highlight that section in the left nav)
	evaluateAll: function(){
		var passed = true;
		this.testElements.each(function(el, i){
			if (passed === false) return;
			if (passed != null && $defined(this.testResults[i]) && !this.testResults[i]) passed = false;
			else if (!$defined(this.testResults[i])) passed = null;
		}, this);
		if (passed === true){
			$E('dd.selected').addClass('success');
		} else if (passed === false){
			$E('dd.selected').addClass('exception');
		} else if (passed === null){
			$E('dd.selected').removeClass('exception').removeClass('success');
		}
		if (passed === true){
			var dt = $E('dd.selected').getParent().getPrevious();
			if (dt.get('tag') != 'dt') return;
			$E('dd.selected').getParent().getElements('dd').each(function(dd){
				if (!dd.hasClass('success') && !dd.hasClass('exception')){
					passed = null;
				} else if (dd.hasClass('exception')){
					passed = false;
				}
			});
			if (passed === false){
				dt.addClass('exception');
			} else if (passed === true){
				dt.addClass('success');
			}
		}
	},
	//runs a test
	//adds no-cache values to prevent caching
	//also tests for whether or not the page is served from a webserver
	//url - the url to get
	//callback - executed on success/complete, passed the reponse text
	request: function(url, callback){
		url = url+(url.test(/\?/)?"&":"?")+"nocache="+new Date().getTime()
		var req = new Request({
			url: url,
			onComplete: function(result){
				if (result){
					callback(result);
				}
			}.bind(this)
		}).send();
		if (!window.location.href.test('http')){
			(function(){
				callback(req.xhr.responseText);
			}).delay(100);
		}
	}
});
UnitTester.site = 'Clientside';
UnitTester.title = 'Unit Test Framework';
