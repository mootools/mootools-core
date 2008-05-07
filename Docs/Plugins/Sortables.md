Class: Sortables {#Sortables}
=============================

Creates an interface for drag and drop sorting of a list or lists.

### Arguments:

1. list - (*mixed*) required, the list or lists that will become sortable.
 * This argument can be an [Element][], an array of [Elements][], or a selector. When a single list (or id) is passed, that list will be sortable only with itself.
 * To enable sorting between lists, one or more lists or id's must be passed using an array or a selector. See Examples below.
2. options - (*object*) See options and events below.

#### Options:

* constrain - (*boolean*: defaults to false) Whether or not to constrain the element being dragged to its parent element.
* clone     - (*mixed*: defaults to false) Whether or not to display a copy of the actual element under the cursor while dragging. May also be used as a function which will return an element to be used as the clone.  The function will receive the mousedown event, the element, and the list as arguments.
* handle    - (*string*: defaults to false) A selector to select an element inside each sortable item to be used as the handle for sorting that item.  If no match is found, the element is used as its own handle.
* opacity   - (*integer*: defaults to 1) Opacity of the place holding element
* revert    - (*mixed*: defaults to false) Whether or not to use an effect to slide the element into its final location after sorting. If you pass an object it will be used as additional options for the revert effect.
* snap      - (*integer*: defaults to 4) The number of pixels the element must be dragged for sorting to begin.

### Events:

* start    - function executed when the item starts dragging
* sort     - function executed when the item is inserted into a new place in one of the lists
* complete - function executed when the item ends dragging

### Examples:

	var mySortables = new Sortables('list-1', {
		revert: { duration: 500, transition: 'elastic:out' }
	});
	//creates a new Sortable instance over the list with id 'list-1' with some extra options for the revert effect

	var mySortables = new Sortables('#list-1, #list-2', {
		constrain: true,
		clone: false,
		revert: true
	});
	//creates a new Sortable instance allowing the sorting of the lists with id's 'list-1' and 'list-2' with extra options
	//since constrain was set to true, the items will not be able to be dragged from one list to the other

	var mySortables = new Sortables('#list-1, #list-2, #list-3');
	//creates a new Sortable instance allowing sorting between the lists with id's 'list-1', 'list-2, and 'list-3'
	(end)



Sortables Method: attach {#Sortables:attach}
--------------------------------------------

Attaches the mouse listener to all the handles, enabling sorting.

### Syntax:

	mySortables.attach();

### Returns:

* (*object*) This Sortables instance.



Sortables Method: detach {#Sortables:detach}
--------------------------------------------

Detaches the mouse listener from all the handles, disabling sorting.

### Syntax:

	mySortables.detach();

### Returns:

* (*object*) This Sortables instance.



Sortables Method: addItems {#Sortables:addItems}
------------------------------------------------

Allows one or more items to be added to an existing Sortables instance.

### Syntax:

	mySortables.addItems(item1[, item2[, item3[, ...]]]);

### Arguments:

1. items - (*mixed*) Since Array.flatten is used on the arguments, a single element, several elements, an array of elements, or any combination thereof may be passed to this method.

### Returns:

* (*object*) This Sortables instance.

### Examples:

	var mySortables = new Sortables('#list1, #list2');

	var element1 = new Element('div');
	var element2 = new Element('div');
	var element3 = new Element('div');

	$('list1').adopt(element1);
	$('list2').adopt(element2, element3);
	mySortables.addItems(element1, element2, element3);

### Notes:

- The items will not be injected into the list automatically as the sortable instance could have many lists.
- First inject the elements into the proper list, then call addItems on them.

### See Also:

- [Sortables:removeItems](#Sortables:removeItems), [Sortables:addLists](#Sortables:addLists)



Sortables Method: removeItems {#Sortables:removeItems}
------------------------------------------------------

Allows one or more items to be removed from an existing Sortables instance.

### Syntax:

	mySortables.removeItems(item1[, item2[, item3[, ...]]]);

### Arguments:

1. items - (*mixed*) Since Array.flatten is used on the arguments, a single element, several elements, an array of elements, or any combination thereof may be passed to this method.

### Returns:

* (*Elements*) An Elements collection of all the elements that were removed.

### Examples:

	var mySortables = new Sortables('#list1, #list2');

	var element1 = $('list1').getFirst();
	var element2 = $('list2').getLast();

	mySortables.removeItems(element1, element2).destroy(); //the elements will be removed and destroyed

### Notes:

- The items will not be removed from the list automatically, they will just no longer be sortable.
- First call removeItems on the items, and then remove them from their list containers, or destroy them.

### See Also:

- [Sortables:addItems](#Sortables:addItems), [Sortables:removeLists](#Sortables:removeLists)



Sortables Method: addLists {#Sortables:addLists}
------------------------------------------------

Allows one or more entire lists to be added to an existing Sortables instance, allowing sorting between the new and old lists.

### Syntax:

	mySortables.addLists(list1[, list2[, list3[, ...]]]);

### Arguments:

1. lists - (*mixed*) Since Array.flatten is used on the arguments, a single element, several elements, an array of elements, or any combination thereof may be passed to this method.

### Returns:

* (*object*) This Sortables instance.

### Examples:

	var mySortables = new Sortables('list1');
	mySortables.addLists($('list2'));

### Notes:

- More complicated usage of this method will allow you to do things like one-directional sorting.

### See Also:

- [Sortables:removeLists](#Sortables:removeLists), [Sortables:addItems](#Sortables:addItems)



Sortables Method: removeLists {#Sortables:removeLists}
------------------------------------------------------

Allows one or more entire lists to be removed from an existing Sortables instance, preventing sorting between the lists.

### Syntax:

	mySortables.removeLists(list1[, list2[, list3[, ...]]]);

### Arguments:

1. lists - (*mixed*) Since Array.flatten is used on the arguments, a single element, several elements, an array of elements, or any combination thereof may be passed to this method.

### Returns:

* (*Elements*) An Elements collection of all the lists that were removed.

### Examples:

	var mySortables = new Sortables('#list1, #list2');
	mySortables.removeLists($('list2'));

### See Also:

- [Sortables:addLists](#Sortables:addLists), [Sortables:removeItems](#Sortables:removeItems)



Sortables Method: serialize {#Sortables:serialize}
--------------------------------------------------

Function to get the order of the elements in the lists of this sortables instance.
For each list, an array containing the order of the elements will be returned.
If more than one list is being used, all lists will be serialized and returned in an array.

### Arguments:

1. index    - (*mixed*, optional) An integer or boolean false. index of the list to serialize. Omit or pass false to serialize all lists.
2. modifier - (*function*, optional) A function to override the default output of the sortables.  See Examples below

### Examples:

	mySortables.serialize(1);
	//returns the second list serialized (remember, arrays are 0 based...);
	//['item_1-1', 'item_1-2', 'item_1-3']

	mySortables.serialize();
	//returns a nested array of all lists serialized, or if only one list exists, that lists order
	/*[['item_1-1', 'item_1-2', 'item_1-3'],
	  ['item_2-1', 'item_2-2', 'item_2-3'],
	  ['item_3-1', 'item_3-2', 'item_3-3']]*/

	mySortables.serialize(2, function(element, index){
		return element.getProperty('id').replace('item_','') + '=' + index;
	}).join('&');
	//joins the array with a '&' to return a string of the formatted ids of all the elmements in list 3,with their position
	//'3-0=0&3-1=1&3-2=2'



[Element]: /Elements/Element
[Elements]: /Element/Element/Element#Elements