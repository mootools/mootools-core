Selectors.Children {#Selectors-Children}
========================================

A custom Pseudo Selector for selecting ranges, and to access the children Elements with zero-based indexing.

### Usage:

Index Accessor {#Index-Accessor}
--------------------------------

	':children(n)'

### Variables:

* n - (*number*) An index number to access from the Element's children. The index, n, can be negative to access from the end of the children list.

###	Examples:

##### HTML

	<ul id="myID">
		<li>0</li><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li>
	</ul>

##### Javascript

	$$('#myID:children(2)')[0].innerHTML //returns 2

	$$('#myID:children(-3)')[0].innerHTML //returns 3


Range {#Range}
--------------

	':children(from:to)'

### Variables:

* from - (*number*) A starting index value. See the [Index Accessor][] usage.
* to   - (*number*) A ending index value.

###	Examples:

##### HTML

	<ul id="myID">
		<li>0</li><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li>
	</ul>

##### Javascript

	$$('#myID:children(2:4)').map(function(){ return this.innerHTML }); //returns [2,3,4]

	$$('#myID:children(-2:4)').map(function(){ return this.innerHTML }); //returns [4]

	$$('#myID:children(0:-3)').map(function(){ return this.innerHTML }); //returns [0,1,2,3]

rightOf Operation {#rightOf}
----------------------------

	':children(start+n)'

### Variables:

* start - (*number*) A starting index value. See the [Index Accessor][] usage.
* n     - (*number*) The number of Elements to the right of the starting Element. The number of Elements, n, may not be negative, however, in this usage.

### Examples:

##### HTML

	<ul id="myID">
		<li>0</li><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li>
	</ul>

##### Javascript

	$$('#myID:children(2+2)').map(function(){ return this.innerHTML }); //returns [2,3,4]

	$$('#myID:children(2+4))').map(function(){ return this.innerHTML }); //returns [0,2,3,4,5]

	$$('#myID:children(-1+3))').map(function(){ return this.innerHTML }); //returns [0,1,2,5]


leftOf Operation {#leftOf}
--------------------------

	':children(start-n)'

### Variables:

* start - (*number*) A starting index value. See the [Index Accessor][] usage.
* n     - (*number*) The number of Elements to the left of the starting Element. The number of Elements, n, may not be negative, however, in this usage.

### Examples:

##### HTML

	<ul id="myID">
		<li>0</li><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li>
	</ul>

##### Javascript

	$$('#myID:children(2-2)').map(function(){ return this.innerHTML }); //returns [0,1,2]

	$$('#myID:children(2-4))').map(function(){ return this.innerHTML }); //returns [0,1,2,4,5]

	$$('#myID:children(-1-3))').map(function(){ return this.innerHTML }); //returns [2,3,4,5]

### Notes:

- The n-right-of and the n-left-of usaged will "wrap" until the 'n' number of Elements have been matched.
- All "range" results will be ordered from least to greatest (relative to their indexes).



[Index Accessor]: #Index-Accessor