MooTools Core
=============
This repository is for MooTools developers, not users.  
All users should download MooTools from [MooTools.net](http://mootools.net "MooTools")

How to Contribute
-----------------

### General help
For information on MooTools usage see [MooTools.net](http://mootools.net "MooTools").

The MooTools Community discussions take place on the [MooTools Users Google Group](http://groups.google.com/group/mootools-users/ "MooTools Users | Google Groups").

### Minor fixes
Our bugtracker is located at Lighthouse. If you want to contribute a bug fix, coordinate your fix there in the comment thread of the bug ticket. You can add a code patch to the ticket there. Run `git help format-patch` to see how to create a git patch.

### Major changes
As with all Git projects, feel free to fork the project and do whatever you want with your own fork of MooTools.

But, if you want your changes to be incorporated into the *official* releases of MooTools, please work with us to decide what direction to take the project. See [MooTools.net](http://mootools.net "MooTools") for more information on getting involved with the project.

Repository structure
--------------------
* The `1.2wip` branch will always be stable  
It is for stable bug fixes to the 1.2 release only.
	* Once a fix is stable it will be pulled into the `1.2wip` branch.
	* Work in progress fixes will be worked on in other branches/forks until stable.
	* Once there are enough fixes in `1.2wip` to justify a new minor release, a new tag will be created.
* The `master` branch is for the next major release, 1.3.
* Once `1.3` is released, it will be tagged and branched just like `1.2wip`
