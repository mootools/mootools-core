/*
Script: postEditor.js
	Using postEditor you can tabulate without losing your focus and maintain the tabsize in line brakes. 
	You can also use snippets like in TextMate.

Dependencies:
	<http://mootools.net>

Author:
	Daniel Mota aka IceBeat, <http://icebeat.bitacoras.com>

Contributors:
	Sergio Álvarez aka Xergio, <http://xergio.net>
	Jordi Rivero aka Godsea, <http://godsea.dsland.org>

License:
	MIT-style license.
*/

/*
Class: PostEditor
	The base class of the postEditor.
	
Arguments:
	el - required. the textarea $(element) to apply postEditor.
	next - optional. the $(element) to apply the next tab (shift+enter).
	options - optional. The options object. 
	
Options:
	snippets - optional, Snippets like in TextMate.
	smartTypingPairs - optional, smartTypingPairs.
	selections - optional, functions to execute with selections.
*/

var PostEditor = new Class({
	
	tab: "\t",
	
	setOptions: function(options){
		this.options = $merge({
			snippets : {},
			smartTypingPairs : {},
			selections : {}
		}, options || {});
	},
	
	initialize: function(el, options){
		if (Browser.Engine.trident) return;
		this.element = $(el);
		this.setOptions(options);
		this.styles = {
			line_height: this.element.getStyle('line-height').toInt() || 14,
			font_size: this.element.getStyle('font-size').toInt() || 11,
			height: this.element.getStyle('height').toInt()
		};
		this.autoTab = null;
		this.ssKey = 0;
		this.seKey = 0;
		this.completion = null;
		this.tabl = this.tab.length;
		this.element.onkeypress = this.onKeyPress.bind(this);
	},

	changeSnippets: function(snippets){
		this.options.snippets = snippets || {};
	},

	changeSmartTypingPairs: function(smartTypingPairs){
		this.options.smartTypingPairs = smartTypingPairs || {};
	},

	changeSelections: function(selections){
		this.options.selections = selections || {};
	},

	ss: function(){
		return this.element.selectionStart;
	},

	se: function(){
		return this.element.selectionEnd;
	},

	slice: function(start, end){
		return this.element.value.slice(start, end);
	},

	value: function(value){
		this.element.value = value.join("");
	},
	
	getStart: function(rest){
		rest = rest ? rest.length : 0;
		return this.slice(0, this.ss() - rest);
	},
	
	getEnd: function(rest){
		rest = rest ? rest.length : 0;
		return this.element.value.slice(this.se()-rest);
	},
	
	selectRange: function(start,end){
		this.element.selectionStart = start;
		this.element.selectionEnd = start+end;
	},
	
	focus: function(focus, type){
		if (type){
			this.scrollTop	= this.element.scrollTop;
			this.scrollLeft = this.element.scrollLeft;
		} else {
			this.element.scrollTop	= this.scrollTop;
			this.element.scrollLeft = this.scrollLeft;
		}
		if (focus) this.element.focus();
	},
	
	updateScroll: function(){
		var lines = this.getStart().split("\n").length;
		var height = (lines - Math.round(this.element.scrollTop/this.styles.line_height)) * this.styles.line_height;
		height += this.styles.line_height;
		if (height >= this.styles.height) this.element.scrollTop += this.styles.line_height;
		this.focus(true, 1);
	},
	
	onKeyPress: function(e){
		if (this.filterByPairs(e)) return;
		this.filterBySelect(e);
		if (this.filterByTab(e)) return;
		if ([13,9,8,46].contains(e.keyCode)) this.focus(false, true);
		switch(e.keyCode){
			case 27:
				this.completion = null;
				this.autoTab = null; break;
			case 39: this.onKeyRight(e); break;
			case 13: this.onEnter(e); break;
			case 9: this.onTab(e); break;
			case 8: this.onBackspace(e); break;
			case 46: this.onDelete(e); break;
		}
		if ([13,9,8,46].contains(e.keyCode)) this.focus(true, false);
	},
	
	filterByPairs: function(e){
		var charCode = String.fromCharCode(e.charCode);
		var stpair = this.options.smartTypingPairs[charCode];
		if (stpair){
			if ($type(stpair) == 'string') stpair = {pair : stpair};
			if (!stpair.scope || this.scope(stpair.scope)){
				var ss = this.ss(), se = this.se(), start = this.getStart();
				if (ss == se){
					this.value([start,stpair.pair,this.getEnd()]);
					this.selectRange(start.length,0);
				} else {
					e.preventDefault();
					this.ssKey = ss;
					this.seKey = se;
					this.value([start,charCode,this.slice(ss,se),stpair.pair,this.getEnd()]);
					this.selectRange(ss+1,se-ss);
				}
			}
			stpair = null;
			return true;
		}
		return false;
	},
	
	filterBySelect: function(e){
		var charCode = String.fromCharCode(e.charCode);
		if (e.ctrlKey && e.shiftKey){
			if ([0,1,2,3,4,5,6,7,8,9].contains(charCode)){
				var fn = this.options.selections[charCode];
				if (fn){
					var ss = this.ss(), se = this.se(), 
							sel = fn.apply(this, [this.slice(ss,se)]);
					if (sel){
						var start = this.getStart();
						if ($type(sel) == 'array'){
							this.value([start,sel.join(""),this.getEnd()]);
							this.selectRange(start.length+sel[0].length,sel[1].length);
						} else {
							if (sel.selection){
								if (sel.snippet){
									start = this.slice(0,sel.selection[0]);
									var end = this.slice(sel.selection[1],this.element.value.length);
									this.value([start,sel.snippet.join(""),end]);
									this.selectRange(start.length+sel.snippet[0].length,sel.snippet[1].length);
								} else {
									this.selectRange(sel.selection[0],sel.selection[1]);
								}
							} else {
								this.value([start,sel.snippet.join(""),this.getEnd()]);
								this.selectRange(start.length+sel.snippet[0].length,sel.snippet[1].length);
							}
						}
					}
				}
			}
		}
	},
	
	filterByTab: function(e){
		if (this.autoTab){
			var ss = this.ss();
			var se = this.se()
			var  key = this.ssKey;
			var end = this.seKey;
			if (![key + 1,key,key - 1, end].contains(ss)){
				this.completion = null;
				this.autoTab = null;
			}
			if (this.autoTab && [38, 39].contains(e.keyCode) && ss == se){
				this.completion = null;
				this.autoTab = null;
			}
			this.ssKey = ss;
			this.seKey = se;
		} else {
			this.ssKey = 0;
			this.seKey = 0;
		}
		return false;
	},
	
	scope: function(scopes){
		var ss = this.ss();
		var text = this.getStart();
		for (var key in scopes){
			if (!key) return true;
			var open = text.lastIndexOf(key);
			if (open > -1){
				var close = this.slice(open + key.length, ss).lastIndexOf(scopes[key]);
				if (close == -1) return true;
			}
		}
		return false;
	},

	onKeyRight: function(e){
		var ss = this.ss();
		var se = this.se();
		var start = this.getStart();
		if (ss != se){
			e.preventDefault();
			this.selectRange(se, 0);
		}
	},
	
	onEnter: function(e){
		this.updateScroll();
		var ss = this.ss();
		var se = this.se();
		var start = this.getStart();
		if (ss == se){
			var line = start.split("\n").pop(),
				tab = line.match(/^\s+/gi);
			if (tab){
				e.preventDefault();
				tab = tab.join("");
				this.value([start,"\n",tab,this.getEnd()]);
				this.selectRange(ss + 1 + tab.length,0);
			}
		}
	},
	
	onBackspace: function(e){
		var ss = this.ss();
		var se = this.se();
		if (ss == se && this.slice(ss - this.tabl, ss) == this.tab){
			e.preventDefault();
			var start = this.getStart(this.tab), end = this.slice(ss, this.element.value.length);
			if (start.match(/\n$/g) && end.match(/^\n/g)){
				this.value([start, this.slice(ss - 1, this.element.value.length)]);
			} else {
				this.value([start, end]);
			}
			this.selectRange(ss - this.tabl, 0);
		} else if (ss == se){
			var charCode = this.slice(ss - 1, ss), 
				close = this.slice(ss,ss+1), 
				stpair = this.options.smartTypingPairs[charCode];
			if ($type(stpair) == 'string') stpair = {pair : stpair};
			if (stpair && stpair.pair == close){
				this.value([this.getStart(stpair.pair), this.slice(ss, this.element.value.length)]);
				this.selectRange(ss,0);
			}
		}
	},
	
	onDelete: function(e){
		var ss = this.ss(), se = this.se();
		if (ss == se && this.slice(ss,ss+this.tabl) == this.tab){
			e.preventDefault();
			this.value([this.getStart(),this.slice(ss+this.tabl,this.element.value.length)]);
			this.selectRange(ss,0);
		}
	},
	
	onTab: function(e){
		e.preventDefault();
		var ss = this.ss(), se = this.se(), sel = this.slice(ss,se), text = this.getStart();
		if (this.filterCompletion(e, ss, se)) return;
		if (this.filterAutoTab(e, ss, se)) return;
		
		if (ss != se && sel.indexOf("\n") != -1){
			var newsel = sel.replace(/\n/g,"\n" + this.tab);
			this.value([text,this.tab,newsel,this.getEnd()]);
			this.selectRange(ss + this.tabl,se + (this.tabl * sel.split("\n").length) - ss - this.tabl);
		} else {
			var snippetObj = null;
			for (var key in this.options.snippets){
				var value = this.options.snippets[key];
				if ($type(value) == 'function') continue;
				if (text.length-key.length==-1) continue;
				if (text.length-key.length==text.lastIndexOf(key)){
					if ($type(value) == 'array') value = { snippet:value };
					snippetObj = Object.extend({},value);
					break;
				}
			}
			if (snippetObj && (!snippetObj.scope || this.scope(snippetObj.scope))){
			
				if (snippetObj.command){
					var command = snippetObj.command.apply(this, [key]);
					if ($type(command) == 'array') snippetObj.snippet = command;
					else snippetObj = command;
				}
			
				var snippet = snippetObj.snippet.copy(), tab = text.split("\n").pop().match(/^\s+/gi);
				var start = this.getStart(snippetObj.key || key);
			
				if (tab){
					tab = tab.join("");
					snippet[0] = snippet[0].replace(/\n/g,"\n"+tab);
					snippet[1] = snippet[1].replace(/\n/g,"\n"+tab);
					snippet[2] = snippet[2].replace(/\n/g,"\n"+tab);
				}
			
				this.value([start, snippet[0], snippet[1], snippet[2], this.getEnd()]);
			
				if (snippetObj.tab){
				
					this.autoTab = {
						tab: snippetObj.tab.copy(),
						snippet: snippet.copy(),
						start: snippetObj.start
					};
				
					var item = this.autoTab.tab.shift();
					this.autoTab.ss = snippet[1].indexOf(item);
				
					if (this.autoTab.ss > -1){
						this.autoTab.ssLast = start.length + snippet[0].length + this.autoTab.ss;
						this.ssKey = this.autoTab.ssLast;
						this.seKey = this.ssKey + item.length;
						this.completion = null;
						if (snippetObj.completion){
							this.autoTab.completion = snippetObj.completion;
							this.autoTab.item = item;
							this.autoTab.loop = true;
							if (typeof snippetObj.loop == 'boolean') this.autoTab.loop = snippetObj.loop;
							var completion = this.autoTab.completion[item];
							if (completion){
								var i = [item].extend(completion);
								var a = completion.copy().extend(['']);
								this.autoTab.index = item;
								this.completion = a.associate(i);
							}
						}
						this.selectRange(start.length + snippet[0].length + this.autoTab.ss, item.length);
					
					} else {
						this.autoTab = null;
						this.selectRange(start.length + snippet[0].length, snippet[1].length);
					}
				} else {
					this.selectRange(start.length + snippet[0].length,snippet[1].length);
				}
				snippet = null;
			} else {
				this.value([text,this.tab,this.slice(ss, this.element.value.length)]);
				if (ss == se) this.selectRange(ss + this.tabl,0);
				else this.selectRange(ss + this.tabl,se - ss);
			}
		}
	},
	
	filterAutoTab: function(e,ss,se){
		if (this.autoTab){
			var length = this.autoTab.tab.length;
			if (length){
				if (this.autoTab.ssLast <= ss){
					var item = this.autoTab.tab.shift();
					var next = this.slice(ss, ss + this.autoTab.snippet[1].length - this.autoTab.ss).indexOf(item);
					if (length == 1 && !item){
						var end = this.autoTab.snippet[2].length;
						if ($type(this.autoTab.start) == 'number') end = this.autoTab.start;
						else if (this.autoTab.start) end = 0;
						this.selectRange(se + this.getEnd().indexOf(this.autoTab.snippet[2])+end,0);
						this.completion = null;
						return true;
					} else if (next > -1){
						this.autoTab.ss = next;
						this.autoTab.ssLast = next + ss;
						this.ssKey = this.autoTab.ssLast;
						this.seKey = this.ssKey + item.length;
						this.autoTab.item = item;
						if (this.completion){
							var completion = this.autoTab.completion[item];
							if (completion){
								var i = [item].extend(completion);
								var a = completion.copy().extend(['']);
								this.autoTab.index = item;
								this.completion = a.associate(i);
							} else {
								this.completion = null;
							}
						}
						this.selectRange(ss + next,item.length);
						return true;
					} else {
						this.onTab(e);
						return true;
					}
				}
			}
			this.autoTab = null;
		}
		return false;
	},
	
	filterCompletion: function(e,ss,se){
		if (this.completion && ss == this.ssKey && se == this.seKey && this.autoTab.item.length == se - ss){
			var item = this.completion[this.autoTab.item];
			if (item){
				this.seKey = this.ssKey + item.length;
				this.autoTab.item = item;
				this.value([this.getStart(),item,this.getEnd()]);
				this.selectRange(ss, item.length);
				return true;
			} else if (this.autoTab.loop){
				item = this.autoTab.index;
				this.autoTab.item = item;
				this.seKey = this.ssKey + item.length;
				this.value([this.getStart(), item,this.getEnd()]);
				this.selectRange(ss, item.length);
				return true;
			}
		}
		this.completion = null;
		return false;
	}
});