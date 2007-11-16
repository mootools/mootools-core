Class: Sortables {#Sortables}
=============================

Creates an interface for drag and drop sorting of a list or lists.

### Arguments:

1. list - required, the list or lists that will become sortable.
 * This argument can be an [Element](/Elements/Element), or array of [Elements](/Element/Element/Element#Elements). When a single list (or id) is passed, that list will be sortable only with itself.
 * To enable sorting between lists, one or more lists or id's must be passed using an array or an object. See Examples below.
2. options - an Object, see options and events below.

Options:

1. constrain - whether or not to constrain the element being dragged to its parent element. defaults to false.
2. clone - whether or not to display a copy of the actual element while dragging. defaults to true.
3. cloneOpacity - opacity of the place holding element
4. elementOpacity - opacity of the element being dragged for sorting
5. handle - a selector which be used to select the element inside each item to be used as a handle for sorting that item.  if no match is found, the element is used as its own handle.
6. revert - whether or not to use an effect to slide the element into its final location after sorting. If you pass an object it will be treated as true and used as aditional options for the revert effect. defaults to false.

### Events:

1. onStart - function executed when the item starts dragging
2. onComplete - function executed when the item ends dragging

### Example:

	var mySortables = new Sortables('list-1', {
		revert: { duration: 500, transition: Fx.Transitions.Elastic.easeOut }
	});
	//creates a new Sortable instance over the list with id 'list-1' with some extra options for the revert effect

	var mySortables = new Sortables(['list-1', 'list-2'], {
		constrain: true,
		clone: false,
		revert: true
	});
	//creates a new Sortable instance allowing the sorting of the lists with id's 'list-1' and 'list-2' with extra options
	//since constrain was set to false, the items will not be able to be dragged from one list to the other

	var mySortables = new Sortables(['list-1', 'list-2', 'list-3']);
	//creates a new Sortable instance allowing sorting between the lists with id's 'list-1', 'list-2, and 'list-3'
	(end)

Sortables Property: attach {#Sortables:attach}
----------------------------------------------

Attaches the mousedown event to all the handles, enabling sorting.

Sortables Property: attach {#Sortables:detach}
----------------------------------------------

Detaches the mousedown event from the handles, disabling sorting.

Sortables Property: serialize {#Sortables:serialize}
----------------------------------------------------

Function to get the order of the elements in the lists of this sortables instance.
For each list, an array containing the order of the elements will be returned.
If more than one list is being used, all lists will be serialized and returned in an array.

### Arguments:

1. index - int or false; index of the list to serialize. Omit or pass false to serialize all lists.
2. modifier - function to override the default output of the sortables.  See Examples below

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