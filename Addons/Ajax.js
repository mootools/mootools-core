/*
Script: Ajax.js
	Contains the ajax class. Also contains methods to generate querystings from forms and Objects.
		
Dependencies:
	<Moo.js>, <Function.js>, <Array.js>, <String.js>, <Element.js>

Author:
	Valerio Proietti, <http://mad4milk.net>

License:
	MIT-style license.
*/

/*
Class: Ajax
	For all your asynchronous needs. Note: this class implements <Chain>

Arguments:
	url - the url pointing to the server-side script.
	options - optional, an object containing options.

Options:
	method - 'post' or 'get' - the prototcol for the request; optional, defaults to 'post'.
	postBody - if method is post, you can write parameters here. Can be a querystring, an object or a Form element.
	async - boolean: asynchronous option; true uses asynchronous requests. Defaults to true.
	onComplete - function to execute when the ajax request completes.
	onStateChange - function to execute when the state of the XMLHttpRequest changes.
	update - $(element) to insert the response text of the XHR into, upon completion of the request.
	evalScripts - boolean; default is false. Execute scripts in the response text onComplete.

Example:
	>var myAjax = new Ajax(url, {method: 'get'}).request();								
*/
	
var Ajax = ajax = new Class({

	setOptions: function(options){
		this.options = {
			method: 'post',
			postBody: null,
			async: true,
			onComplete: Class.empty,
			onStateChange: Class.empty,
			update: null,
			evalScripts: false
		};
		Object.extend(this.options, options || {});
	},
	
	initialize: function(url, options){
		this.setOptions(options);
		this.url = url;
		this.transport = this.getTransport();
	},
	
	/*
	Property: request
		Executes the ajax request.
			
	Example:
		>var myAjax = new Ajax(url, {method: 'get'});
		>myAjax.request();
		
		OR
		
		>new Ajax(url, {method: 'get'}).request();
	*/
	
	request: function(){
		this.transport.open(this.options.method, this.url, this.options.async);
		this.transport.onreadystatechange = this.onStateChange.bind(this);
		if (this.options.method == 'post'){
			this.transport.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			if (this.transport.overrideMimeType) this.transport.setRequestHeader('Connection', 'close');
		}
		switch($type(this.options.postBody)){
			case 'element': this.options.postBody = $(this.options.postBody).toQueryString(); break;
			case 'object': this.options.postBody = Object.toQueryString(this.options.postBody);
		}
		if($type(this.options.postBody) == 'string') this.transport.send(this.options.postBody);
		else this.transport.send(null);
		return this;
	},

	onStateChange: function(){
		this.options.onStateChange.delay(10, this);
		if (this.transport.readyState == 4 && this.transport.status == 200){
			if (this.options.update) $(this.options.update).setHTML(this.transport.responseText);
			this.options.onComplete.pass([this.transport.responseText, this.transport.responseXML], this).delay(20);
			if (this.options.evalScripts) this.evalScripts.delay(30, this);
			this.transport.onreadystatechange = Class.empty;
			this.callChain();
		}
	},
	
	/*  
	Property: evalScripts
		Executes scripts in the response text
	*/
	
	evalScripts: function(){
		if(scripts = this.transport.responseText.match(/<script[^>]*?>[\S\s]*?<\/script>/g)){
			scripts.each(function(script){
				eval(script.replace(/^<script[^>]*?>/, '').replace(/<\/script>$/, ''));
			});
		}
	},

	getTransport: function(){
		if (window.XMLHttpRequest) return new XMLHttpRequest();
		else if (window.ActiveXObject) return new ActiveXObject('Microsoft.XMLHTTP');
	}

});

Ajax.implement(new Chain);

/* Section: Object related Functions  */

/*  
Function: Object.toQuerySTring
	Generates a querysting from a key/pair values in an object
			
Arguments:
	source - the object to generate the querystring from.

Returns:
	the query string.
			
Example:
	>Object.toQueryString({apple: "red", lemon: "yellow"}); //returns "apple=red&lemon=yellow"
*/

Object.toQueryString = function(source){
	var queryString = [];
	for (var property in source) queryString.push(encodeURIComponent(property)+'='+encodeURIComponent(source[property]));
	return queryString.join('&');
};

/*
Class: Element
	Custom class to allow all of its methods to be used with any DOM element via the dollar function <$>.
*/

Element.extend({
	
	/*
	Property: send
		Sends a form with an ajax post request
			
	Arguments:
		options - option collection for ajax request. See <Ajax.initialize> for option list.
	
	Returns:
		The Ajax Class Instance
			
	Example:
		(start code)
		<form id="myForm" action="submit.php">
		<input name="email" value="bob@bob.com">
		<input name="zipCode" value="90210">
		</form>
		<script>
		$('myForm').send()
		</script>
		(end)
	*/
	
	send: function(options){
		options = Object.extend(options, {postBody: this.toQueryString(), method: 'post'});
		return new Ajax(this.getProperty('action'), options).request();
	},
	
	/*
	Property: toQueryString
		Reads the children inputs of the Element and generates a  query string, based on their values. Used internally in <Ajax>
			
	Example:
		(start code)
		<form id="myForm" action="submit.php">
		<input name="email" value="bob@bob.com">
		<input name="zipCode" value="90210">
		</form>

		<script>
		 $('myForm').toQueryString()
		</script>
		(end)

		Returns:
			email=bob@bob.com&zipCode=90210
	*/
	
	toQueryString: function(){
		var queryString = [];
		$A(this.getElementsByTagName('*')).each(function(el){
			var name = $(el).name;
			var value = el.getValue();
			if (value && name) queryString.push(encodeURIComponent(name)+'='+encodeURIComponent(value));
		});
		return queryString.join('&');
	}

});