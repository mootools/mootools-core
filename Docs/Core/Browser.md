Hash: Browser {#Browser}
========================

Some browser properties are attached to the Browser Object for browser and platform detection.

### Features:

* Browser.Features.xpath - (*boolean*) True if the browser supports DOM queries using XPath.
* Browser.Features.xhr - (*boolean*) True if the browser supports native XMLHTTP object.

### Engine:

* Browser.Engine.trident - (*boolean*) True if the current browser uses the trident engine (e.g. Internet Explorer).
* Browser.Engine.gecko - (*boolean*) True if the current browser uses the gecko engine (e.g. Firefox, or any Mozilla Browser).
* Browser.Engine.webkit - (*boolean*) True if the current browser uses the webkit engine (e.g. Safari, Google Chrome, Konqueror).
* Browser.Engine.presto - (*boolean*) True if the current browser uses the presto engine (e.g. Opera 9).
* Browser.Engine.name - (*string*) The name of the engine.
* Browser.Engine.version - (*number*) The version of the engine. (e.g. 950)
* Browser.Plugins.Flash.version - (*number*) The major version of the flash plugin installed.
* Browser.Plugins.Flash.build - (*number*) The build version of the flash plugin installed.

### Platform:

* Browser.Platform.mac - (*boolean*) True if the platform is Mac.
* Browser.Platform.win - (*boolean*) True if the platform is Windows.
* Browser.Platform.linux - (*boolean*) True if the platform is Linux.
* Browser.Platform.ipod - (*boolean*) True if the platform is an iPod touch / iPhone.
* Browser.Platform.other - (*boolean*) True if the platform is neither Mac, Windows, Linux nor iPod.
* Browser.Platform.name - (*string*) The name of the platform.

### Notes:

- Engine detection is entirely feature-based.
