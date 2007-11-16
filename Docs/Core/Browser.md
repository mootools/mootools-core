Browser.js
----------

Browser Contains Browser Initialization, including Window and Document, plus the Browser Hash.

### License:

MIT-style license.



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
* Browser.Engine.webkit420 - (*boolean*) True if the current browser is Safari3 (WebKit SVN Build)/WebKit after version 419.
* Browser.Engine.presto    - (*boolean*) True if the current browser is Opera.
* Browser.Engine.name      - (*string*) The name of the engine.

### Platform:

* Browser.Platform.mac     - (*boolean*) True if the platform is Mac.
* Browser.Platform.windows - (*boolean*) True if the platform is Windows.
* Browser.Platform.linux   - (*boolean*) True if the platform is Linux.
* Browser.Platform.other   - (*boolean*) True if the platform is neither Mac, Windows or Linux.
* Browser.Platform.name    - (*string*) The name of the platform.

### Notes:

- Engine detection is entirely feature-based.