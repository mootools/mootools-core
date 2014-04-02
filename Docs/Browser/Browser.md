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

Browser.Request {#Browser:Browser-Request}
------------------------------------------

* Browser.Request - (*object*) The XMLHTTP object or equivalent.

Browser.exec {#Browser:Browser-exec}
------------------------------------

Executes the passed in string in the browser context.

### Example:

	Browser.exec('alert("Moo!");');

Browser.parseUA {#Browser:Browser-parseUA}
------------------------------------------

A function to parse a user agent string to an object, intended for informational or statistical purposes. If also passed a platform string, it will use that string in addition to the user agent to attempt to determine the platform.

The results of this function for the currently active user agent and platform strings are saved on the Browser object upon load. See below.

For more information regarding User Agent detection, please refer to the [Deprecated section](#Deprecated).

### Syntax:

	var parsed = Browser.parseUA(userAgentString[, platformString]);

### Arguments:

1. userAgentString - (*string*) A user agent string, like the one found in `window.navigator.userAgent`.
2. platformString - (*string*, optional) A platform string, like the one found in `window.navigator.platform`.

### Returns:

* (*object*) - An object containing information parsed from the strings passed.

### Examples:

	console.log(Browser.parseUA("Mozilla/5.0 (X11; Linux x86_64; rv:24.0) Gecko/20140319 Firefox/24.0 Iceweasel/24.4.0", "Linux x86_64"));

	// This logs: {name: "firefox", version: 24, platform: "linux"}

Browser.name {#Browser:Browser-name}
------------------------------------

'Browser.name' reports the name found in the Browser's userAgent string as string, intended for informational or statistical purposes. See [Browser.parseUA](#Browser:Browser-parseUA).

### Example:

	alert(Browser.name); // Alerts "ie" in Internet Explorer, "firefox" in Mozilla Firefox, "chrome" in Google Chrome, "safari" or "opera".

Browser.version {#Browser:Browser-version}
------------------------------------------

'Browser.version' reports the version found in the Browser's userAgent string as number, intended for informational and statistical purposes. See [Browser.parseUA](#Browser:Browser-parseUA).

### Example:

	alert(Browser.version); // Alerts '33' in Chrome 33.0.1750.152

Browser.platform {#Browser:Browser-platform}
--------------------------------------------

'Browser.platform' reports the platform found in the Browser's userAgent or platform string as string, intended for informational and statistical purposes. See [Browser.parseUA](#Browser:Browser-parseUA).

### Example:

	alert(Browser.platform); // Alerts 'mac' on OS X 10.9 Mavericks


Deprecated {#Deprecated}
========================

### User Agent detection

The features described below use user agent detection (either the userAgent string or platform string) to determine values or properties aimed at activating/deactivating functionality easily. You are encouraged to use other ways of reaching your goal, like feature detection (`Browser.Features`, your own or [has.js](https://github.com/phiggins42/has.js)), progressive enhancement (the act of having the least compatible features "on top", so the other features still work) and/or graceful degredation (building with all features, but tweaking to have non-compatible things "fall back").

#### See also:

- [MDN about Browser detection using the user agent](https://developer.mozilla.org/en-US/docs/Browser_detection_using_the_user_agent)

Browser[Browser.name] {#Browser:Browser-Browser-name}
-----------------------------------------------------

**Important note:** These properties are deprecated since MooTools 1.5, and are only available in the 1.4-compatibility version.

The name found in the Browser's userAgent string is stored as property names of the following Boolean values:

* Browser.ie - (*boolean*) True if the current browser is Internet Explorer.
* Browser.firefox - (*boolean*) True if the current browser is Firefox.
* Browser.safari - (*boolean*) True if the current browser is Safari.
* Browser.chrome - (*boolean*) True if the current browser is Chrome.
* Browser.opera - (*boolean*) True if the current browser is Opera.

In addition to one of the above properties a second property consisting of the name and the major version is provided ('Browser.ie6', 'Browser.chrome15', ...).

If 'Browser.chrome' is True, all other possible properties, like 'Browser.firefox', 'Browser.ie', ... , will be `undefined`.

### Example:

	if (Browser.ie){
		// This code will only run in IE
	}

	if (Browser.firefox24){
		// This code will only run in Firefox 24
	}

	if (Browser.ie6 || Browser.ie7){
		// Please upgrade your browser
	}

If an IE document is set to backward compatibility mode using the X-UA-Compatible header, then the Browser object is treated as if the earlier version of the browser is running.

### Special note about Browser.ie:

In the compatibility build, for IE&gt;=11, `Browser.ie` will remain `undefined`. See below:

The primary use of `Browser.ie` is activating "legacy code", such "legacy code" is no longer required in more recent versions of Internet Explorer (and may not even work anymore). Changing `Browser.ie == true` for modern IE (IE &gt;= 11) in the compatibility build would do more harm than good, even though it's technically correct. Since we did not want to break existing projects that have come to rely on `Browser.ie` not being true for the newer version(s) of IE, the compatibility build will not set `Browser.ie` for these versions of IE. However, `Browser.ie11` will work correctly and `Browser.name` will equal "ie".

Browser.Platform {#Browser:Browser-Platform}
--------------------------------------------

**Important note:** The *Browser.Platform* object is deprecated since MooTools 1.5, and is only available in the 1.4-compatibility version.

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

**Important note:** The *Browser.Plugins* object is deprecated since MooTools 1.5, and is only available in the 1.4-compatibility version.

* Browser.Plugins.Flash - (*object*) - An object with properties corresponding to the `version` and `build` number of the installed Flash plugin. Note: if flash is not installed, both `Browser.Plugins.Flash.version` and `Browser.Plugins.Flash.build` will return zero.
* Browser.Plugins.Flash.version - (*number*) The major version of the flash plugin installed.
* Browser.Plugins.Flash.build - (*number*) The build version of the flash plugin installed.

Browser.Engine {#Browser:Browser-Engine}
----------------------------------------

**Important note:** The *Browser.Engine* object is deprecated since MooTools 1.3, and is only available in the 1.2-compatibility version.

### Engine:

* Browser.Engine.trident - (*boolean*) True if the current browser uses the trident engine (e.g. Internet Explorer).
* Browser.Engine.gecko - (*boolean*) True if the current browser uses the gecko engine (e.g. Firefox, or any Mozilla Browser).
* Browser.Engine.webkit - (*boolean*) True if the current browser uses the webkit engine (e.g. Safari, Google Chrome, Konqueror).
* Browser.Engine.presto - (*boolean*) True if the current browser uses the presto engine (e.g. Opera 9).
* Browser.Engine.name - (*string*) The name of the engine.
* Browser.Engine.version - (*number*) The version of the engine. (e.g. 950)
