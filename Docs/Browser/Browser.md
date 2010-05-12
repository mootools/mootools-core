Object: Browser {#Browser}
==========================

Some browser properties are attached to the Browser Object for browser and platform detection.

### Features:

* Browser.Features.xpath - (*boolean*) True if the browser supports DOM queries using XPath.
* Browser.Features.air - (*boolean*)  True if the browser supports AIR.
* Browser.Features.query - (*boolean*) True if the browser supports querySelectorAll.
* Browser.Features.json - (*boolean*) True if the browser has a native JSON object.
* Browser.Features.xhr - (*boolean*) True if the browser supports native XMLHTTP object.

### Request:

* Browser.Request - (*object*) The XMLHTTP object or equivalent.

### Name:

* Browser.ie - (*boolean*) True if the current browser is Internet Explorer.
* Browser.ie6 - (*boolean*) True if the current browser is Internet Explorer 6.
* Browser.ie7 - (*boolean*) True if the current browser is Internet Explorer 7.
* Browser.ie8 - (*boolean*) True if the current browser is Internet Explorer 8.
* Browser.firefox - (*boolean*) True if the current browser is Firefox
* Browser.firefox2 - (*boolean*) True if the current browser is Firefox 2
* Browser.firefox3 - (*boolean*) True if the current browser is Firefox 3
* Browser.safari - (*boolean*) True if the current browser is Safari
* Browser.safari3 - (*boolean*) True if the current browser is Safari 3
* Browser.safari4 - (*boolean*) True if the current browser is Safari 4
* Browser.chrome - (*boolean*) True if the current browser is Chrome

### Platform:

* Browser.Platform.mac - (*boolean*) True if the platform is Mac.
* Browser.Platform.win - (*boolean*) True if the platform is Windows.
* Browser.Platform.linux - (*boolean*) True if the platform is Linux.
* Browser.Platform.ipod - (*boolean*) True if the platform is an iPod touch / iPhone.
* Browser.Platform.other - (*boolean*) True if the platform is neither Mac, Windows, Linux nor iPod.
* Browser.Platform.name - (*string*) The name of the platform.

### Plugins:

* Browser.Plugins.Flash - (*boolean*) - True if Flash is present.

Deprecated
----------

The *Browser.Engine* object is deprecated since MooTools 1.3.

### Engine:

* Browser.Engine.trident - (*boolean*) True if the current browser uses the trident engine (e.g. Internet Explorer).
* Browser.Engine.gecko - (*boolean*) True if the current browser uses the gecko engine (e.g. Firefox, or any Mozilla Browser).
* Browser.Engine.webkit - (*boolean*) True if the current browser uses the webkit engine (e.g. Safari, Google Chrome, Konqueror).
* Browser.Engine.presto - (*boolean*) True if the current browser uses the presto engine (e.g. Opera 9).
* Browser.Engine.name - (*string*) The name of the engine.
* Browser.Engine.version - (*number*) The version of the engine. (e.g. 950)
* Browser.Plugins.Flash.version - (*number*) The major version of the flash plugin installed.
* Browser.Plugins.Flash.build - (*number*) The build version of the flash plugin installed.
