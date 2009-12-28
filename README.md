MooTools Core
=============
This repository is for MooTools developers, not users.
All users should download MooTools from [MooTools.net](http://mootools.net "MooTools")

[See the MooTools Wiki for more information](http://github.com/mootools/mootools-core/wikis)


Compatibility
-------------

MooTools features a compatibility / upgrade helper script that helps you migrate from version to version. This script cannot fix everything, however, and therefore there are some breaking changes. Some of these are minor and will likely not affect you. Others are more troublesome if you are using the features that they affect.

### Breaking MooTools 1.1 > 1.2

Below are the breaking changes between 1.1 and 1.2 that the compatibility scripts cannot work around. Most of these changes are not likely to affect you.

* *$type(NaN)* returns "number" in 1.1; returns *false* in 1.2.
* *$type(window)* returns "object" in 1.1; returns "window" in 1.2.
* *$type(document)* returns "object" in 1.1; returns "document" in 1.2.
* *$type(hash)* returns "object" in 1.1; returns "hash" in 1.2.
* *"ILikeCookies".hyphenate()* returns "i-like-cookies" in 1.1; returns "-i-like-cookies" in 1.2.
* Element positioning is handled differently and more accurately in 1.2 and will likely return slightly different results than in 1.1 in some cases. Typically these differences cancel each other out, as you are passing the positioning values into other MooTools methods to set the position in some fashion. Theoretically, the more accurate and reliable positioning code should improve your results, but if you have code in place to deal with 1.1's deficiencies then you may find yourself with mixed results.
* In many cases methods that returned *null* now return *false* or vice versa. For example, *Cookie.get* returns *null* in 1.2 and *false* in 1.1
* Both Element.getCoordinates and Element.getPosition no longer take as their only argument an array of overflown (scrolled) elements for computing position but instead take a single element to get position values relative to. This change, in theory, won't affect your code, as the overflown elements your 1.11 code passes in are ignored, and the methods themselves find these overflown parents for you.
* Native objects (*String*, *Function*, etc) in 1.1 have an *extend* method that allows you to add properties to their prototypes. In 1.2, this method is called *implement* and *extend* does something different. In 1.2, *String.extend*, for example, adds properties to the *String* namespace, but not to all strings (i.e. it does not alter the *String* prototype). The compatibility layer attempts to handle this as gracefully as it can by behaving as it normally does (i.e. adding any properties you pass in to the *String* namespace) but also applying the properties to the prototype if those properties do not exist already. Most developers don't extend the native prototypes, so we don't anticipate this affecting many of you. Regardless, this change is not ideal, and it's far better for you to find your references to any call to the *extend* method on native objects and replace it with *implement* (the syntax is otherwise identical).