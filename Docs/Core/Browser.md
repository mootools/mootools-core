Hash: Browser {#Browser}
========================

Some browser properties are attached to the Browser Object for browser and platform detection.

### Features:

* Browser.Features.xpath - (*boolean*) True if the browser supports DOM queries using XPath.
* Browser.Features.xhr   - (*boolean*) True if the browser supports native XMLHTTP object.

### Engine:

* Browser.Engine.trident   - (*boolean*) True if the current browser is Internet Explorer (any).
* Browser.Engine.trident4  - (*boolean*) True if the current browser is Internet Explorer 6.
* Browser.Engine.trident5  - (*boolean*) True if the current browser is Internet Explorer 7.
* Browser.Engine.gecko     - (*boolean*) True if the current browser is Mozilla/Gecko.
* Browser.Engine.webkit    - (*boolean*) True if the current browser is Safari/Konqueror.
* Browser.Engine.webkit419 - (*boolean*) True if the current browser is Safari2/WebKit before version 419.
* Browser.Engine.webkit420 - (*boolean*) True if the current browser is Safari3.0/WebKit version 420.
* Browser.Engine.webkit525 - (*boolean*) True if the current browser is Safari3.1/WebKit after version 525.
* Browser.Engine.presto    - (*boolean*) True if the current browser is Opera.
* Browser.Engine.presto925 - (*boolean*) True if the current browser is Opera before or equal version 9.25.
* Browser.Engine.presto950 - (*boolean*) True if the current browser is Opera major or equal version 9.50.
* Browser.Engine.name      - (*string*) The name of the engine.
* Browser.Plugins.Flash.version - (*number*) The major version of the flash plugin installed.
* Browser.Plugins.Flash.build - (*number*) The build version of the flash plugin installed.

### Platform:

* Browser.Platform.mac   - (*boolean*) True if the platform is Mac.
* Browser.Platform.win   - (*boolean*) True if the platform is Windows.
* Browser.Platform.linux - (*boolean*) True if the platform is Linux.
* Browser.Platform.ipod  - (*boolean*) True if the platform is an iPod touch / iPhone.
* Browser.Platform.other - (*boolean*) True if the platform is neither Mac, Windows, Linux, or iPod.
* Browser.Platform.name  - (*string*) The name of the platform.

### Notes:

- Engine detection is entirely feature-based.
