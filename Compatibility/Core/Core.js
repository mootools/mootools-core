/*
MooTools 1.2 Custom Backwards-Compatibility Library
By David Isaacson
Portions from Mootools 1.2 by the MooTools production team (http://mootools.net/developers/)
Copyright (c) 2006-2007 Valerio Proietti (http://mad4milk.net/)
Copyright (c) 2008 Siafoo.net

Cleaned up, shortened and logging added by Nathan White (http://www.nwhite.net)
*/

if(!window.console) var console = {};
if(!console.log) console.log = function(){};


// This is the definition from Mootools 1.2, with error handling
// to prevent an issue in IE where calling .item on an XML (non-HTML)
// element raises an error.
//
// We're using the 1.2 version in the first place because the compat version throws *other* weird errors sometimes
// Note that this will prevent you from using the $A(iterable, start, length) syntax allowed but undocumented (?) in Mootools 1.1 
function $A(iterable){
    var item
    try{
        item = iterable.item
    }
    catch(e){
        item = true
    }
    
    if (item){
        var array = [];
        for (var i = 0, l = iterable.length; i < l; i++) array[i] = iterable[i];
        return array;
    }
    return Array.prototype.slice.call(iterable);
}

function $extend(original, extended){
    if (!extended) {extended=original; original=this; console.warn('$extend requires two parameters'); } 
    for (var key in (extended || {})) original[key] = extended[key];
    return original;
}

(function(){
    var natives = [Array, Function, String, RegExp, Number];
    for (var i = 0, l = natives.length; i < l; i++) natives[i].extend =  natives[i].implement; // TODO
})();
