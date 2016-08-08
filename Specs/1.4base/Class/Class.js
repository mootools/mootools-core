/*
---
name: Class Specs
description: n/a
requires: [Core/Class]
provides: [Class.Specs]
...
*/

(function(){

var Attributes = new Class({

    properties: {
        a: 'str',
        b: [0, 1, 2],
        c: {}
    },

    color: function(){
        return 'attributes:color:' + this.name;
    },

    size: function(){
        return 'attributes:size:' + this.name;
    }

});


describe('Class creation 1.4', function(){

    it('should not alter properties of an object that is a property of the Class', function(){
        var attributes = new Attributes(),
            keys = Object.keys(attributes.properties);

        expect(keys[0]).toEqual('a');
        expect(keys[1]).toEqual('b');
        expect(keys[2]).toEqual('c');
    });

});

})();