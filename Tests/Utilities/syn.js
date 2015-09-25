/*
 * Syn - 0.1.2
 *
 * Copyright (c) 2015 Bitovi
 * Thu, 6 Mar 2015 01:47:51 GMT
 * Licensed MIT */

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*syn@0.1.1#browsers*/
var syn = require("./synthetic");
require("./mouse");

syn.key.browsers = {
	webkit: {
		'prevent': {
			"keyup": [],
			"keydown": ["char", "keypress"],
			"keypress": ["char"]
		},
		'character': {
			"keydown": [0, "key"],
			"keypress": ["char", "char"],
			"keyup": [0, "key"]
		},
		'specialChars': {
			"keydown": [0, "char"],
			"keyup": [0, "char"]
		},
		'navigation': {
			"keydown": [0, "key"],
			"keyup": [0, "key"]
		},
		'special': {
			"keydown": [0, "key"],
			"keyup": [0, "key"]
		},
		'tab': {
			"keydown": [0, "char"],
			"keyup": [0, "char"]
		},
		'pause-break': {
			"keydown": [0, "key"],
			"keyup": [0, "key"]
		},
		'caps': {
			"keydown": [0, "key"],
			"keyup": [0, "key"]
		},
		'escape': {
			"keydown": [0, "key"],
			"keyup": [0, "key"]
		},
		'num-lock': {
			"keydown": [0, "key"],
			"keyup": [0, "key"]
		},
		'scroll-lock': {
			"keydown": [0, "key"],
			"keyup": [0, "key"]
		},
		'print': {
			"keyup": [0, "key"]
		},
		'function': {
			"keydown": [0, "key"],
			"keyup": [0, "key"]
		},
		'\r': {
			"keydown": [0, "key"],
			"keypress": ["char", "key"],
			"keyup": [0, "key"]
		}
	},
	gecko: {
		'prevent': {
			"keyup": [],
			"keydown": ["char"],
			"keypress": ["char"]
		},
		'character': {
			"keydown": [0, "key"],
			"keypress": ["char", 0],
			"keyup": [0, "key"]
		},
		'specialChars': {
			"keydown": [0, "key"],
			"keypress": [0, "key"],
			"keyup": [0, "key"]
		},
		'navigation': {
			"keydown": [0, "key"],
			"keypress": [0, "key"],
			"keyup": [0, "key"]
		},
		'special': {
			"keydown": [0, "key"],
			"keyup": [0, "key"]
		},
		'\t': {
			"keydown": [0, "key"],
			"keypress": [0, "key"],
			"keyup": [0, "key"]
		},
		'pause-break': {
			"keydown": [0, "key"],
			"keypress": [0, "key"],
			"keyup": [0, "key"]
		},
		'caps': {
			"keydown": [0, "key"],
			"keyup": [0, "key"]
		},
		'escape': {
			"keydown": [0, "key"],
			"keypress": [0, "key"],
			"keyup": [0, "key"]
		},
		'num-lock': {
			"keydown": [0, "key"],
			"keyup": [0, "key"]
		},
		'scroll-lock': {
			"keydown": [0, "key"],
			"keyup": [0, "key"]
		},
		'print': {
			"keyup": [0, "key"]
		},
		'function': {
			"keydown": [0, "key"],
			"keyup": [0, "key"]
		},
		'\r': {
			"keydown": [0, "key"],
			"keypress": [0, "key"],
			"keyup": [0, "key"]
		}
	},
	msie: {
		'prevent': {
			"keyup": [],
			"keydown": ["char", "keypress"],
			"keypress": ["char"]
		},
		'character': {
			"keydown": [null, "key"],
			"keypress": [null, "char"],
			"keyup": [null, "key"]
		},
		'specialChars': {
			"keydown": [null, "char"],
			"keyup": [null, "char"]
		},
		'navigation': {
			"keydown": [null, "key"],
			"keyup": [null, "key"]
		},
		'special': {
			"keydown": [null, "key"],
			"keyup": [null, "key"]
		},
		'tab': {
			"keydown": [null, "char"],
			"keyup": [null, "char"]
		},
		'pause-break': {
			"keydown": [null, "key"],
			"keyup": [null, "key"]
		},
		'caps': {
			"keydown": [null, "key"],
			"keyup": [null, "key"]
		},
		'escape': {
			"keydown": [null, "key"],
			"keypress": [null, "key"],
			"keyup": [null, "key"]
		},
		'num-lock': {
			"keydown": [null, "key"],
			"keyup": [null, "key"]
		},
		'scroll-lock': {
			"keydown": [null, "key"],
			"keyup": [null, "key"]
		},
		'print': {
			"keyup": [null, "key"]
		},
		'function': {
			"keydown": [null, "key"],
			"keyup": [null, "key"]
		},
		'\r': {
			"keydown": [null, "key"],
			"keypress": [null, "key"],
			"keyup": [null, "key"]
		}
	},
	opera: {
		'prevent': {
			"keyup": [],
			"keydown": [],
			"keypress": ["char"]
		},
		'character': {
			"keydown": [null, "key"],
			"keypress": [null, "char"],
			"keyup": [null, "key"]
		},
		'specialChars': {
			"keydown": [null, "char"],
			"keypress": [null, "char"],
			"keyup": [null, "char"]
		},
		'navigation': {
			"keydown": [null, "key"],
			"keypress": [null, "key"]
		},
		'special': {
			"keydown": [null, "key"],
			"keypress": [null, "key"],
			"keyup": [null, "key"]
		},
		'tab': {
			"keydown": [null, "char"],
			"keypress": [null, "char"],
			"keyup": [null, "char"]
		},
		'pause-break': {
			"keydown": [null, "key"],
			"keypress": [null, "key"],
			"keyup": [null, "key"]
		},
		'caps': {
			"keydown": [null, "key"],
			"keyup": [null, "key"]
		},
		'escape': {
			"keydown": [null, "key"],
			"keypress": [null, "key"]
		},
		'num-lock': {
			"keyup": [null, "key"],
			"keydown": [null, "key"],
			"keypress": [null, "key"]
		},
		'scroll-lock': {
			"keydown": [null, "key"],
			"keypress": [null, "key"],
			"keyup": [null, "key"]
		},
		'print': {},
		'function': {
			"keydown": [null, "key"],
			"keypress": [null, "key"],
			"keyup": [null, "key"]
		},
		'\r': {
			"keydown": [null, "key"],
			"keypress": [null, "key"],
			"keyup": [null, "key"]
		}
	}
};

syn.mouse.browsers = {
	webkit: {
		"right": {
			"mousedown": {
				"button": 2,
				"which": 3
			},
			"mouseup": {
				"button": 2,
				"which": 3
			},
			"contextmenu": {
				"button": 2,
				"which": 3
			}
		},
		"left": {
			"mousedown": {
				"button": 0,
				"which": 1
			},
			"mouseup": {
				"button": 0,
				"which": 1
			},
			"click": {
				"button": 0,
				"which": 1
			}
		}
	},
	opera: {
		"right": {
			"mousedown": {
				"button": 2,
				"which": 3
			},
			"mouseup": {
				"button": 2,
				"which": 3
			}
		},
		"left": {
			"mousedown": {
				"button": 0,
				"which": 1
			},
			"mouseup": {
				"button": 0,
				"which": 1
			},
			"click": {
				"button": 0,
				"which": 1
			}
		}
	},
	msie: {
		"right": {
			"mousedown": {
				"button": 2
			},
			"mouseup": {
				"button": 2
			},
			"contextmenu": {
				"button": 0
			}
		},
		"left": {
			"mousedown": {
				"button": 1
			},
			"mouseup": {
				"button": 1
			},
			"click": {
				"button": 0
			}
		}
	},
	chrome: {
		"right": {
			"mousedown": {
				"button": 2,
				"which": 3
			},
			"mouseup": {
				"button": 2,
				"which": 3
			},
			"contextmenu": {
				"button": 2,
				"which": 3
			}
		},
		"left": {
			"mousedown": {
				"button": 0,
				"which": 1
			},
			"mouseup": {
				"button": 0,
				"which": 1
			},
			"click": {
				"button": 0,
				"which": 1
			}
		}
	},
	gecko: {
		"left": {
			"mousedown": {
				"button": 0,
				"which": 1
			},
			"mouseup": {
				"button": 0,
				"which": 1
			},
			"click": {
				"button": 0,
				"which": 1
			}
		},
		"right": {
			"mousedown": {
				"button": 2,
				"which": 3
			},
			"mouseup": {
				"button": 2,
				"which": 3
			},
			"contextmenu": {
				"button": 2,
				"which": 3
			}
		}
	}
};

//set browser
syn.key.browser =
	(function () {
	if (syn.key.browsers[window.navigator.userAgent]) {
		return syn.key.browsers[window.navigator.userAgent];
	}
	for (var browser in syn.browser) {
		if (syn.browser[browser] && syn.key.browsers[browser]) {
			return syn.key.browsers[browser];
		}
	}
	return syn.key.browsers.gecko;
})();

syn.mouse.browser =
	(function () {
	if (syn.mouse.browsers[window.navigator.userAgent]) {
		return syn.mouse.browsers[window.navigator.userAgent];
	}
	for (var browser in syn.browser) {
		if (syn.browser[browser] && syn.mouse.browsers[browser]) {
			return syn.mouse.browsers[browser];
		}
	}
	return syn.mouse.browsers.gecko;
})();



},{"./mouse":5,"./synthetic":7}],2:[function(require,module,exports){
/*syn@0.1.1#drag*/
var syn = require('./synthetic');

// check if elementFromPageExists
(function dragSupport() {

	// document body has to exists for this test
	if (!document.body) {
		syn.schedule(dragSupport, 1);
		return;
	}
	var div = document.createElement('div');
	document.body.appendChild(div);
	syn.helpers.extend(div.style, {
		width: "100px",
		height: "10000px",
		backgroundColor: "blue",
		position: "absolute",
		top: "10px",
		left: "0px",
		zIndex: 19999
	});
	document.body.scrollTop = 11;
	if (!document.elementFromPoint) {
		return;
	}
	var el = document.elementFromPoint(3, 1);
	if (el === div) {
		syn.support.elementFromClient = true;
	} else {
		syn.support.elementFromPage = true;
	}
	document.body.removeChild(div);
	document.body.scrollTop = 0;
})();

//gets an element from a point
var elementFromPoint = function (point, element) {
	var clientX = point.clientX,
		clientY = point.clientY,
		win = syn.helpers.getWindow(element),
		el;

	if (syn.support.elementFromPage) {
		var off = syn.helpers.scrollOffset(win);
		clientX = clientX + off.left; //convert to pageX
		clientY = clientY + off.top; //convert to pageY
	}
	el = win.document.elementFromPoint ? win.document.elementFromPoint(clientX, clientY) : element;
	if (el === win.document.documentElement && (point.clientY < 0 || point.clientX < 0)) {
		return element;
	} else {
		return el;
	}
},
	//creates an event at a certain point
	createEventAtPoint = function (event, point, element) {
		var el = elementFromPoint(point, element);
		syn.trigger(el || element, event, point);
		return el;
	},
	// creates a mousemove event, but first triggering mouseout / mouseover if appropriate
	mouseMove = function (point, element, last) {
		var el = elementFromPoint(point, element);
		if (last !== el && el && last) {
			var options = syn.helpers.extend({}, point);
			options.relatedTarget = el;
			syn.trigger(last, "mouseout", options);
			options.relatedTarget = last;
			syn.trigger(el, "mouseover", options);
		}

		syn.trigger(el || element, "mousemove", point);
		return el;
	},
	// start and end are in clientX, clientY
	startMove = function (start, end, duration, element, callback) {
		var startTime = new Date(),
			distX = end.clientX - start.clientX,
			distY = end.clientY - start.clientY,
			win = syn.helpers.getWindow(element),
			current = elementFromPoint(start, element),
			cursor = win.document.createElement('div'),
			calls = 0,
			move;
		move = function onmove() {
			//get what fraction we are at
			var now = new Date(),
				scrollOffset = syn.helpers.scrollOffset(win),
				fraction = (calls === 0 ? 0 : now - startTime) / duration,
				options = {
					clientX: distX * fraction + start.clientX,
					clientY: distY * fraction + start.clientY
				};
			calls++;
			if (fraction < 1) {
				syn.helpers.extend(cursor.style, {
					left: (options.clientX + scrollOffset.left + 2) + "px",
					top: (options.clientY + scrollOffset.top + 2) + "px"
				});
				current = mouseMove(options, element, current);
				syn.schedule(onmove, 15);
			} else {
				current = mouseMove(end, element, current);
				win.document.body.removeChild(cursor);
				callback();
			}
		};
		syn.helpers.extend(cursor.style, {
			height: "5px",
			width: "5px",
			backgroundColor: "red",
			position: "absolute",
			zIndex: 19999,
			fontSize: "1px"
		});
		win.document.body.appendChild(cursor);
		move();
	},
	startDrag = function (start, end, duration, element, callback) {
		createEventAtPoint("mousedown", start, element);
		startMove(start, end, duration, element, function () {
			createEventAtPoint("mouseup", end, element);
			callback();
		});
	},
	center = function (el) {
		var j = syn.jquery()(el),
			o = j.offset();
		return {
			pageX: o.left + (j.outerWidth() / 2),
			pageY: o.top + (j.outerHeight() / 2)
		};
	},
	convertOption = function (option, win, from) {
		var page = /(\d+)[x ](\d+)/,
			client = /(\d+)X(\d+)/,
			relative = /([+-]\d+)[xX ]([+-]\d+)/,
			parts;
		//check relative "+22x-44"
		if (typeof option === 'string' && relative.test(option) && from) {
			var cent = center(from);
			parts = option.match(relative);
			option = {
				pageX: cent.pageX + parseInt(parts[1]),
				pageY: cent.pageY + parseInt(parts[2])
			};
		}
		if (typeof option === "string" && page.test(option)) {
			parts = option.match(page);
			option = {
				pageX: parseInt(parts[1]),
				pageY: parseInt(parts[2])
			};
		}
		if (typeof option === 'string' && client.test(option)) {
			parts = option.match(client);
			option = {
				clientX: parseInt(parts[1]),
				clientY: parseInt(parts[2])
			};
		}
		if (typeof option === 'string') {
			option = syn.jquery()(option, win.document)[0];
		}
		if (option.nodeName) {
			option = center(option);
		}
		if (option.pageX) {
			var off = syn.helpers.scrollOffset(win);
			option = {
				clientX: option.pageX - off.left,
				clientY: option.pageY - off.top
			};
		}
		return option;
	},
	// if the client chords are not going to be visible ... scroll the page so they will be ...
	adjust = function (from, to, win) {
		if (from.clientY < 0) {
			var off = syn.helpers.scrollOffset(win);
			var top = off.top + (from.clientY) - 100,
				diff = top - off.top;

			// first, lets see if we can scroll 100 px
			if (top > 0) {

			} else {
				top = 0;
				diff = -off.top;
			}
			from.clientY = from.clientY - diff;
			to.clientY = to.clientY - diff;
			syn.helpers.scrollOffset(win, {
				top: top,
				left: off.left
			});
		}
	};
/**
 * @add syn prototype
 */
syn.helpers.extend(syn.init.prototype, {
	/**
		 * @function syn.move move()
	   * @parent mouse
		 * @signature `syn.move(from, options, callback)`
		 * Moves the cursor from one point to another.  
		 * 
		 * ### Quick Example
		 * 
		 * The following moves the cursor from (0,0) in
		 * the window to (100,100) in 1 second.
		 * 
		 *     syn.move(
		 *          document.document,
		 *          {
		 *            from: {clientX: 0, clientY: 0},
		 *            to: {clientX: 100, clientY: 100},
		 *            duration: 1000
		 *          })
		 * 
		 * ## Options
		 * 
		 * There are many ways to configure the endpoints of the move.
		 * 
		 * ### PageX and PageY
		 * 
		 * If you pass pageX or pageY, these will get converted
		 * to client coordinates.
		 * 
		 *     syn.move(
		 *          document.document,
		 *          {
		 *            from: {pageX: 0, pageY: 0},
		 *            to: {pageX: 100, pageY: 100}
		 *          })
		 * 
		 * ### String Coordinates
		 * 
		 * You can set the pageX and pageY as strings like:
		 * 
		 *     syn.move(
		 *          document.document,
		 *          {
		 *            from: "0x0",
		 *            to: "100x100"
		 *          })
		 * 
		 * ### Element Coordinates
		 * 
		 * If jQuery is present, you can pass an element as the from or to option
		 * and the coordinate will be set as the center of the element.
		 
		 *     syn.move(
		 *          document.document,
		 *          {
		 *            from: $(".recipe")[0],
		 *            to: $("#trash")[0]
		 *          })
		 * 
		 * ### Query Strings
		 * 
		 * If jQuery is present, you can pass a query string as the from or to option.
		 * 
		 * syn.move(
		 *      document.document,
		 *      {
		 *        from: ".recipe",
		 *        to: "#trash"
		 *      })
		 *    
		 * ### No From
		 * 
		 * If you don't provide a from, the element argument passed to syn is used.
		 * 
		 *     syn.move(
		 *          'myrecipe',
		 *          { to: "#trash" })
		 * 
		 * ### Relative
		 * 
		 * You can move the drag relative to the center of the from element.
		 * 
		 *     syn.move("myrecipe", "+20 +30");
		 *
		 * @param {HTMLElement} from the element to move
		 * @param {Object} options options to configure the drag
		 * @param {Function} callback a callback that happens after the drag motion has completed
		 */
	_move: function (from, options, callback) {
		//need to convert if elements
		var win = syn.helpers.getWindow(from),
			fro = convertOption(options.from || from, win, from),
			to = convertOption(options.to || options, win, from);

		if (options.adjust !== false) {
			adjust(fro, to, win);
		}
		startMove(fro, to, options.duration || 500, from, callback);

	},
	/**
	 * @function syn.drag drag()
	 * @parent mouse
	 * @signature `syn.drag(from, options, callback)`
	 * Creates a mousedown and drags from one point to another.
	 * Check out [syn.prototype.move move] for API details.
	 *
	 * @param {HTMLElement} from
	 * @param {Object} options
	 * @param {Object} callback
	 */
	_drag: function (from, options, callback) {
		//need to convert if elements
		var win = syn.helpers.getWindow(from),
			fro = convertOption(options.from || from, win, from),
			to = convertOption(options.to || options, win, from);

		if (options.adjust !== false) {
			adjust(fro, to, win);
		}
		startDrag(fro, to, options.duration || 500, from, callback);

	}
});



},{"./synthetic":7}],3:[function(require,module,exports){
/*syn@0.1.1#key*/
var syn = require('./synthetic');
require('./typeable');
require('./browsers');


var h = syn.helpers,

	// gets the selection of an input or textarea
	getSelection = function (el) {
		var real, r, start;

		// use selectionStart if we can
		if (el.selectionStart !== undefined) {
			// this is for opera, so we don't have to focus to type how we think we would
			if (document.activeElement && document.activeElement !== el &&
				el.selectionStart === el.selectionEnd && el.selectionStart === 0) {
				return {
					start: el.value.length,
					end: el.value.length
				};
			}
			return {
				start: el.selectionStart,
				end: el.selectionEnd
			};
		} else {
			//check if we aren't focused
			try {
				//try 2 different methods that work differently (IE breaks depending on type)
				if (el.nodeName.toLowerCase() === 'input') {
					real = h.getWindow(el)
						.document.selection.createRange();
					r = el.createTextRange();
					r.setEndPoint("EndToStart", real);

					start = r.text.length;
					return {
						start: start,
						end: start + real.text.length
					};
				} else {
					real = h.getWindow(el)
						.document.selection.createRange();
					r = real.duplicate();
					var r2 = real.duplicate(),
						r3 = real.duplicate();
					r2.collapse();
					r3.collapse(false);
					r2.moveStart('character', -1);
					r3.moveStart('character', -1);
					//select all of our element
					r.moveToElementText(el);
					//now move our endpoint to the end of our real range
					r.setEndPoint('EndToEnd', real);
					start = r.text.length - real.text.length;
					var end = r.text.length;
					if (start !== 0 && r2.text === "") {
						start += 2;
					}
					if (end !== 0 && r3.text === "") {
						end += 2;
					}
					//if we aren't at the start, but previous is empty, we are at start of newline
					return {
						start: start,
						end: end
					};
				}
			} catch (e) {
				var prop = formElExp.test(el.nodeName) ? "value" : "textContent";

				return {
					start: el[prop].length,
					end: el[prop].length
				};
			}
		}
	},
	// gets all focusable elements
	getFocusable = function (el) {
		var document = h.getWindow(el)
			.document,
			res = [];

		var els = document.getElementsByTagName('*'),
			len = els.length;

		for (var i = 0; i < len; i++) {
			if (syn.isFocusable(els[i]) && els[i] !== document.documentElement) {
				res.push(els[i]);
			}
		}
		return res;
	},
	formElExp = /input|textarea/i,
	textProperty = (function(){
		var el = document.createElement("span");
		return el.textContent != null ? 'textContent' : 'innerText';
	})(),

	// Get the text from an element.
	getText = function (el) {
		if (formElExp.test(el.nodeName)) {
			return el.value;
		}
		return el[textProperty];
	},
	// Set the text of an element.
	setText = function (el, value) {
		if (formElExp.test(el.nodeName)) {
			el.value = value;
		} else {
			el[textProperty] = value;
		}
	};

/**
 *
 */
h.extend(syn, {
	/**
	 * @attribute
	 * @parent keys
	 * A list of the keys and their keycodes codes you can type.
	 * You can add type keys with
	 * @codestart
	 * syn('key', 'title', 'delete');
	 *
	 * //or
	 *
	 * syn('type', 'title', 'One Two Three[left][left][delete]');
	 * @codeend
	 *
	 * The following are a list of keys you can type:
	 * @codestart text
	 * \b        - backspace
	 * \t        - tab
	 * \r        - enter
	 * ' '       - space
	 * a-Z 0-9   - normal characters
	 * /!@#$*,.? - All other typeable characters
	 * page-up   - scrolls up
	 * page-down - scrolls down
	 * end       - scrolls to bottom
	 * home      - scrolls to top
	 * insert    - changes how keys are entered
	 * delete    - deletes the next character
	 * left      - moves cursor left
	 * right     - moves cursor right
	 * up        - moves the cursor up
	 * down      - moves the cursor down
	 * f1-12     - function buttons
	 * shift, ctrl, alt - special keys
	 * pause-break      - the pause button
	 * scroll-lock      - locks scrolling
	 * caps      - makes caps
	 * escape    - escape button
	 * num-lock  - allows numbers on keypad
	 * print     - screen capture
	 * subtract  - subtract (keypad) -
	 * dash      - dash -
	 * divide    - divide (keypad) /
	 * forward-slash - forward slash /
	 * decimal   - decimal (keypad) .
	 * period    - period .
	 * @codeend
	 */
	keycodes: {
		//backspace
		'\b': 8,

		//tab
		'\t': 9,

		//enter
		'\r': 13,

		//special
		'shift': 16,
		'ctrl': 17,
		'alt': 18,

		//weird
		'pause-break': 19,
		'caps': 20,
		'escape': 27,
		'num-lock': 144,
		'scroll-lock': 145,
		'print': 44,

		//navigation
		'page-up': 33,
		'page-down': 34,
		'end': 35,
		'home': 36,
		'left': 37,
		'up': 38,
		'right': 39,
		'down': 40,
		'insert': 45,
		'delete': 46,

		//normal characters
		' ': 32,
		'0': 48,
		'1': 49,
		'2': 50,
		'3': 51,
		'4': 52,
		'5': 53,
		'6': 54,
		'7': 55,
		'8': 56,
		'9': 57,
		'a': 65,
		'b': 66,
		'c': 67,
		'd': 68,
		'e': 69,
		'f': 70,
		'g': 71,
		'h': 72,
		'i': 73,
		'j': 74,
		'k': 75,
		'l': 76,
		'm': 77,
		'n': 78,
		'o': 79,
		'p': 80,
		'q': 81,
		'r': 82,
		's': 83,
		't': 84,
		'u': 85,
		'v': 86,
		'w': 87,
		'x': 88,
		'y': 89,
		'z': 90,
		//normal-characters, numpad
		'num0': 96,
		'num1': 97,
		'num2': 98,
		'num3': 99,
		'num4': 100,
		'num5': 101,
		'num6': 102,
		'num7': 103,
		'num8': 104,
		'num9': 105,
		'*': 106,
		'+': 107,
		'subtract': 109,
		'decimal': 110,
		//normal-characters, others
		'divide': 111,
		';': 186,
		'=': 187,
		',': 188,
		'dash': 189,
		'-': 189,
		'period': 190,
		'.': 190,
		'forward-slash': 191,
		'/': 191,
		'`': 192,
		'[': 219,
		'\\': 220,
		']': 221,
		"'": 222,

		//ignore these, you shouldn't use them
		'left window key': 91,
		'right window key': 92,
		'select key': 93,

		'f1': 112,
		'f2': 113,
		'f3': 114,
		'f4': 115,
		'f5': 116,
		'f6': 117,
		'f7': 118,
		'f8': 119,
		'f9': 120,
		'f10': 121,
		'f11': 122,
		'f12': 123
	},

	// selects text on an element
	selectText: function (el, start, end) {
		if (el.setSelectionRange) {
			if (!end) {
				syn.__tryFocus(el);
				el.setSelectionRange(start, start);
			} else {
				el.selectionStart = start;
				el.selectionEnd = end;
			}
		} else if (el.createTextRange) {
			//syn.__tryFocus(el);
			var r = el.createTextRange();
			r.moveStart('character', start);
			end = end || start;
			r.moveEnd('character', end - el.value.length);

			r.select();
		}
	},
	getText: function (el) {
		//first check if the el has anything selected ..
		if (syn.typeable.test(el)) {
			var sel = getSelection(el);
			return el.value.substring(sel.start, sel.end);
		}
		//otherwise get from page
		var win = syn.helpers.getWindow(el);
		if (win.getSelection) {
			return win.getSelection()
				.toString();
		} else if (win.document.getSelection) {
			return win.document.getSelection()
				.toString();
		} else {
			return win.document.selection.createRange()
				.text;
		}
	},
	getSelection: getSelection
});

h.extend(syn.key, {
	// retrieves a description of what events for this character should look like
	data: function (key) {
		//check if it is described directly
		if (syn.key.browser[key]) {
			return syn.key.browser[key];
		}
		for (var kind in syn.key.kinds) {
			if (h.inArray(key, syn.key.kinds[kind]) > -1) {
				return syn.key.browser[kind];
			}
		}
		return syn.key.browser.character;
	},

	//returns the special key if special
	isSpecial: function (keyCode) {
		var specials = syn.key.kinds.special;
		for (var i = 0; i < specials.length; i++) {
			if (syn.keycodes[specials[i]] === keyCode) {
				return specials[i];
			}
		}
	},
	/**
	 * @hide
	 * gets the options for a key and event type ...
	 * @param {Object} key
	 * @param {Object} event
	 */
	options: function (key, event) {
		var keyData = syn.key.data(key);

		if (!keyData[event]) {
			//we shouldn't be creating this event
			return null;
		}

		var charCode = keyData[event][0],
			keyCode = keyData[event][1],
			result = {};

		if (keyCode === 'key') {
			result.keyCode = syn.keycodes[key];
		} else if (keyCode === 'char') {
			result.keyCode = key.charCodeAt(0);
		} else {
			result.keyCode = keyCode;
		}

		if (charCode === 'char') {
			result.charCode = key.charCodeAt(0);
		} else if (charCode !== null) {
			result.charCode = charCode;
		}

		// all current browsers have which property to normalize keyCode/charCode
		if (result.keyCode) {
			result.which = result.keyCode;
		} else {
			result.which = result.charCode;
		}

		return result;
	},
	//types of event keys
	kinds: {
		special: ["shift", 'ctrl', 'alt', 'caps'],
		specialChars: ["\b"],
		navigation: ["page-up", 'page-down', 'end', 'home', 'left', 'up', 'right', 'down', 'insert', 'delete'],
		'function': ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12']
	},
	//returns the default function
	// some keys have default functions
	// some 'kinds' of keys have default functions
	getDefault: function (key) {
		//check if it is described directly
		if (syn.key.defaults[key]) {
			return syn.key.defaults[key];
		}
		for (var kind in syn.key.kinds) {
			if (h.inArray(key, syn.key.kinds[kind]) > -1 && syn.key.defaults[kind]) {
				return syn.key.defaults[kind];
			}
		}
		return syn.key.defaults.character;
	},
	// default behavior when typing
	defaults: {
		'character': function (options, scope, key, force, sel) {
			if (/num\d+/.test(key)) {
				key = key.match(/\d+/)[0];
			}

			if (force || (!syn.support.keyCharacters && syn.typeable.test(this))) {
				var current = getText(this),
					before = current.substr(0, sel.start),
					after = current.substr(sel.end),
					character = key;

				setText(this, before + character + after);
				//handle IE inserting \r\n
				var charLength = character === "\n" && syn.support.textareaCarriage ? 2 : character.length;
				syn.selectText(this, before.length + charLength);
			}
		},
		'c': function (options, scope, key, force, sel) {
			if (syn.key.ctrlKey) {
				syn.key.clipboard = syn.getText(this);
			} else {
				syn.key.defaults.character.apply(this, arguments);
			}
		},
		'v': function (options, scope, key, force, sel) {
			if (syn.key.ctrlKey) {
				syn.key.defaults.character.call(this, options, scope, syn.key.clipboard, true, sel);
			} else {
				syn.key.defaults.character.apply(this, arguments);
			}
		},
		'a': function (options, scope, key, force, sel) {
			if (syn.key.ctrlKey) {
				syn.selectText(this, 0, getText(this)
					.length);
			} else {
				syn.key.defaults.character.apply(this, arguments);
			}
		},
		'home': function () {
			syn.onParents(this, function (el) {
				if (el.scrollHeight !== el.clientHeight) {
					el.scrollTop = 0;
					return false;
				}
			});
		},
		'end': function () {
			syn.onParents(this, function (el) {
				if (el.scrollHeight !== el.clientHeight) {
					el.scrollTop = el.scrollHeight;
					return false;
				}
			});
		},
		'page-down': function () {
			//find the first parent we can scroll
			syn.onParents(this, function (el) {
				if (el.scrollHeight !== el.clientHeight) {
					var ch = el.clientHeight;
					el.scrollTop += ch;
					return false;
				}
			});
		},
		'page-up': function () {
			syn.onParents(this, function (el) {
				if (el.scrollHeight !== el.clientHeight) {
					var ch = el.clientHeight;
					el.scrollTop -= ch;
					return false;
				}
			});
		},
		'\b': function (options, scope, key, force, sel) {
			//this assumes we are deleting from the end
			if (!syn.support.backspaceWorks && syn.typeable.test(this)) {
				var current = getText(this),
					before = current.substr(0, sel.start),
					after = current.substr(sel.end);

				if (sel.start === sel.end && sel.start > 0) {
					//remove a character
					setText(this, before.substring(0, before.length - 1) + after);
					syn.selectText(this, sel.start - 1);
				} else {
					setText(this, before + after);
					syn.selectText(this, sel.start);
				}

				//set back the selection
			}
		},
		'delete': function (options, scope, key, force, sel) {
			if (!syn.support.backspaceWorks && syn.typeable.test(this)) {
				var current = getText(this),
					before = current.substr(0, sel.start),
					after = current.substr(sel.end);
				if (sel.start === sel.end && sel.start <= getText(this)
					.length - 1) {
					setText(this, before + after.substring(1));
				} else {
					setText(this, before + after);
				}
				syn.selectText(this, sel.start);
			}
		},
		'\r': function (options, scope, key, force, sel) {

			var nodeName = this.nodeName.toLowerCase();
			// submit a form
			if (nodeName === 'input') {
				syn.trigger(this, "change", {});
			}

			if (!syn.support.keypressSubmits && nodeName === 'input') {
				var form = syn.closest(this, "form");
				if (form) {
					syn.trigger(form, "submit", {});
				}

			}
			//newline in textarea
			if (!syn.support.keyCharacters && nodeName === 'textarea') {
				syn.key.defaults.character.call(this, options, scope, "\n",
					undefined, sel);
			}
			// 'click' hyperlinks
			if (!syn.support.keypressOnAnchorClicks && nodeName === 'a') {
				syn.trigger(this, "click", {});
			}
		},
		// 
		// Gets all focusable elements.  If the element (this)
		// doesn't have a tabindex, finds the next element after.
		// If the element (this) has a tabindex finds the element 
		// with the next higher tabindex OR the element with the same
		// tabindex after it in the document.
		// @return the next element
		// 
		'\t': function (options, scope) {
			// focusable elements
			var focusEls = getFocusable(this),
				// will be set to our guess for the next element
				current = null,
				i = 0,
				el,
				//the tabindex of the tabable element we are looking at
				firstNotIndexed,
				orders = [];
			for (; i < focusEls.length; i++) {
				orders.push([focusEls[i], i]);
			}
			var sort = function (order1, order2) {
				var el1 = order1[0],
					el2 = order2[0],
					tab1 = syn.tabIndex(el1) || 0,
					tab2 = syn.tabIndex(el2) || 0;
				if (tab1 === tab2) {
					return order1[1] - order2[1];
				} else {
					if (tab1 === 0) {
						return 1;
					} else if (tab2 === 0) {
						return -1;
					} else {
						return tab1 - tab2;
					}
				}
			};
			orders.sort(sort);
			//now find current
			for (i = 0; i < orders.length; i++) {
				el = orders[i][0];
				if (this === el) {
					if (!syn.key.shiftKey) {
						current = orders[i + 1][0];
						if (!current) {
							current = orders[0][0];
						}
					} else {
						current = orders[i - 1][0];
						if (!current) {
							current = orders[focusEls.length - 1][0];
						}
					}
				}
			}

			//restart if we didn't find anything
			if (!current) {
				current = firstNotIndexed;
			} else {
				syn.__tryFocus(current);
			}
			return current;
		},
		'left': function (options, scope, key, force, sel) {
			if (syn.typeable.test(this)) {
				if (syn.key.shiftKey) {
					syn.selectText(this, sel.start === 0 ? 0 : sel.start - 1, sel.end);
				} else {
					syn.selectText(this, sel.start === 0 ? 0 : sel.start - 1);
				}
			}
		},
		'right': function (options, scope, key, force, sel) {
			if (syn.typeable.test(this)) {
				if (syn.key.shiftKey) {
					syn.selectText(this, sel.start, sel.end + 1 > getText(this)
						.length ? getText(this)
						.length : sel.end + 1);
				} else {
					syn.selectText(this, sel.end + 1 > getText(this)
						.length ? getText(this)
						.length : sel.end + 1);
				}
			}
		},
		'up': function () {
			if (/select/i.test(this.nodeName)) {

				this.selectedIndex = this.selectedIndex ? this.selectedIndex - 1 : 0;
				//set this to change on blur?
			}
		},
		'down': function () {
			if (/select/i.test(this.nodeName)) {
				syn.changeOnBlur(this, "selectedIndex", this.selectedIndex);
				this.selectedIndex = this.selectedIndex + 1;
				//set this to change on blur?
			}
		},
		'shift': function () {
			return null;
		},
		'ctrl': function () {
			return null;
		}
	}
});

h.extend(syn.create, {
	keydown: {
		setup: function (type, options, element) {
			if (h.inArray(options, syn.key.kinds.special) !== -1) {
				syn.key[options + "Key"] = element;
			}
		}
	},
	keypress: {
		setup: function (type, options, element) {
			// if this browsers supports writing keys on events
			// but doesn't write them if the element isn't focused
			// focus on the element (ignored if already focused)
			if (syn.support.keyCharacters && !syn.support.keysOnNotFocused) {
				syn.__tryFocus(element);
			}
		}
	},
	keyup: {
		setup: function (type, options, element) {
			if (h.inArray(options, syn.key.kinds.special) !== -1) {
				syn.key[options + "Key"] = null;
			}
		}
	},
	key: {
		// return the options for a key event
		options: function (type, options, element) {
			//check if options is character or has character
			options = typeof options !== "object" ? {
				character: options
			} : options;

			//don't change the orignial
			options = h.extend({}, options);
			if (options.character) {
				h.extend(options, syn.key.options(options.character, type));
				delete options.character;
			}

			options = h.extend({
				ctrlKey: !! syn.key.ctrlKey,
				altKey: !! syn.key.altKey,
				shiftKey: !! syn.key.shiftKey,
				metaKey: !! syn.key.metaKey
			}, options);

			return options;
		},
		// creates a key event
		event: function (type, options, element) { //Everyone Else
			var doc = h.getWindow(element)
				.document || document,
				event;
			if (doc.createEvent) {
				try {
					event = doc.createEvent("KeyEvents");
					event.initKeyEvent(type, true, true, window, options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.keyCode, options.charCode);
				} catch (e) {
					event = h.createBasicStandardEvent(type, options, doc);
				}
				event.synthetic = true;
				return event;
			} else {
				try {
					event = h.createEventObject.apply(this, arguments);
					h.extend(event, options);
				} catch (e) {}

				return event;
			}
		}
	}
});

var convert = {
	"enter": "\r",
	"backspace": "\b",
	"tab": "\t",
	"space": " "
};

/**
 * 
 */
h.extend(syn.init.prototype, {
	/**
	 * @function syn.key key()
	 * @parent keys
	 * @signature `syn.key(element, options, callback)`
	 * Types a single key.  The key should be
	 * a string that matches a
	 * [syn.static.keycodes].
	 *
	 * The following sends a carridge return
	 * to the 'name' element.
	 * @codestart
	 * syn.key('name', '\r')
	 * @codeend
	 * For each character, a keydown, keypress, and keyup is triggered if
	 * appropriate.
	 * @param {HTMLElement} [element]
	 * @param {String|Number} options
	 * @param {Function} [callback]
	 * @return {HTMLElement} the element currently focused.
	 */
	_key: function (element, options, callback) {
		//first check if it is a special up
		if (/-up$/.test(options) && h.inArray(options.replace("-up", ""),
			syn.key.kinds.special) !== -1) {
			syn.trigger(element, 'keyup', options.replace("-up", ""));
			return callback(true, element);
		}

		// keep reference to current activeElement
		var activeElement = h.getWindow(element)
			.document.activeElement,
			caret = syn.typeable.test(element) && getSelection(element),
			key = convert[options] || options,
			// should we run default events
			runDefaults = syn.trigger(element, 'keydown', key),

			// a function that gets the default behavior for a key
			getDefault = syn.key.getDefault,

			// how this browser handles preventing default events
			prevent = syn.key.browser.prevent,

			// the result of the default event
			defaultResult,

			keypressOptions = syn.key.options(key, 'keypress');

		if (runDefaults) {
			//if the browser doesn't create keypresses for this key, run default
			if (!keypressOptions) {
				defaultResult = getDefault(key)
					.call(element, keypressOptions, h.getWindow(element),
						key, undefined, caret);
			} else {
				//do keypress
				// check if activeElement changed b/c someone called focus in keydown
				if (activeElement !== h.getWindow(element)
					.document.activeElement) {
					element = h.getWindow(element)
						.document.activeElement;
				}

				runDefaults = syn.trigger(element, 'keypress', keypressOptions);
				if (runDefaults) {
					defaultResult = getDefault(key)
						.call(element, keypressOptions, h.getWindow(element),
							key, undefined, caret);
				}
			}
		} else {
			//canceled ... possibly don't run keypress
			if (keypressOptions && h.inArray('keypress', prevent.keydown) === -1) {
				// check if activeElement changed b/c someone called focus in keydown
				if (activeElement !== h.getWindow(element)
					.document.activeElement) {
					element = h.getWindow(element)
						.document.activeElement;
				}

				syn.trigger(element, 'keypress', keypressOptions);
			}
		}
		if (defaultResult && defaultResult.nodeName) {
			element = defaultResult;
		}

		if (defaultResult !== null) {
			syn.schedule(function () {
				if (syn.support.oninput) {
					syn.trigger(element, 'input', syn.key.options(key, 'input'));
				}
				syn.trigger(element, 'keyup', syn.key.options(key, 'keyup'));
				callback(runDefaults, element);
			}, 1);
		} else {
			callback(runDefaults, element);
		}

		//do mouseup
		return element;
		// is there a keypress? .. if not , run default
		// yes -> did we prevent it?, if not run ...
	},
	/**
	 * @function syn.type type()
	 * @parent keys
	 * @signature `syn.type(element, options, callback)`
	 * Types sequence of [syn.key key actions].  Each
	 * character is typed, one at a type.
	 * Multi-character keys like 'left' should be
	 * enclosed in square brackents.
	 *
	 * The following types 'JavaScript MVC' then deletes the space.
	 * @codestart
	 * syn.type('name', 'JavaScript MVC[left][left][left]\b')
	 * @codeend
	 *
	 * Type is able to handle (and move with) tabs (\t).
	 * The following simulates tabing and entering values in a form and
	 * eventually submitting the form.
	 * @codestart
	 * syn.type("Justin\tMeyer\t27\tjustinbmeyer@gmail.com\r")
	 * @codeend
	 * @param {HTMLElement} [element] an element or an id of an element
	 * @param {String} options the text to type
	 * @param {Function} [callback] a function to callback
	 */
	_type: function (element, options, callback) {
		//break it up into parts ...
		//go through each type and run
		var parts = (options + "")
			.match(/(\[[^\]]+\])|([^\[])/g),
			self = this,
			runNextPart = function (runDefaults, el) {
				var part = parts.shift();
				if (!part) {
					callback(runDefaults, el);
					return;
				}
				el = el || element;
				if (part.length > 1) {
					part = part.substr(1, part.length - 2);
				}
				self._key(el, part, runNextPart);
			};

		runNextPart();

	}
});



},{"./browsers":1,"./synthetic":7,"./typeable":8}],4:[function(require,module,exports){
/*syn@0.1.1#key.support*/
var syn = require('./synthetic');
require('./key');


if (!syn.config.support) {
	//do support code
	(function checkForSupport() {
		if (!document.body) {
			return syn.schedule(checkForSupport, 1);
		}

		var div = document.createElement("div"),
			checkbox, submit, form, anchor, textarea, inputter, one, doc;

		doc = document.documentElement;

		div.innerHTML = "<form id='outer'>" +
			"<input name='checkbox' type='checkbox'/>" +
			"<input name='radio' type='radio' />" +
			"<input type='submit' name='submitter'/>" +
			"<input type='input' name='inputter'/>" +
			"<input name='one'>" +
			"<input name='two'/>" +
			"<a href='#abc'></a>" +
			"<textarea>1\n2</textarea>" +
			"</form>";

		doc.insertBefore(div, doc.firstElementChild || doc.children[0]);
		form = div.firstChild;
		checkbox = form.childNodes[0];
		submit = form.childNodes[2];
		anchor = form.getElementsByTagName("a")[0];
		textarea = form.getElementsByTagName("textarea")[0];
		inputter = form.childNodes[3];
		one = form.childNodes[4];

		form.onsubmit = function (ev) {
			if (ev.preventDefault) {
				ev.preventDefault();
			}
			syn.support.keypressSubmits = true;
			ev.returnValue = false;
			return false;
		};
		// Firefox 4 won't write key events if the element isn't focused
		syn.__tryFocus(inputter);
		syn.trigger(inputter, "keypress", "\r");

		syn.trigger(inputter, "keypress", "a");
		syn.support.keyCharacters = inputter.value === "a";

		inputter.value = "a";
		syn.trigger(inputter, "keypress", "\b");
		syn.support.backspaceWorks = inputter.value === "";

		inputter.onchange = function () {
			syn.support.focusChanges = true;
		};
		syn.__tryFocus(inputter);
		syn.trigger(inputter, "keypress", "a");
		syn.__tryFocus(form.childNodes[5]); // this will throw a change event
		syn.trigger(inputter, "keypress", "b");
		syn.support.keysOnNotFocused = inputter.value === "ab";

		//test keypress \r on anchor submits
		syn.bind(anchor, "click", function (ev) {
			if (ev.preventDefault) {
				ev.preventDefault();
			}
			syn.support.keypressOnAnchorClicks = true;
			ev.returnValue = false;
			return false;
		});
		syn.trigger(anchor, "keypress", "\r");

		syn.support.textareaCarriage = textarea.value.length === 4;

		// IE only, oninput event.
		syn.support.oninput = 'oninput' in one;

		doc.removeChild(div);

		syn.support.ready++;
	})();
} else {
	syn.helpers.extend(syn.support, syn.config.support);
}




},{"./key":3,"./synthetic":7}],5:[function(require,module,exports){
/*syn@0.1.1#mouse*/
var syn = require('./synthetic');

//handles mosue events

var h = syn.helpers,
	getWin = h.getWindow;

syn.mouse = {};
h.extend(syn.defaults, {
	mousedown: function (options) {
		syn.trigger(this, "focus", {});
	},
	click: function () {
		// prevents the access denied issue in IE if the click causes the element to be destroyed
		var element = this,
			href, type, createChange, radioChanged, nodeName, scope;
		try {
			href = element.href;
			type = element.type;
			createChange = syn.data(element, "createChange");
			radioChanged = syn.data(element, "radioChanged");
			scope = getWin(element);
			nodeName = element.nodeName.toLowerCase();
		} catch (e) {
			return;
		}
		//get old values

		//this code was for restoring the href attribute to prevent popup opening
		//if ((href = syn.data(element, "href"))) {
		//	element.setAttribute('href', href)
		//}

		//run href javascript
		if (!syn.support.linkHrefJS && /^\s*javascript:/.test(href)) {
			//eval js
			var code = href.replace(/^\s*javascript:/, "");

			//try{
			if (code !== "//" && code.indexOf("void(0)") === -1) {
				if (window.selenium) {
					eval("with(selenium.browserbot.getCurrentWindow()){" + code + "}");
				} else {
					eval("with(scope){" + code + "}");
				}
			}
		}

		//submit a form
		if (!(syn.support.clickSubmits) && (nodeName === "input" &&
				type === "submit") ||
			nodeName === 'button') {

			var form = syn.closest(element, "form");
			if (form) {
				syn.trigger(form, "submit", {});
			}

		}
		//follow a link, probably needs to check if in an a.
		if (nodeName === "a" && element.href && !/^\s*javascript:/.test(href)) {
			scope.location.href = href;

		}

		//change a checkbox
		if (nodeName === "input" && type === "checkbox") {

			//if(!syn.support.clickChecks && !syn.support.changeChecks){
			//	element.checked = !element.checked;
			//}
			if (!syn.support.clickChanges) {
				syn.trigger(element, "change", {});
			}
		}

		//change a radio button
		if (nodeName === "input" && type === "radio") { // need to uncheck others if not checked
			if (radioChanged && !syn.support.radioClickChanges) {
				syn.trigger(element, "change", {});
			}
		}
		// change options
		if (nodeName === "option" && createChange) {
			syn.trigger(element.parentNode, "change", {}); //does not bubble
			syn.data(element, "createChange", false);
		}
	}
});

//add create and setup behavior for mosue events
h.extend(syn.create, {
	mouse: {
		options: function (type, options, element) {
			var doc = document.documentElement,
				body = document.body,
				center = [options.pageX || 0, options.pageY || 0],
				//browser might not be loaded yet (doing support code)
				left = syn.mouse.browser && syn.mouse.browser.left[type],
				right = syn.mouse.browser && syn.mouse.browser.right[type];
			return h.extend({
				bubbles: true,
				cancelable: true,
				view: window,
				detail: 1,
				screenX: 1,
				screenY: 1,
				clientX: options.clientX || center[0] - (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0),
				clientY: options.clientY || center[1] - (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0),
				ctrlKey: !! syn.key.ctrlKey,
				altKey: !! syn.key.altKey,
				shiftKey: !! syn.key.shiftKey,
				metaKey: !! syn.key.metaKey,
				button: left && left.button !== null ? left.button : right && right.button || (type === 'contextmenu' ? 2 : 0),
				relatedTarget: document.documentElement
			}, options);
		},
		event: function (type, defaults, element) { //Everyone Else
			var doc = getWin(element)
				.document || document,
				event;
			if (doc.createEvent) {
				try {
					event = doc.createEvent('MouseEvents');
					event.initMouseEvent(type, defaults.bubbles, defaults.cancelable,
						defaults.view, defaults.detail,
						defaults.screenX, defaults.screenY,
						defaults.clientX, defaults.clientY,
						defaults.ctrlKey, defaults.altKey,
						defaults.shiftKey, defaults.metaKey,
						defaults.button, defaults.relatedTarget);
				} catch (e) {
					event = h.createBasicStandardEvent(type, defaults, doc);
				}
				event.synthetic = true;
				return event;
			} else {
				try {
					event = h.createEventObject(type, defaults, element);
				} catch (e) {}

				return event;
			}

		}
	},
	click: {
		setup: function (type, options, element) {
			var nodeName = element.nodeName.toLowerCase();

			//we need to manually 'check' in browser that can't check
			//so checked has the right value
			if (!syn.support.clickChecks && !syn.support.changeChecks && nodeName === "input") {
				type = element.type.toLowerCase(); //pretty sure lowercase isn't needed
				if (type === 'checkbox') {
					element.checked = !element.checked;
				}
				if (type === "radio") {
					//do the checks manually 
					if (!element.checked) { //do nothing, no change
						try {
							syn.data(element, "radioChanged", true);
						} catch (e) {}
						element.checked = true;
					}
				}
			}

			if (nodeName === "a" && element.href && !/^\s*javascript:/.test(element.href)) {

				//save href
				syn.data(element, "href", element.href);

				//remove b/c safari/opera will open a new tab instead of changing the page
				// this has been removed because newer versions don't have this problem
				//element.setAttribute('href', 'javascript://')
				//however this breaks scripts using the href
				//we need to listen to this and prevent the default behavior
				//and run the default behavior ourselves. Boo!
			}
			//if select or option, save old value and mark to change
			if (/option/i.test(element.nodeName)) {
				var child = element.parentNode.firstChild,
					i = -1;
				while (child) {
					if (child.nodeType === 1) {
						i++;
						if (child === element) {
							break;
						}
					}
					child = child.nextSibling;
				}
				if (i !== element.parentNode.selectedIndex) {
					//shouldn't this wait on triggering
					//change?
					element.parentNode.selectedIndex = i;
					syn.data(element, "createChange", true);
				}
			}

		}
	},
	mousedown: {
		setup: function (type, options, element) {
			var nn = element.nodeName.toLowerCase();
			//we have to auto prevent default to prevent freezing error in safari
			if (syn.browser.safari && (nn === "select" || nn === "option")) {
				options._autoPrevent = true;
			}
		}
	}
});



},{"./synthetic":7}],6:[function(require,module,exports){
/*syn@0.1.1#mouse.support*/
var syn = require('./synthetic');
require('./mouse');


(function checkForSupport() {
	if (!document.body) {
		return syn.schedule(checkForSupport, 1);
	}
	window.__synthTest = function () {
		syn.support.linkHrefJS = true;
	};
	
	var div = document.createElement("div"),
		checkbox, submit, form, select;
	
	div.innerHTML = "<form id='outer'>" + "<input name='checkbox' type='checkbox'/>" + "<input name='radio' type='radio' />" + "<input type='submit' name='submitter'/>" + "<input type='input' name='inputter'/>" + "<input name='one'>" + "<input name='two'/>" + "<a href='javascript:__synthTest()' id='synlink'></a>" + "<select><option></option></select>" + "</form>";
	document.documentElement.appendChild(div);
	form = div.firstChild;
	checkbox = form.childNodes[0];
	submit = form.childNodes[2];
	select = form.getElementsByTagName('select')[0];
	
	//trigger click for linkHrefJS support, childNodes[6] === anchor
	//syn.trigger(form.childNodes[6], 'click', {});
	
	checkbox.checked = false;
	checkbox.onchange = function () {
		syn.support.clickChanges = true;
	};
	
	syn.trigger(checkbox, "click", {});
	syn.support.clickChecks = checkbox.checked;
	
	checkbox.checked = false;
	
	syn.trigger(checkbox, "change", {});
	
	syn.support.changeChecks = checkbox.checked;
	
	form.onsubmit = function (ev) {
		if (ev.preventDefault) {
			ev.preventDefault();
		}
		syn.support.clickSubmits = true;
		return false;
	};
	syn.trigger(submit, "click", {});
	
	form.childNodes[1].onchange = function () {
		syn.support.radioClickChanges = true;
	};
	syn.trigger(form.childNodes[1], "click", {});
	
	syn.bind(div, 'click', function onclick() {
		syn.support.optionClickBubbles = true;
		syn.unbind(div, 'click', onclick);
	});
	syn.trigger(select.firstChild, "click", {});
	
	syn.support.changeBubbles = syn.eventSupported('change');
	
	//test if mousedown followed by mouseup causes click (opera), make sure there are no clicks after this
	div.onclick = function () {
		syn.support.mouseDownUpClicks = true;
	};
	syn.trigger(div, "mousedown", {});
	syn.trigger(div, "mouseup", {});
	
	document.documentElement.removeChild(div);
	
	//check stuff
	syn.support.ready++;
}());





},{"./mouse":5,"./synthetic":7}],7:[function(require,module,exports){
/*syn@0.1.1#synthetic*/

//allow for configuration of syn
var opts = window.syn ? window.syn : {};

var extend = function (d, s) {
	var p;
	for (p in s) {
		d[p] = s[p];
	}
	return d;
},
	// only uses browser detection for key events
	browser = {
		msie: !! (window.attachEvent && !window.opera),
		opera: !! window.opera,
		webkit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
		safari: navigator.userAgent.indexOf('AppleWebKit/') > -1 && navigator.userAgent.indexOf('Chrome/') === -1,
		gecko: navigator.userAgent.indexOf('Gecko') > -1,
		mobilesafari: !! navigator.userAgent.match(/Apple.*Mobile.*Safari/),
		rhino: navigator.userAgent.match(/Rhino/) && true
	},
	createEventObject = function (type, options, element) {
		var event = element.ownerDocument.createEventObject();
		return extend(event, options);
	},
	data = {},
	id = 1,
	expando = "_synthetic" + new Date()
		.getTime(),
	bind, unbind, schedule, key = /keypress|keyup|keydown/,
	page = /load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll/,
	//this is maintained so we can click on html and blur the active element
	activeElement,

	/**
	 * @class syn
	 * @download funcunit/dist/syn.js
	 * @test funcunit/synthetic/qunit.html
	 * syn is used to simulate user actions.  It creates synthetic events and
	 * performs their default behaviors.
	 * 
	 * <h2>Basic Use</h2>
	 * The following clicks an input element with <code>id='description'</code>
	 * and then types <code>'Hello World'</code>.
	 * 
	 @codestart
	 syn.click('description', {})
	 .type("Hello World")
	 @codeend
	 * <h2>User Actions and Events</h2>
	 * <p>syn is typically used to simulate user actions as opposed to triggering events. Typing characters
	 * is an example of a user action.  The keypress that represents an <code>'a'</code>
	 * character being typed is an example of an event. 
	 * </p>
	 * <p>
	 *   While triggering events is supported, it's much more useful to simulate actual user behavior.  The 
	 *   following actions are supported by syn:
	 * </p>
	 * <ul>
	 *   <li><code>[syn.prototype.click click]</code> - a mousedown, focus, mouseup, and click.</li>
	 *   <li><code>[syn.prototype.dblclick dblclick]</code> - two <code>click!</code> events followed by a <code>dblclick</code>.</li>
	 *   <li><code>[syn.prototype.key key]</code> - types a single character (keydown, keypress, keyup).</li>
	 *   <li><code>[syn.prototype.type type]</code> - types multiple characters into an element.</li>
	 *   <li><code>[syn.prototype.move move]</code> - moves the mouse from one position to another (triggering mouseover / mouseouts).</li>
	 *   <li><code>[syn.prototype.drag drag]</code> - a mousedown, followed by mousemoves, and a mouseup.</li>
	 * </ul>
	 * All actions run asynchronously.  
	 * Click on the links above for more 
	 * information on how to use the specific action.
	 * <h2>Asynchronous Callbacks</h2>
	 * Actions don't complete immediately. This is almost 
	 * entirely because <code>focus()</code> 
	 * doesn't run immediately in IE.
	 * If you provide a callback function to syn, it will 
	 * be called after the action is completed.
	 * <br/>The following checks that "Hello World" was entered correctly: 
	 @codestart
	 syn.click('description', {})
	 .type("Hello World", function(){
	 
	 ok("Hello World" == document.getElementById('description').value)  
	 })
	 @codeend
	 <h2>Asynchronous Chaining</h2>
	 <p>You might have noticed the [syn.prototype.then then] method.  It provides chaining
	 so you can do a sequence of events with a single (final) callback.
	 </p><p>
	 If an element isn't provided to then, it uses the previous syn's element.
	 </p>
	 The following does a lot of stuff before checking the result:
	 @codestart
	 syn.type('title', 'ice water')
	 .type('description', 'ice and water')
	 .click('create', {})
	 .drag('newRecipe', {to: 'favorites'},
	 function(){
	 ok($('#newRecipe').parents('#favorites').length);
	 })
	 @codeend
	 
	 <h2>jQuery Helper</h2>
	 If jQuery is present, syn adds a triggersyn helper you can use like:
	 @codestart
	 $("#description").triggersyn("type","Hello World");
	 @codeend
	 * <h2>Key Event Recording</h2>
	 * <p>Every browser has very different rules for dispatching key events.  
	 * As there is no way to feature detect how a browser handles key events,
	 * synthetic uses a description of how the browser behaves generated
	 * by a recording application.  </p>
	 * <p>
	 * If you want to support a browser not currently supported, you can
	 * record that browser's key event description and add it to
	 * <code>syn.key.browsers</code> by it's navigator agent.
	 * </p>
	 @codestart
	 syn.key.browsers["Envjs\ Resig/20070309 PilotFish/1.2.0.10\1.6"] = {
	 'prevent':
	 {"keyup":[],"keydown":["char","keypress"],"keypress":["char"]},
	 'character':
	 { ... }
	 }
	 @codeend
	 * <h2>Limitations</h2>
	 * syn fully supports IE 6+, FF 3+, Chrome, Safari, Opera 10+.
	 * With FF 1+, drag / move events are only partially supported. They will
	 * not trigger mouseover / mouseout events.<br/>
	 * Safari crashes when a mousedown is triggered on a select.  syn will not 
	 * create this event.
	 * <h2>Contributing to syn</h2>
	 * Have we missed something? We happily accept patches.  The following are 
	 * important objects and properties of syn:
	 * <ul>
	 * <li><code>syn.create</code> - contains methods to setup, convert options, and create an event of a specific type.</li>
	 *  <li><code>syn.defaults</code> - default behavior by event type (except for keys).</li>
	 *  <li><code>syn.key.defaults</code> - default behavior by key.</li>
	 *  <li><code>syn.keycodes</code> - supported keys you can type.</li>
	 * </ul>
	 * <h2>Roll Your Own Functional Test Framework</h2>
	 * <p>syn is really the foundation of JavaScriptMVC's functional testing framework - [FuncUnit].
	 *   But, we've purposely made syn work without any dependencies in the hopes that other frameworks or 
	 *   testing solutions can use it as well.
	 * </p>
	 * @constructor
	 * @signature `syn(type, element, options, callback)`
	 * Creates a synthetic event on the element.
	 * @param {Object} type
	 * @param {HTMLElement} element
	 * @param {Object} options
	 * @param {Function} callback
	 * @return {syn} returns the syn object.
	 */
	syn = function (type, element, options, callback) {
		return (new syn.init(type, element, options, callback));
	};

syn.config = opts;

// helper for supporting IE8 and below:
// focus will throw in some circumnstances, like element being invisible
syn.__tryFocus = function tryFocus(element) {
	try {
		element.focus();
	} catch (e) {}
};

bind = function (el, ev, f) {
	return el.addEventListener ? el.addEventListener(ev, f, false) : el.attachEvent("on" + ev, f);
};
unbind = function (el, ev, f) {
	return el.addEventListener ? el.removeEventListener(ev, f, false) : el.detachEvent("on" + ev, f);
};

schedule = syn.config.schedule || function (fn, ms) {
	setTimeout(fn, ms);
};
/**
 * @Static
 */
extend(syn, {
	/**
	 * Creates a new synthetic event instance
	 * @hide
	 * @param {String} type
	 * @param {HTMLElement} element
	 * @param {Object} options
	 * @param {Function} callback
	 */
	init: function (type, element, options, callback) {
		var args = syn.args(options, element, callback),
			self = this;
		this.queue = [];
		this.element = args.element;

		//run event
		if (typeof this[type] === "function") {
			this[type](args.element, args.options, function (defaults, el) {
				if (args.callback) {
					args.callback.apply(self, arguments);
				}
				self.done.apply(self, arguments);
			});
		} else {
			this.result = syn.trigger(args.element, type, args.options);
			if (args.callback) {
				args.callback.call(this, args.element, this.result);
			}
		}
	},
	jquery: function (el, fast) {
		if (window.FuncUnit && window.FuncUnit.jQuery) {
			return window.FuncUnit.jQuery;
		}
		if (el) {
			return syn.helpers.getWindow(el)
				.jQuery || window.jQuery;
		} else {
			return window.jQuery;
		}
	},
	/**
	 * Returns an object with the args for a syn.
	 * @hide
	 * @return {Object}
	 */
	args: function () {
		var res = {},
			i = 0;
		for (; i < arguments.length; i++) {
			if (typeof arguments[i] === 'function') {
				res.callback = arguments[i];
			} else if (arguments[i] && arguments[i].jquery) {
				res.element = arguments[i][0];
			} else if (arguments[i] && arguments[i].nodeName) {
				res.element = arguments[i];
			} else if (res.options && typeof arguments[i] === 'string') { //we can get by id
				res.element = document.getElementById(arguments[i]);
			} else if (arguments[i]) {
				res.options = arguments[i];
			}
		}
		return res;
	},
	click: function (element, options, callback) {
		syn('click!', element, options, callback);
	},
	/**
	 * @hide
	 * @attribute defaults
	 * Default actions for events.  Each default function is called with this as its
	 * element.  It should return true if a timeout
	 * should happen after it.  If it returns an element, a timeout will happen
	 * and the next event will happen on that element.
	 */
	defaults: {
		focus: function focus() {
			if (!syn.support.focusChanges) {
				var element = this,
					nodeName = element.nodeName.toLowerCase();
				syn.data(element, "syntheticvalue", element.value);

				//TODO, this should be textarea too
				//and this might be for only text style inputs ... hmmmmm ....
				if (nodeName === "input" || nodeName === "textarea") {
					bind(element, "blur", function blur() {
						if (syn.data(element, "syntheticvalue") !== element.value) {

							syn.trigger(element, "change", {});
						}
						unbind(element, "blur", blur);
					});

				}
			}
		},
		submit: function () {
			syn.onParents(this, function (el) {
				if (el.nodeName.toLowerCase() === 'form') {
					el.submit();
					return false;
				}
			});
		}
	},
	changeOnBlur: function (element, prop, value) {

		bind(element, "blur", function onblur() {
			if (value !== element[prop]) {
				syn.trigger(element, "change", {});
			}
			unbind(element, "blur", onblur);
		});

	},
	/**
	 * Returns the closest element of a particular type.
	 * @hide
	 * @param {Object} el
	 * @param {Object} type
	 */
	closest: function (el, type) {
		while (el && el.nodeName.toLowerCase() !== type.toLowerCase()) {
			el = el.parentNode;
		}
		return el;
	},
	/**
	 * adds jQuery like data (adds an expando) and data exists FOREVER :)
	 * @hide
	 * @param {Object} el
	 * @param {Object} key
	 * @param {Object} value
	 */
	data: function (el, key, value) {
		var d;
		if (!el[expando]) {
			el[expando] = id++;
		}
		if (!data[el[expando]]) {
			data[el[expando]] = {};
		}
		d = data[el[expando]];
		if (value) {
			data[el[expando]][key] = value;
		} else {
			return data[el[expando]][key];
		}
	},
	/**
	 * Calls a function on the element and all parents of the element until the function returns
	 * false.
	 * @hide
	 * @param {Object} el
	 * @param {Object} func
	 */
	onParents: function (el, func) {
		var res;
		while (el && res !== false) {
			res = func(el);
			el = el.parentNode;
		}
		return el;
	},
	//regex to match focusable elements
	focusable: /^(a|area|frame|iframe|label|input|select|textarea|button|html|object)$/i,
	/**
	 * Returns if an element is focusable
	 * @hide
	 * @param {Object} elem
	 */
	isFocusable: function (elem) {
		var attributeNode;

		// IE8 Standards doesn't like this on some elements
		if (elem.getAttributeNode) {
			attributeNode = elem.getAttributeNode("tabIndex");
		}

		return this.focusable.test(elem.nodeName) ||
			(attributeNode && attributeNode.specified) &&
			syn.isVisible(elem);
	},
	/**
	 * Returns if an element is visible or not
	 * @hide
	 * @param {Object} elem
	 */
	isVisible: function (elem) {
		return (elem.offsetWidth && elem.offsetHeight) || (elem.clientWidth && elem.clientHeight);
	},
	/**
	 * Gets the tabIndex as a number or null
	 * @hide
	 * @param {Object} elem
	 */
	tabIndex: function (elem) {
		var attributeNode = elem.getAttributeNode("tabIndex");
		return attributeNode && attributeNode.specified && (parseInt(elem.getAttribute('tabIndex')) || 0);
	},
	bind: bind,
	unbind: unbind,
	/**
	 * @function syn.schedule schedule()
	 * @param {Function} fn Function to be ran
	 * @param {Number} ms Milliseconds to way before calling fn
	 * @signature `syn.schedule(fn, ms)`
	 * @parent config
	 *
	 * Schedules a function to be ran later.
	 * Must be registered prior to syn loading, otherwise `setTimeout` will be
	 * used as the scheduler.
	 * @codestart
	 * syn = {
	 *   schedule: function(fn, ms) {
	 *     Platform.run.later(fn, ms);
	 *   }
	 * };
	 * @codeend
	 */
	schedule: schedule,
	browser: browser,
	//some generic helpers
	helpers: {
		createEventObject: createEventObject,
		createBasicStandardEvent: function (type, defaults, doc) {
			var event;
			try {
				event = doc.createEvent("Events");
			} catch (e2) {
				event = doc.createEvent("UIEvents");
			} finally {
				event.initEvent(type, true, true);
				extend(event, defaults);
			}
			return event;
		},
		inArray: function (item, array) {
			var i = 0;
			for (; i < array.length; i++) {
				if (array[i] === item) {
					return i;
				}
			}
			return -1;
		},
		getWindow: function (element) {
			if (element.ownerDocument) {
				return element.ownerDocument.defaultView || element.ownerDocument.parentWindow;
			}
		},
		extend: extend,
		scrollOffset: function (win, set) {
			var doc = win.document.documentElement,
				body = win.document.body;
			if (set) {
				window.scrollTo(set.left, set.top);

			} else {
				return {
					left: (doc && doc.scrollLeft || body && body.scrollLeft || 0) + (doc.clientLeft || 0),
					top: (doc && doc.scrollTop || body && body.scrollTop || 0) + (doc.clientTop || 0)
				};
			}

		},
		scrollDimensions: function (win) {
			var doc = win.document.documentElement,
				body = win.document.body,
				docWidth = doc.clientWidth,
				docHeight = doc.clientHeight,
				compat = win.document.compatMode === "CSS1Compat";

			return {
				height: compat && docHeight ||
					body.clientHeight || docHeight,
				width: compat && docWidth ||
					body.clientWidth || docWidth
			};
		},
		addOffset: function (options, el) {
			var jq = syn.jquery(el),
				off;
			if (typeof options === 'object' && options.clientX === undefined && options.clientY === undefined && options.pageX === undefined && options.pageY === undefined && jq) {
				el = jq(el);
				off = el.offset();
				options.pageX = off.left + el.width() / 2;
				options.pageY = off.top + el.height() / 2;
			}
		}
	},
	// place for key data
	key: {
		ctrlKey: null,
		altKey: null,
		shiftKey: null,
		metaKey: null
	},
	//triggers an event on an element, returns true if default events should be run
	/**
	 * Dispatches an event and returns true if default events should be run.
	 * @hide
	 * @param {Object} event
	 * @param {Object} element
	 * @param {Object} type
	 * @param {Object} autoPrevent
	 */
	dispatch: function (event, element, type, autoPrevent) {

		// dispatchEvent doesn't always work in IE (mostly in a popup)
		if (element.dispatchEvent && event) {
			var preventDefault = event.preventDefault,
				prevents = autoPrevent ? -1 : 0;

			//automatically prevents the default behavior for this event
			//this is to protect agianst nasty browser freezing bug in safari
			if (autoPrevent) {
				bind(element, type, function ontype(ev) {
					ev.preventDefault();
					unbind(this, type, ontype);
				});
			}

			event.preventDefault = function () {
				prevents++;
				if (++prevents > 0) {
					preventDefault.apply(this, []);
				}
			};
			element.dispatchEvent(event);
			return prevents <= 0;
		} else {
			try {
				window.event = event;
			} catch (e) {}
			//source element makes sure element is still in the document
			return element.sourceIndex <= 0 || (element.fireEvent && element.fireEvent('on' + type, event));
		}
	},
	/**
	 * @attribute
	 * @hide
	 * An object of eventType -> function that create that event.
	 */
	create: {
		//-------- PAGE EVENTS ---------------------
		page: {
			event: function (type, options, element) {
				var doc = syn.helpers.getWindow(element)
					.document || document,
					event;
				if (doc.createEvent) {
					event = doc.createEvent("Events");

					event.initEvent(type, true, true);
					return event;
				} else {
					try {
						event = createEventObject(type, options, element);
					} catch (e) {}
					return event;
				}
			}
		},
		// unique events
		focus: {
			event: function (type, options, element) {
				syn.onParents(element, function (el) {
					if (syn.isFocusable(el)) {
						if (el.nodeName.toLowerCase() !== 'html') {
							syn.__tryFocus(el);
							activeElement = el;
						} else if (activeElement) {
							// TODO: The HTML element isn't focasable in IE, but it is
							// in FF.  We should detect this and do a true focus instead
							// of just a blur
							var doc = syn.helpers.getWindow(element)
								.document;
							if (doc !== window.document) {
								return false;
							} else if (doc.activeElement) {
								doc.activeElement.blur();
								activeElement = null;
							} else {
								activeElement.blur();
								activeElement = null;
							}

						}
						return false;
					}
				});
				return true;
			}
		}
	},
	/**
	 * @attribute support
	 * @hide
	 *
	 * Feature detected properties of a browser's event system.
	 * Support has the following properties:
	 *
	 *   - `backspaceWorks` - typing a backspace removes a character
	 *   - `clickChanges` - clicking on an option element creates a change event.
	 *   - `clickSubmits` - clicking on a form button submits the form.
	 *   - `focusChanges` - focus/blur creates a change event.
	 *   - `keypressOnAnchorClicks` - Keying enter on an anchor triggers a click.
	 *   - `keypressSubmits` - enter key submits
	 *   - `keyCharacters` - typing a character shows up
	 *   - `keysOnNotFocused` - enters keys when not focused.
	 *   - `linkHrefJS` - An achor's href JavaScript is run.
	 *   - `mouseDownUpClicks` - A mousedown followed by mouseup creates a click event.
	 *   - `mouseupSubmits` - a mouseup on a form button submits the form.
	 *   - `radioClickChanges` - clicking a radio button changes the radio.
	 *   - `tabKeyTabs` - A tab key changes tabs.
	 *   - `textareaCarriage` - a new line in a textarea creates a carriage return.
	 *
	 *
	 */
	support: {
		clickChanges: false,
		clickSubmits: false,
		keypressSubmits: false,
		mouseupSubmits: false,
		radioClickChanges: false,
		focusChanges: false,
		linkHrefJS: false,
		keyCharacters: false,
		backspaceWorks: false,
		mouseDownUpClicks: false,
		tabKeyTabs: false,
		keypressOnAnchorClicks: false,
		optionClickBubbles: false,
		ready: 0
	},
	/**
	 * @function syn.trigger trigger()
	 * @parent actions
	 * @signature `syn.trigger(element, type, options)`
	 * Creates a synthetic event and dispatches it on the element.
	 * This will run any default actions for the element.
	 * Typically you want to use syn, but if you want the return value, use this.
	 * @param {HTMLElement} element
	 * @param {String} type
	 * @param {Object} options
	 * @return {Boolean} true if default events were run, false if otherwise.
	 */
	trigger: function (element, type, options) {
		if (!options) {
			options = {};
		}

		var create = syn.create,
			setup = create[type] && create[type].setup,
			kind = key.test(type) ? 'key' : (page.test(type) ? "page" : "mouse"),
			createType = create[type] || {},
			createKind = create[kind],
			event, ret, autoPrevent, dispatchEl = element;

		//any setup code?
		if (syn.support.ready === 2 && setup) {
			setup(type, options, element);
		}

		autoPrevent = options._autoPrevent;
		//get kind
		delete options._autoPrevent;

		if (createType.event) {
			ret = createType.event(type, options, element);
		} else {
			//convert options
			options = createKind.options ? createKind.options(type, options, element) : options;

			if (!syn.support.changeBubbles && /option/i.test(element.nodeName)) {
				dispatchEl = element.parentNode; //jQuery expects clicks on select
			}

			//create the event
			event = createKind.event(type, options, dispatchEl);

			//send the event
			ret = syn.dispatch(event, dispatchEl, type, autoPrevent);
		}

		if (ret && syn.support.ready === 2 && syn.defaults[type]) {
			syn.defaults[type].call(element, options, autoPrevent);
		}
		return ret;
	},
	eventSupported: function (eventName) {
		var el = document.createElement("div");
		eventName = "on" + eventName;

		var isSupported = (eventName in el);
		if (!isSupported) {
			el.setAttribute(eventName, "return;");
			isSupported = typeof el[eventName] === "function";
		}
		el = null;

		return isSupported;
	}

});
/**
 * @Prototype
 */
extend(syn.init.prototype, {
	/**
	 * @function syn.then then()
	 * @parent chained
	 * <p>
	 * Then is used to chain a sequence of actions to be run one after the other.
	 * This is useful when many asynchronous actions need to be performed before some
	 * final check needs to be made.
	 * </p>
	 * <p>The following clicks and types into the <code>id='age'</code> element and then checks that only numeric characters can be entered.</p>
	 * <h3>Example</h3>
	 * @codestart
	 * syn('click', 'age', {})
	 *   .then('type','I am 12',function(){
	 *   equals($('#age').val(),"12")
	 * })
	 * @codeend
	 * If the element argument is undefined, then the last element is used.
	 *
	 * @param {String} type The type of event or action to create: "_click", "_dblclick", "_drag", "_type".
	 * @param {String|HTMLElement} [element] A element's id or an element.  If undefined, defaults to the previous element.
	 * @param {Object} options Optiosn to pass to the event.
	 
	 * @param {Function} [callback] A function to callback after the action has run, but before any future chained actions are run.
	 */
	then: function (type, element, options, callback) {
		if (syn.autoDelay) {
			this.delay();
		}
		var args = syn.args(options, element, callback),
			self = this;

		//if stack is empty run right away
		//otherwise ... unshift it
		this.queue.unshift(function (el, prevented) {

			if (typeof this[type] === "function") {
				this.element = args.element || el;
				this[type](this.element, args.options, function (defaults, el) {
					if (args.callback) {
						args.callback.apply(self, arguments);
					}
					self.done.apply(self, arguments);
				});
			} else {
				this.result = syn.trigger(args.element, type, args.options);
				if (args.callback) {
					args.callback.call(this, args.element, this.result);
				}
				return this;
			}
		});
		return this;
	},
	/**
	 * @function syn.delay delay()
	 * @parent chained
	 * Delays the next command a set timeout.
	 * @param {Number} [timeout]
	 * @param {Function} [callback]
	 */
	delay: function (timeout, callback) {
		if (typeof timeout === 'function') {
			callback = timeout;
			timeout = null;
		}
		timeout = timeout || 600;
		var self = this;
		this.queue.unshift(function () {
			schedule(function () {
				if (callback) {
					callback.apply(self, []);
				}
				self.done.apply(self, arguments);
			}, timeout);
		});
		return this;
	},
	done: function (defaults, el) {
		if (el) {
			this.element = el;
		}
		if (this.queue.length) {
			this.queue.pop()
				.call(this, this.element, defaults);
		}

	},
	/**
	 * @function syn.click click()
	 * @parent mouse
	 * @signature `syn.click(element, options, callback, force)`
	 * Clicks an element by triggering a mousedown,
	 * mouseup,
	 * and a click event.
	 * <h3>Example</h3>
	 * @codestart
	 * syn.click('create', {}, function(){
	 *   //check something
	 * })
	 * @codeend
	 * You can also provide the coordinates of the click.
	 * If jQuery is present, it will set clientX and clientY
	 * for you.  Here's how to set it yourself:
	 * @codestart
	 * syn.click(
	 *     'create',
	 *     {clientX: 20, clientY: 100},
	 *     function(){
	 *       //check something
	 *     })
	 * @codeend
	 * You can also provide pageX and pageY and syn will convert it for you.
	 * @param {HTMLElement} element
	 * @param {Object} options
	 * @param {Function} callback
	 */
	"_click": function (element, options, callback, force) {
		syn.helpers.addOffset(options, element);
		syn.trigger(element, "mousedown", options);

		//timeout is b/c IE is stupid and won't call focus handlers
		schedule(function () {
			syn.trigger(element, "mouseup", options);
			if (!syn.support.mouseDownUpClicks || force) {
				syn.trigger(element, "click", options);
				callback(true);
			} else {
				//we still have to run the default (presumably)
				syn.create.click.setup('click', options, element);
				syn.defaults.click.call(element);
				//must give time for callback
				schedule(function () {
					callback(true);
				}, 1);
			}

		}, 1);
	},
	/**
	 * @function syn.rightClick rightClick()
	 * @parent mouse
	 * @signature `syn.rightClick(element, options, callback)`
	 * Right clicks in browsers that support it (everyone but opera).
	 * @param {Object} element
	 * @param {Object} options
	 * @param {Object} callback
	 */
	"_rightClick": function (element, options, callback) {
		syn.helpers.addOffset(options, element);
		var mouseopts = extend(extend({}, syn.mouse.browser.right.mouseup), options);

		syn.trigger(element, "mousedown", mouseopts);

		//timeout is b/c IE is stupid and won't call focus handlers
		schedule(function () {
			syn.trigger(element, "mouseup", mouseopts);
			if (syn.mouse.browser.right.contextmenu) {
				syn.trigger(element, "contextmenu", extend(extend({}, syn.mouse.browser.right.contextmenu), options));
			}
			callback(true);
		}, 1);
	},
	/**
	 * @function syn.dblclick dblclick()
	 * @parent mouse
	 * @signature `syn.dblclick(element, options, callback)`
	 * Dblclicks an element.  This runs two [syn.click click] events followed by
	 * a dblclick on the element.
	 * <h3>Example</h3>
	 * @codestart
	 * syn.dblclick('open', {});
	 * @codeend
	 * @param {Object} options
	 * @param {HTMLElement} element
	 * @param {Function} callback
	 */
	"_dblclick": function (element, options, callback) {
		syn.helpers.addOffset(options, element);
		var self = this;
		this._click(element, options, function () {
			schedule(function () {
				self._click(element, options, function () {
					syn.trigger(element, "dblclick", options);
					callback(true);
				}, true);
			}, 2);

		});
	}
});

var actions = ["click", "dblclick", "move", "drag", "key", "type", 'rightClick'],
	makeAction = function (name) {
		syn[name] = function (element, options, callback) {
			return syn("_" + name, element, options, callback);
		};
		syn.init.prototype[name] = function (element, options, callback) {
			return this.then("_" + name, element, options, callback);
		};
	},
	i = 0;

for (; i < actions.length; i++) {
	makeAction(actions[i]);
}

module.exports = syn;


},{}],8:[function(require,module,exports){
/*syn@0.1.1#typeable*/
var syn = require('./synthetic');

// TODO: rename to focusable to be more accurate.

// Holds functions that test for typeability
var typeables = [];

// IE <= 8 doesn't implement [].indexOf.
// This shim was extracted from CoffeeScript:
var __indexOf = [].indexOf || function (item) {
		for (var i = 0, l = this.length; i < l; i++) {
			if (i in this && this[i] === item) {
				return i;
			}
		}
		return -1;
	};

/*
 * @function typeable
 * Registers a function that is used to determine if an
 * element can be typed into. The user can define as many
 * test functions as needed. By default there are 2 typeable
 * functions, one for inputs and textareas, and another
 * for contenteditable elements.
 *
 * @param {Function} fn Function to register.
 */
syn.typeable = function (fn) {
	if (__indexOf.call(typeables, fn) === -1) {
		typeables.push(fn);
	}
};

/*
 * @function test
 * Tests whether an element can be typed into using the test
 * functions registered by [syn.typeable typeable]. If any of the
 * test functions returns true, `test` will return true and allow
 * the element to be typed into.
 *
 * @param {HTMLElement} el the element to test.
 * @return {Boolean} true if the element can be typed into.
 */
syn.typeable.test = function (el) {
	for (var i = 0, len = typeables.length; i < len; i++) {
		if (typeables[i](el)) {
			return true;
		}
	}
	return false;
};

var type = syn.typeable;

// Inputs and textareas
var typeableExp = /input|textarea/i;
type(function (el) {
	return typeableExp.test(el.nodeName);
});

// Content editable
type(function (el) {
	return __indexOf.call(["", "true"], el.getAttribute("contenteditable")) !== -1;
});


},{"./synthetic":7}],9:[function(require,module,exports){
/*syn@0.1.1#syn*/
var syn = require('./synthetic');
require('./mouse.support');
require('./browsers');
require('./key.support');
require('./drag');

window.syn = syn;
module.exports = syn;


},{"./browsers":1,"./drag":2,"./key.support":4,"./mouse.support":6,"./synthetic":7}]},{},[9]);
