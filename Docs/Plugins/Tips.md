Class: Tips {#Tips}
===================

Display a tip on any element with a title and/or href.

### Credits:

The idea behind Tips.js is based on Bubble Tooltips (<http://web-graphics.com/mtarchive/001717.php>) by Alessandro Fulcitiniti <http://web-graphics.com/>

### Note:

Tips requires an XHTML doctype.

### Implements:

[Events](/Class/Class.Extras#Events), [Options]()

### Arguments:

1. elements - (mixed) A collection of elements, a string Selector, or an Element to apply the tooltips to on mouseover.
2. options  - (object) An object to customize this Tips instance.

### Options:

* maxTitleChars - (number: defaults to 30) The maximum number of characters to display in the title of the tip.
* showDelay     - (number: defaults to 100) The delay the onShow method is called.
* hideDelay     - (number: defaults to 100) The delay the onHide method is called.
* className     - (string: defaults to 'tool') The prefix for your tooltip classNames.
 * The whole tooltip will have as classname: tool-tip
 * The title will have as classname: tool-title
 * The text will have as classname: tool-text
* offsets       - (object: defaults to {'x': 16, 'y': 16}) The distance of your tooltip from the mouse.
* fixed         - (boolean: defaults to false) If set to true, the toolTip will not follow the mouse.
* window        - (object: defaults to window) The context of the Tips elements.

### Properties:

* toolTip - (element) The Element containing the tip content; this element is the one positioned around the document relative to the target.
* wrapper - (element) An Element inside the toolTip Element that contains the body of the tip.
* title   - (element) The Element generated each time a tip is shown for the title of each tooltip.
* text    - (element) The Element generated each time a tip is shown for the body of each tooltip.

## Events:

### onShow

* (function) Fires when the Tip is starting to show and by default sets the tip visible.

#### Signature:

	onShow(tip)

#### Arguments:

1. tip - (element) The Tip Element that is showing.

### onHide

* (function) Fires when the Tip is starting to hide and by default sets the tip hidden.

#### Signature:

	onHide(tip)

#### Arguments:

1. tip - (element) The Tip Element that is hiding.

### Returns:

* (object) A new Tips class instance.

### Example:

##### HTML:

	<img src="/images/i.png" title="The body of the tooltip is stored in the title" class="toolTipImg"/>

##### JavaScript

	var myTips = new Tips($$('.toolTipImg'), {
		maxTitleChars: 50	//I like my captions a little long
	});

### Note:

The title of the element will always be used as the tooltip body. If you put :: on your title, the text before :: will become the tooltip title.
