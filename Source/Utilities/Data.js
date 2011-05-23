/*
---

name: Data

description: Give elements easy access to HTML5 data-* attributes

license: MIT-style license.

credits:
  - TODO: credits

requires: [Element, Window, Document]

provides: Element.data

...
*/

(function(){

  /**
   * get/set html5 data attributes on elements.
   */
  [Element, Window, Document].invoke('implement', {

    /**
     * @example
     * <code>
     *   // Retrieve a piece of data defined by HTML5 data attribute
     *   $$('body').data('attrName');
     *
     *   // Store a piece of info on the body
     *   $$('body').data('doesItWork', 'yes');
     *
     *   // Retrieve a piece of info on the body
     *   var data = $$('body').data('doesItWork');
     * </code>
     */
    data: function(property, value) {
      // If no value set then assume we're trying to get the property.
      if(!value) {
        var retrieved = this.retrieve(property, value);
        // If no value stored for the property try to access a data-* attribute.
        if(!retrieved) {
          retrieved = this.get('data-' + property);
          // store the data attribute for retrieval later.
          if(retrieved) {
            this.store(property, retrieved);
          }
        }
        return retrieved;
      }
      else {
        this.store(property, value);
        // For consistency make sure the data- attribute is up-to-date.
        this.set('data-' + property, value);
        return this;
      }
    }

  });

})();

