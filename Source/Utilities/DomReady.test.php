 <?php
// http://www.webcheatsheet.com/PHP/get_current_page_url.php
function curPageURL() {
	$pageURL = 'http';
	if ($_SERVER["HTTPS"] == "on") {$pageURL .= "s";}
	$pageURL .= "://";
	if ($_SERVER["SERVER_PORT"] != "80") {
		$pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
	} else {
		$pageURL .= $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
	}
	return $pageURL;
}

// http://forum.jquery.com/topic/implementation-of-domcontentloaded-failing-when-no-assets
// by andrea.giammarchi on 13-Jul-2008 10:21 PM
function flushPause($pause = 0){
    echo ob_get_clean();
    @ob_flush();
    flush();
    usleep($pause * 1000000);
}

ob_start();
ob_implicit_flush(false);
flushPause();
?>
<!DOCTYPE html>
<html>
<head>
<script>
var	START_TIME = +new Date
function isNotLoaded(){ return !!(window.PARSED && !window.ONLOAD) }
</script>
<script>

var Browser = {}

function log(message){
	try {
		console.log('' + message)
	}
	catch (e){}
}

document.addListener = function(type, fn){
	if (this.addEventListener) this.addEventListener(type, fn, false);
	else this.attachEvent('on' + type, fn);
	return this;
};

document.removeListener = function(type, fn){
	if (this.removeEventListener) this.removeEventListener(type, fn, false);
	else this.detachEvent('on' + type, fn);
	return this;
};

var domreadyCallbacks = []

window.fireEvent = 
document.fireEvent = function(type){
	if (type == 'domready')
	for (var i = 0; i < domreadyCallbacks.length; ++i){
		domreadyCallbacks[i]()
	}
}

window.addEvent = function(){}

function DomReady(fn){
	domreadyCallbacks.push(fn)
}

var Element = this.Element || {}
Element.Events = {}

<?php
// require dirname(__FILE__) . '/../../Packager/packager.php';
// 
// $pkg = new Packager(Array( dirname(__FILE__) . '/../..' ));
// echo $pkg->build(Array( 'DomReady' ), Array(), Array(), Array());
?>

document.write('<scr'+'ipt src="DomReady.js?_=' + (new Date) + '"><'+'/script>')
</script>

<script>
// window.addEvent('load', function(){
// 	window.LOADED = true
// 	somethingHappened('MooTools load', function(){
// 		return !!window.READY
// 	})
// })
// window.addEvent('domready', function(){
// 	window.READY = true
// 	somethingHappened('MooTools domready', isNotLoaded)
// })
DomReady(function(){
	window.READY = true
	somethingHappened('MooTools domready', isNotLoaded)
});
</script>
	<meta http-equiv=Content-type content="text/html; charset=utf-8">
	<title>DomReady Test</title>
<style>

iframe {
	position: absolute;
	top: 0px;
	right: 0px;
	height: 2000px;
	width: 500px;
}

body{
	padding-right:500px;
}

html.framed body{
	padding-right:0;
}

html.framed{
	background:#eee;
}

html, body, td, th{
	font: 11px "Lucida Grande", "Trebuchet MS", Verdana, sans-serif;
}
p{
	margin:0 !important;
	padding: 1ex 1em;
}

.PASS{background:#0f0;}
.FAIL{background:#f00;}

small{
	font-size: 9px;
}

</style>
<script>
var	MESSAGES = document.createElement('div')

thingsThatHappened = {}
function somethingHappened(id, result){
	if (window.ONLOAD) document.body.insertBefore(MESSAGES, document.body.firstChild)
	
	if (typeof result == 'function') result = result()
	if (result == null) result = ''
	if (result === true) result = 'PASS'
	if (result === false) result = 'FAIL'
	
	if (thingsThatHappened[id] === result) return
	thingsThatHappened[id] = result
	
	log((+new Date - START_TIME) +' '+ id + ' ' + result)
	
	MESSAGES.innerHTML
		+=	'<p id="' + id + '" class="' + result + '">'
		+	'<b>' + (+new Date - START_TIME) + 'ms </b>'
		+	id
		+	' '
		+	result
}

if (document.addEventListener) document.addEventListener('DOMContentLoaded', function(){ window.READY = true; somethingHappened('DOMContentLoaded (addEventListener)', isNotLoaded) }, false)
if (document.attachEvent) document.attachEvent('onDOMContentLoaded', function(){ window.READY = true; somethingHappened('DOMContentLoaded (attachEvent)', isNotLoaded) }, false)

if (document.addEventListener) document.addEventListener('readyStateChange', function(){ somethingHappened('readyStateChange (addEventListener)', document.readyState) }, false)
if (document.attachEvent) document.attachEvent('onReadyStateChange', function(){ somethingHappened('onReadyStateChange (attachEvent)', document.readyState) }, false)
if (document.attachEvent) document.attachEvent('onreadystatechange', function(){ somethingHappened('onreadystatechange (attachEvent)', document.readyState) }, false)


var TEST_ELEMENT = document.createElement('div')
function pollDoScroll(){
	if (!TEST_ELEMENT.doScroll) return
	var PASS
	
	try {
		TEST_ELEMENT.doScroll('left')
		PASS = true
	}
	catch (e){
		PASS = false
	}
	
	window.CANSCROLL = PASS
	somethingHappened('TEST_ELEMENT.doScroll()', PASS)
	
	if (!PASS) setTimeout(pollDoScroll, 10)
}

function pollDoScroll_body(){
	if (!document.body.doScroll) return
	var PASS
	
	try {
		document.body.doScroll('left')
		PASS = true
	}
	catch (e){
		PASS = false
	}
	
	somethingHappened('document.body.doScroll()', PASS)
	
	if (!PASS) setTimeout(pollDoScroll_body, 10)
}

var lastReadyState
function pollReadyState(){
	var readyState = document.readyState
	if (!readyState) return
	if (readyState == lastReadyState) return
	somethingHappened('poll document.readyState', readyState)
	if (readyState != 'complete' && readyState != 'loaded') setTimeout(pollReadyState, 10)
	lastReadyState = readyState
}

function pollBodyExists(){
	var	PASS
	
	try {
		document.body.lastChild
		PASS = true
	}
	catch (e){
		PASS = false
	}
	somethingHappened('body Exists?', PASS? 'YES':'NO')
	if (!window.ONLOAD) setTimeout(pollBodyExists, 10)
}

function pollAugmentBody(){
	var	PASS
	,	body = document.body
	,	root = body.parentNode
	,	sibling = body.nextSibling
	
	try {
		body.appendChild(document.createTextNode( new Date - START_TIME + 'ms:Body ') )
		PASS = true
	}
	catch (e){
		PASS = false
	}
	somethingHappened('can Augment Body?', PASS? 'YES':'NO')
	if (!window.ONLOAD) setTimeout(pollAugmentBody, 10)
}

// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //

var readyTests = {
	readyState: function(){return document.readyState}
	
	,'has body': function(){return document.body ?'Yes':'No'}
	
	,parsed: function(){return window.PARSED ?'Yes':'No'}
	,img_onload: function(){return window.IMG_ONLOAD ?'Yes':'No'}
	,img_onload_uncached: function(){return window.IMG_ONLOAD_UNCACHED ?'Yes':'No'}
	,ready: function(){return window.READY ?'Yes':'No'}
	,onload: function(){return window.ONLOAD ?'Yes':'No'}
	
	,"doScroll": function(){
		try {
			TEST_ELEMENT.doScroll()
			return 'Yes'
		}
		catch (e){
			return 'No'
		}
	}
	
	,"body.doScroll": function(){
		try {
			document.body.doScroll('left')
			return 'Yes'
		}
		catch (e){
			return 'No'
		}
	}
}

var readyTestResults = []

function poll(){
	var	results = {}
	,	lastResults = readyTestResults[readyTestResults.length - 1] || {}
	,	hasDifferentResults = 0
	
	results.ms = new Date - START_TIME
	
	for (var id in readyTests){
		results[id] = readyTests[id]()
		if (results[id] == lastResults[id]) continue
		
		++ hasDifferentResults
		somethingHappened(id, results[id])
	}
	
	var shouldBeReady
	
	if (window.CANSCROLL && this.window == this.top) shouldBeReady = true
	if ({loaded:1,complete:1}[document.readyState]) shouldBeReady = true
	if (window.LOADED) shouldBeReady = true
	if (window.IMG_ONLOAD_UNCACHED) shouldBeReady = true
	
	if (shouldBeReady)
	somethingHappened('Should be Ready!', function(){
		return window.READY ?true:'Not yet...'
	})
	
	if (hasDifferentResults) readyTestResults.push(results)
	if (!window.ONLOAD) setTimeout(poll, 10)
	else report()
}

function report(){
	var	EL = document.createElement('div')
	,	HTML = '<table class=results>'
	
	for (var i = 0; i < readyTestResults.length; ++i){
		if (i == 0){
			HTML += '<thead><tr>'
			for (var key in readyTestResults[i]){
				HTML += '<th>'
				HTML += key
				HTML += '</th>'
			}
			HTML += '</tr></thead>'
			continue
		}
		HTML += '<tr>'
		for (var key in readyTestResults[i]){
			HTML += '<td>'
			HTML += readyTestResults[i][key]
			HTML += '</td>'
		}
		HTML += '</tr>'
	}
	
	EL.innerHTML = HTML
	document.body.insertBefore(EL, document.body.firstChild)
}

poll()

</script>
</head>
<body
	onload="window.ONLOAD = true; somethingHappened('body[onload]', function(){return window.READY})"
	onDOMContentLoaded="window.READY = true; somethingHappened('DOMContentLoaded body[onDOMContentLoaded]', isNotLoaded)"
	onReadyStateChange="somethingHappened('body[onReadyStateChange]')"
>

<div>

<div id=thingsthathappened></div>

<hr>

<script> somethingHappened('before serverSide flush/sleep') </script>
<?php flushPause(1.0); ?>
<script> somethingHappened('after serverSide flush/sleep') </script>

<small>
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
</small>

<small>
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
</small>

<img height=16 width=16 onload="window.IMG_ONLOAD = true; somethingHappened('img[onload][src=about:blank]')" src="about:blank">
<img height=16 width=16 onload="window.IMG_ONLOAD = true; somethingHappened('img[onload][src=' + this.src + ']')" src="http://projects.subtlegradient.com/domready/big_image.jpg">
<script>document.write("<img height=16 width=16 onload=\"window.IMG_ONLOAD = true; window.IMG_ONLOAD_UNCACHED = true; somethingHappened('img[onload][src=' + this.src + ']')\" src=\"http://projects.subtlegradient.com/domready/big_image.jpg?_=" + +new Date + "\">")</script>

<!-- <script
	onload="window.SCRIPT_ONLOAD = true; somethingHappened('script[onload][src=about:blank]')"
	onreadystatechange="somethingHappened('script[src=about:blank][onreadystatechange]', this.readyState)"
	onerror="somethingHappened('script[src=about:blank][onerror]')"
	src="about:blank"></script> -->
<script
	onload="window.SCRIPT_ONLOAD = true; somethingHappened('script[onload]')"
	onreadystatechange="somethingHappened('script[onreadystatechange]', this.readyState)"
	src="http://projects.subtlegradient.com/domready/blank.js"></script>
<script
	onload="window.SCRIPT_ONLOAD = true; somethingHappened('script[onload][defer]')"
	onreadystatechange="somethingHappened('script[defer][onreadystatechange]', this.readyState)"
	defer src="http://projects.subtlegradient.com/domready/blank.js?123"></script>

</div>

<script>if (window != top) {somethingHappened('This is a frame!'); document.getElementsByTagName('html')[0].className += ' framed'} </script>
<?php if (!isset($_GET['iframe'])) echo '<iframe src="'.curPageURL().'?iframe=true"></iframe>'; ?>

<script>
somethingHappened('Last &lt;SCRIPT&gt; on page')
window.PARSED = true
</script>

</body>
</html>
<?php flushPause(); ?>
