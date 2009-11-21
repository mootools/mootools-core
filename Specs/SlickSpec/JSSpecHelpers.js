function $try(){
	for (var i = 0, l = arguments.length; i < l; i++){
		try {
			return arguments[i]();
		} catch(e){}
	}
	return null;
};

Function.prototype._type = "Function";

String.escapeSingle = String.escapeSingle || function escapeSingle(string){
	return (''+string).replace(/(?=[\\\n'])/g,'\\');
};


var global = this;
global.context = this;
var specs, spec, it, its;
var descriptionParent = '';
var uniquespecs = {};

function Describe(description,specBuilder){
	// Backup existing object so we don't override it
	var old_specs = specs;
	specs = spec = it = its = {};
	
	// Inherit the before and afters of your forefathers
	if (old_specs) {
		if (old_specs.before      ) specs.before      = old_specs.before;
		if (old_specs.before_all  ) specs.before_all  = old_specs.before_all;
		if (old_specs.before_each ) specs.before_each = old_specs.before_each;
		if (old_specs.after       ) specs.after       = old_specs.after;
		if (old_specs.after_all   ) specs.after_all   = old_specs.after_all;
		if (old_specs.after_each  ) specs.after_each  = old_specs.after_each;
	}
	
	// Inherit the description of your forefathers
	description = descriptionParent + (descriptionParent ? ': ' : '') + String(description);
	var old_descriptionParent = descriptionParent;
	descriptionParent = description;
	
	// Build the spec object
	specBuilder(specs,global.context);
	
	// Create the tests and go!
	var spec_count = 0;
	var specnames = [];
	for (var specname in specs){
		if (/^(before|after)[_ ](all|each)$/.test(specname)) continue;
		if (!specs[specname]) continue;
		spec_count++;
		specnames.push(description+specname);
	}
	if (spec_count && !uniquespecs[specnames]){
		describe(description, specs);
		uniquespecs[specnames] = true;
	}
	
	// Reset
	descriptionParent = old_descriptionParent;
	specs = spec = it = its = old_specs;
};


global.mocks = {};
var Mock = (function(){
	
	function Mock(mockName, testBuilder){
		if (mockName && !testBuilder) throw new Error("Invalid mockName, Mock syntax: `new Mock(/mockName/, function(specs, window){})`");
		
		if (Object.prototype.toString.call(mockName) != '[object RegExp]')
			mockName = new RegExp(mockName);
		
		this.mockName = mockName;
		this.testBuilder = testBuilder;
		Mock.mocks.push(this);
	};
	
	Mock.mocks = [];
	
	Mock.prototype.run = function(){
		var globalContextOld = global.context;
		for (var mockName in global.mocks) if (this.mockName.test(mockName)) {
			
			global.context = global.mocks[mockName];
			for (var i = 0, l = global.willDefineEverywhere.length; i  < l; i++) {
				try {
					global.willDefineEverywhere[i](global.context);
				} finally {
					continue;
				}
			}
			Describe(mockName,this.testBuilder);
			
		}
		global.context = globalContextOld;
	};
	
	Mock.register = function(name, window){
		clearTimeout(Mock.register.delay);
		global.mocks[name] = window;
		Mock.register.delay = setTimeout(Mock.register.done, 1000);
	};

	Mock.register.done = function(){
		for (var i=0; i < Mock.mocks.length; i++){
			try {
				Mock.mocks[i].run();
			} finally {
				continue;
			}
		}
		
		global.runSpecs();
	};
	
	
	return Mock;
})();

Mock.Request = function(mockName, url){
	if (!this instanceof Mock.Request) throw new Error('Mock.Request is not callable directly. Must use `new Mock.Request`');
	
	this.mockName = mockName;
	this.url = url;
	
	var self = this;
	this.callback = function(html, xml){
		Mock.register(self.mockName +': '+ String(self.url).replace(/^.*\//,''), newFakeWinFromDoc(xml));
	};
	this.rq = new SimpleRequest();
	this.rq.send(this.url, this.callback);
};

global.willDefineEverywhere = [];
Mock.defineEverywhere = function(definer){
	global.willDefineEverywhere.push(definer);
}

var TODO = function(){ throw "TODO: This test has not be written yet"; };

if(typeof JSSpec == 'undefined') var JSSpec = {};
if(!JSSpec.Browser) JSSpec.Browser = {};
JSSpec.Browser.NativeConsole = !!(('console' in this) && ('log' in console) && ('toString' in console.log) && console.log.toString().match(/\[native code\]/));
JSSpec.Browser.Trident = (JSSpec.Browser.Trident && !JSSpec.Browser.NativeConsole);

// Stop the normal JSSpec onload from firing yet
var runSpecs_actually = window.onload;
// console.time('runSpecs');
var runSpecs = function(){
	// console.timeEnd('runSpecs');
	// console.time('runSpecs');
	// console.log('runSpecs');
	clearTimeout(global.runSpecs_timer);
	global.runSpecs_timer = setTimeout(runSpecs_actually, 1000);
};
window.onload = function(){
	window.loaded = true;
	// setTimeout(runSpecs, 100);
};


// XML
// from http://www.webreference.com/programming/javascript/definitive2/
/**
 * Create a new Document object. If no arguments are specified,
 * the document will be empty. If a root tag is specified, the document
 * will contain that single root tag. If the root tag has a namespace
 * prefix, the second argument must specify the URL that identifies the
 * namespace.
 */ 
var newXMLDocument = (document.implementation && document.implementation.createDocument)
? function(rootTagName, namespaceURL){
	return document.implementation.createDocument(namespaceURL||'', rootTagName||'', null); 
}
: function(rootTagName, namespaceURL){
	if (!rootTagName) rootTagName = ""; 
	if (!namespaceURL) namespaceURL = ""; 
	// This is the IE way to do it 
	// Create an empty document as an ActiveX object 
	// If there is no root element, this is all we have to do 
	var doc = new ActiveXObject("MSXML2.DOMDocument"); 
	// If there is a root tag, initialize the document 
	if (rootTagName) { 
		// Look for a namespace prefix 
		var prefix = ""; 
		var tagname = rootTagName; 
		var p = rootTagName.indexOf(':'); 
		if (p != -1) { 
			prefix = rootTagName.substring(0, p); 
			tagname = rootTagName.substring(p+1); 
		} 
		// If we have a namespace, we must have a namespace prefix 
		// If we don't have a namespace, we discard any prefix 
		if (namespaceURL) { 
			if (!prefix) prefix = "a0"; // What Firefox uses 
		} 
		else prefix = ""; 
		// Create the root element (with optional namespace) as a 
		// string of text 
		var text = "<" + (prefix?(prefix+":"):"") +	 tagname + 
		(namespaceURL 
			?(" xmlns:" + prefix + '="' + namespaceURL +'"') 
		:"") + 
		"/>"; 
		// And parse that text into the empty document 
		doc.loadXML(text); 
	} 
	return doc; 
}; 

/**
 * Synchronously load the XML document at the specified URL and
 * return it as a Document object
 */
var loadXML = function(url) {
	// Create a new document with the previously defined function
	var xmldoc = newXMLDocument();
	xmldoc.async = false;  // We want to load synchronously
	xmldoc.load(url);	   // Load and parse
	return xmldoc;		   // Return the document
};

/**
 * Parse the XML document contained in the string argument and return
 * a Document object that represents it.
 */
var parseXML = (function(){
	
	// Mozilla, Firefox, and related browsers
	if (typeof DOMParser != "undefined")
	return function(rawXML){
		return (new DOMParser()).parseFromString(rawXML, "application/xml");
	};
	
	// Internet Explorer.
	if (typeof ActiveXObject != "undefined")
	return function(rawXML){
		var xmlDocument = new ActiveXObject("Microsoft.XMLDOM");
		xmlDocument.async = false;
		xmlDocument.loadXML(rawXML);
		
		if (xmlDocument.parseError && xmlDocument.parseError.errorCode)
			xmlDocument.loadXML(rawXML.replace(/<!DOCTYPE[^>]*?>/i,''));
		
		if (xmlDocument.parseError && xmlDocument.parseError.errorCode)
		throw new Error([''
			,("Error code: " + xmlDocument.parseError.errorCode)
			,("Error reason: " + xmlDocument.parseError.reason)
			,("Error line: " + xmlDocument.parseError.line)
			,rawXML
		].join('\n'));
		
		return xmlDocument;
	};
	
	// As a last resort, try loading the document from a data: URL
	// This is supposed to work in Safari. Thanks to Manos Batsis and
	// his Sarissa library (sarissa.sourceforge.net) for this technique.
	return function(rawXML){
		var url = "data:text/xml;charset=utf-8," + encodeURIComponent(rawXML);
		var request = new XMLHttpRequest();
		request.open("GET", url, false);
		request.send(null);
		return request.responseXML;
	};
	
})();


function getXML(url,mime){
	if (!mime && url && /\.(svg|xml|xhtml)/i.test(url))
		mime = 'text/xml';
	
	var request;
	if (XMLHttpRequest != undefined)
		request = new XMLHttpRequest();
	else
		request = new ActiveXObject("Microsoft.XMLHTTP");
	
	request.open("GET", url, false);
	if (mime && request.overrideMimeType) request.overrideMimeType(mime);
	request.send(null);
	return request;
	return request.responseXML || parseXML(request.responseText);
	
};


function newFakeWinFromDoc(document){
	var fakeWin = { fake:true };
	fakeWin.document = document;
	// fakeWin.document = getXML('/test/tools/MooTools_Logo.svg');
	// fakeWin.document = loadXML('tools/MooTools_Logo.svg');
	// fakeWin.document = document.getElementById('svg_logo_data_island').document;
	// fakeWin.document = parseXML('<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" id="MooTools_Logo" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve"><style type="text/css"><![CDATA[#Tools { fill : #949494; }#Moo, #L { fill : #2A2A2A; }]]></style><g id="MooTools"><g id="Moo"><path id="M" d="M125.088,203.521l3.903-66.119c0.447-7.272-6.365-13.168-13.494-13.168 s-14.396,5.896-14.842,13.168l-3.903,66.119H70.34l3.903-66.119c0.446-7.272-7.139-13.497-14.268-13.497 c-7.128,0-13.621,6.224-14.067,13.497l-3.903,66.119H16.686l6.327-100.854h19.361c5.186-2.681,11.832-4.204,17.892-4.204 c11.246,0,22.651,5.22,28.805,13.413c7.159-8.193,16.685-13.413,27.931-13.413c20.042,0,38.635,16.574,37.38,37.02l-4.176,68.038 H125.088z"/><path id="O" d="M227.522,187.858c-11.484,10.17-24.632,15.253-39.442,15.249 c-14.694-0.004-27.082-5.094-37.163-15.271c-9.829-10.402-14.255-22.692-13.278-36.867c0.985-14.288,7.108-26.631,18.371-37.03 c11.483-10.171,24.572-15.253,39.266-15.249c14.812,0.004,27.258,5.093,37.339,15.269c9.83,10.405,14.251,22.751,13.267,37.039 C244.905,165.172,238.786,177.459,227.522,187.858L227.522,187.858z M214.042,130.595c-5.422-5.603-12.22-8.406-20.398-8.408 c-8.177-0.003-15.422,2.797-21.734,8.397c-6.202,5.715-9.573,12.516-10.117,20.403c-0.544,7.889,1.889,14.692,7.304,20.41 c5.54,5.604,12.399,8.404,20.576,8.407c8.177,0.003,15.361-2.796,21.556-8.396c6.319-5.716,9.752-12.519,10.296-20.406 C222.068,143.116,219.572,136.314,214.042,130.595L214.042,130.595z"/><use xlink:href="#O" x="91.37" /></g><g id="Tools"><path id="T" d="M469.423,98.331l-1.57,22.859h-85.685l-2.843,41.408c-0.849,12.352,2.383,16.424,12.221,16.424 c4.814,0,9.171,0.014,9.171,0.014l-1.341,23.274c0,0-9.587-0.05-17.75-0.05c-9.421,0-17.168-3.027-21.624-8.262 c-5.041-5.861-6.92-15.072-5.999-28.471l1.785-44.339h-13.395l1.57-22.859L469.423,98.331L469.423,98.331z"/><use xlink:href="#O" x="273.478" /><use xlink:href="#O" x="364.934" /><path id="L" d="M676.194,94.185c-0.427-14.357-23.928-28.556-23.928-28.556l-4.106,0.987l7.701,22.652 c0,0-0.213,6.14-6.333,7.911c-6.119,1.772-10.41-2.811-10.41-2.811l-6.004-22.748l-4.254,1.751c0,0-11.687,31.459-10.13,35.383 c2.228,10.152,8.763,19.051,9.499,34.381c0.736,15.329-9.942,50.875-10.978,60.084c-1.034,9.21,7.069,16.527,15.058,16.734 s15.757-6.582,15.991-13.98c0.235-7.398-0.562-43.084,1.339-58.836C651.543,131.386,676.62,108.541,676.194,94.185z  M633.087,212.549c-4.286,0.24-7.955-3.041-8.195-7.33c-0.239-4.288,3.04-7.959,7.326-8.199s7.954,3.042,8.195,7.33 C640.652,208.639,637.373,212.31,633.087,212.549z"/><path id="S" d="M685.639,183.224c0,0-6.281,7.173-14.436,17.089c16.747,11.898,39.931,14.514,54.724-1.746 c4.312-4.736,12.999-16.967,3.743-34.596c-9.255-17.628-33.862-26.104-25.837-37.344c6.08-8.513,21.438-0.832,27.451,5.181 c2.423-2.204,10.114-9.64,13.642-13.827c-16.314-20.394-51.276-22.47-63.328-1.166c-19.93,35.229,37.275,51.109,26.337,67.658 C700.7,195.417,685.639,183.224,685.639,183.224z"/></g></g></svg>');
	
	fakeWin.SELECT = function(context, expression){
		return global.SELECT.call(fakeWin, context, expression);
	};
	// if (fakeWin.document) fakeWin.document.search = function(expression){
	// 	return SELECT(fakeWin.document, expression);
	// };
	
	return fakeWin;
};

