/* 
Script: Function.js
	Contains Function prototypes, utility functions and Chain.

Dependencies: 
	<Moo.js>

Author:
	Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.

Credits:
	- Some functions are inspired by those found in prototype.js <http://prototype.conio.net/> (c) 2005 Sam Stephenson sam [at] conio [dot] net, MIT-style license
*/

/*
Class: Function
	A collection of The Function Object prototype methods.
*/

Function.extend({
	
	/*
	Property: pass
		Shortcut to create closures with arguments and bind.
	
	Returns:
		a function.
	
	Arguments:
		args - the arguments to pass to that function (array or single variable)
		bind - optional, the object that the "this" of the function will refer to.
	
	Example:
		>myFunction.pass([arg1, arg2], myElement);
	*/
	
	pass: function(args, bind){
		var fn = this;
		if ($type(args) != 'array') args = [args];
		return function(){
			return fn.apply(bind || fn._proto_ || fn, args);
		};
	},
	
	/*
	Property: bind
		method to easily create closures with "this" altered.
	
	Arguments:
		bind - optional, the object that the "this" of the function will refer to.
	
	Returns:
		a function.
	
	Example:
		>function myFunction(){
		>	this.setStyle('color', 'red');
		>	// note that 'this' here refers to myFunction, not an element
		>	// we'll need to bind this function to the element we want to alter
		>};
		>var myBoundFunction = myFunction.bind(myElement);
		>myBoundFunction(); // this will make the element myElement red.
	*/
	
	bind: function(bind){
		var fn = this;
		return function(){
			return fn.apply(bind, arguments);
		};
	},
	
	/*
	Property: bindAsEventListener
		cross browser method to pass event firer
	
	Arguments:
		bind - optional, the object that the "this" of the function will refer to.
	
	Returns:
		a function with the parameter bind as its "this" and as a pre-passed argument event or window.event, depending on the browser.
	
	Example:
		>function myFunction(event){
		>	alert(event.clientx) //returns the coordinates of the mouse..
		>};
		>myElement.onclick = myFunction.bindAsEventListener(myElement);
	*/
		
	bindAsEventListener: function(bind){
		var fn = this;
		return function(event){
			fn.call(bind, event || window.event);
			return false;
		};
	},
	
	/*
	Property: delay
		Delays the execution of a function by a specified duration.
	
	Arguments:
		ms - the duration to wait in milliseconds
		bind - optional, the object that the "this" of the function will refer to.
	
	Example:
		>myFunction.delay(50, myElement) //wait 50 milliseconds, then call myFunction and bind myElement to it
		>(function(){alert('one second later...')}).delay(1000); //wait a second and alert
	*/
	
	delay: function(ms, bind){
		return setTimeout(this.bind(bind || this._proto_ || this), ms);
	},
	
	/*
	Property: periodical
		Executes a function in the specified intervals of time
		
	Arguments:
		ms - the duration of the intervals between executions.
		bind - optional, the object that the "this" of the function will refer to.
	*/
	
	periodical: function(ms, bind){
		return setInterval(this.bind(bind || this._proto_ || this), ms);
	}

});

/* Section: Utility Functions  */

/*
Function: $clear
	clears a timeout or an Interval.

Returns:
	null

Arguments:
	timer - the setInterval or setTimeout to clear.

Example:
	>var myTimer = myFunction.delay(5000); //wait 5 seconds and execute my function.
	>myTimer = $clear(myTimer); //nevermind

See also:
	<Function.delay>, <Function.periodical>
*/

function $clear(timer){
	clearTimeout(timer);
	clearInterval(timer);
	return null;
};

/*
Function: $type
	Returns the type of object that matches the element passed in.

Arguments:
	obj - the object to inspect.

Example:
	>var myString = 'hello';
	>$type(myString); //returns "string"

Returns:
	'function' - if obj is a function
	'textnode' - if obj is a node but not an element
	'element' - if obj is a DOM element
	'array' - if obj is an array
	'object' - if obj is an object
	'string' - if obj is a string
	'number' - if obj is a number
	false - (boolean) if the object is not defined or none of the above, or if it's an empty string.
*/
	
function $type(obj){
	if (!obj) return false;
	var type = false;
	if (obj instanceof Function) type = 'function';
	else if (obj.nodeName){
		if (obj.nodeType == 3 && !/\S/.test(obj.nodeValue)) type = 'textnode';
		else if (obj.nodeType == 1) type = 'element';
	}
	else if (obj instanceof Array) type = 'array';
	else if (typeof obj == 'object') type = 'object';
	else if (typeof obj == 'string') type = 'string';
	else if (typeof obj == 'number' && isFinite(obj)) type = 'number';
	return type;
};

/*Class: Chain*/

var Chain = new Class({
	
	/*
	Property: chain
		adds a function to the Chain instance stack.
		
	Arguments:
		fn - the function to append.
	
	Returns:
		the instance of the <Chain> class.
	
	Example:
		>var myChain = new Chain();
		>myChain.chain(myFunction).chain(myFunction2);
	*/
	
	chain: function(fn){
		this.chains = this.chains || [];
		this.chains.push(fn);
		return this;
	},
	
	/*
	Property: callChain
		Executes the first function of the Chain instance stack, then removes it. The first function will then become the second.

	Example:
		>myChain.callChain(); //executes myFunction
		>myChain.callChain(); //executes myFunction2
	*/
	
	callChain: function(){
		if (this.chains && this.chains.length) this.chains.splice(0, 1)[0].delay(10, this);
	},

	/*
	Property: clearChain
		Clears the stack of a Chain instance.
	*/
	
	clearChain: function(){
		this.chains = [];
	}

});