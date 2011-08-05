Object: Browser {#Browser}
==========================

Some browser properties are attached to the Browser Object for browser and platform detection.

Browser.Features {#Browser:Browser-Features}
--------------------------------------------

* Browser.Features.xpath - (*boolean*) True if the browser supports DOM queries using XPath.
* Browser.Features.air - (*boolean*)  True if the browser supports AIR.
* Browser.Features.query - (*boolean*) True if the browser supports querySelectorAll.
* Browser.Features.json - (*boolean*) True if the browser has a native JSON object.
* Browser.Features.xhr - (*boolean*) True if the browser supports native XMLHTTP object.

Browser.name {#Browser:Browser-name}
------------------------------------

'Browser.name' reports the name of the Browser as string, identical to the property names of the following Boolean values:

* Browser.ie - (*boolean*) True if the current browser is Internet Explorer.
* Browser.firefox - (*boolean*) True if the current browser is Firefox.
* Browser.safari - (*boolean*) True if the current browser is Safari.
* Browser.chrome - (*boolean*) True if the current browser is Chrome.
* Browser.opera - (*boolean*) True if the current browser is Opera.

In addition to one of the above properties a second property consisting of the name and the major version is provided ('Browser.ie6', 'Browser.chrome15', ...).

If 'Browser.chrome' is True, all other possible properties, like 'Browser.firefox', 'Browser.ie', ... , will be `undefined`.

### Example:

	alert(Browser.name); // Alerts "ie" in Internet Explorer, "firefox" in Mozilla Firefox, "chrome" in Google Chrome, "safari" or "opera".

	if (Browser.ie){
		// This code will only run in IE
	}

	if (Browser.firefox2){
		// This code will only run in Firefox 2
	}

	if (Browser.ie6 || Browser.ie7){
		// Please upgrade your browser
	}

If an IE document is set to backwards compatibility mode using the X-UA-Compatible header, then the Browser object is treated as if the earlier version of the browser is running.

Browser.version {#Browser:Browser-version}
------------------------------------------

'Browser.version' reports the version of the Browser as number.

### Example:

	alert(Browser.version); // Alerts '3.6' in FireFox 3.6.13

Browser.Platform {#Browser:Browser-Platform}
--------------------------------------------

* Browser.Platform.mac - (*boolean*) True if the platform is Mac.
* Browser.Platform.win - (*boolean*) True if the platform is Windows.
* Browser.Platform.linux - (*boolean*) True if the platform is Linux.
* Browser.Platform.ios - (*boolean*) True if the platform is iOS.
* Browser.Platform.android - (*boolean*) True if the platform is Android
* Browser.Platform.webos - (*boolean*) True if the platform is WebOS
* Browser.Platform.other - (*boolean*) True if the platform is neither Mac, Windows, Linux, Android, WebOS nor iOS.
* Browser.Platform.name - (*string*) The name of the platform.

Browser.Plugins {#Browser:Browser-Plugins}
------------------------------------------

* Browser.Plugins.Flash - (*object*) - An object with properties corresponding to the `version` and `build` number of the installed Flash plugin. Note: if flash is not installed, both `Browser.Plugins.Flash.version` and `Browser.Plugins.Flash.build` will return zero.
* Browser.Plugins.Flash.version - (*number*) The major version of the flash plugin installed.
* Browser.Plugins.Flash.build - (*number*) The build version of the flash plugin installed.

Browser.Request {#Browser:Browser-Request}
------------------------------------------

* Browser.Request - (*object*) The XMLHTTP object or equivalent.

Browser.exec {#Browser:Browser-exec}
------------------------------------

Executes the passed in string in the browser context.

### Example:

	Browser.exec('alert("Moo!");');

Deprecated {#Deprecated}
------------------------

The *Browser.Engine* object is deprecated since MooTools 1.3.

### Engine:

* Browser.Engine.trident - (*boolean*) True if the current browser uses the trident engine (e.g. Internet Explorer).
* Browser.Engine.gecko - (*boolean*) True if the current browser uses the gecko engine (e.g. Firefox, or any Mozilla Browser).
* Browser.Engine.webkit - (*boolean*) True if the current browser uses the webkit engine (e.g. Safari, Google Chrome, Konqueror).
* Browser.Engine.presto - (*boolean*) True if the current browser uses the presto engine (e.g. Opera 9).
* Browser.Engine.name - (*string*) The name of the engine.
* Browser.Engine.version - (*number*) The version of the engine. (e.g. 950)
