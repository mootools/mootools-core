MooTools Core
=============
This repository is for MooTools developers, not users.
All users should download MooTools from [MooTools.net](http://mootools.net "MooTools")

[See the MooTools Wiki for more information](http://github.com/mootools/mootools-core/wikis)


Compatibility
-------------

MooTools features a compatibility / upgrade helper script that helps you migrate from version to version. This script cannot fix everything, however, and therefore there are some breaking changes. Some of these are minor and will likely not affect you. Others are more troublesome if you are using the features that they affect.

### Breaking MooTools 1.1 > 1.2

Below are the breaking changes between 1.1 and 1.2 that the compatibility scripts cannot work around.

#### Minor Breaking Changes

These changes are not likely to affect you.

* *$type(NaN)* returns "number" in 1.1; returns *false* in 1.2.
* *$type(window)* returns "object" in 1.1; returns "window" in 1.2.
* *$type(document)* returns "object" in 1.1; returns "document" in 1.2.
* *$type(hash)* returns "object" in 1.1; returns "hash" in 1.2.
* *"ILikeCookies".hyphenate()* returns "i-like-cookies" in 1.1; returns "-i-like-cookies" in 1.2.
* Element positioning is handled differently and more accurately in 1.2 and will likely return slightly different results than in 1.1 in some cases. Typically these differences cancel each other out, as you are passing the positioning values into other MooTools methods to set the position in some fashion. Theoretically, the more accurate and reliable positioning code should improve your results, but if you have code in place to deal with 1.1's deficiencies then you may find yourself with mixed results.
* In many cases methods that returned *null* now return *false* or vice versa. For example, *Cookie.get* returns *null* in 1.2 and *false* in 1.1
* Both Element.getCoordinates and Element.getPosition no longer take as their only argument an array of overflown (scrolled) elements for computing position but instead take a single element to get position values relative to. This change, in theory, won't affect your code, as the overflown elements your 1.11 code passes in are ignored, and the methods themselves find these overflown parents for you.
