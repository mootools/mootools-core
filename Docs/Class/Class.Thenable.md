Class: Class.Thenable {#Class.Thenable}
=======================================

A Utility Class. Its methods can be implemented with [Class:implement][] into any [Class][].
It makes a Class "thenable" (see [Promises/A+][]), which means you can call its `then` method to integrate it in a [Promise][] style flow.

### Syntax:

#### For new classes:

	var MyClass = new Class({ Implements: Class.Thenable });

#### For existing classes:

	MyClass.implement(Class.Thenable);

### Implementing:

- This class can be implemented into other classes to add its functionality to them.

### Example:

	var Promise = new Class({
		Implements: Class.Thenable,
		initialize: function(executor){
			if (typeof executor !== 'function'){
				throw new TypeError('Promise constructor takes a function argument.');
			}

			try {
				executor(this.resolve.bind(this), this.reject.bind(this));
			} catch (exception){
				this.reject(exception);
			}
		},
		resetThenable: function(){
			throw new TypeError('A promise can only be resolved once.');
		}
	});

	var myPromise = new Promise(function(resolve){
		resolve('Hello promised world!');
	});
	myPromise.then(function(value){
		console.log(value);
	});

### See Also:

- [Class][]
- [Promise][]


Class.Thenable Method: then {#Class.Thenable:then}
--------------------------------------------------

Registers callbacks to receive the class's eventual value or the reason why it cannot be successfully resolved.

### Syntax:

	myClass.then(onFulfilled, onRejected);

### Arguments:

1. onFulfilled - (*function*, optional) Function to execute when the value is successfully resolved.
2. onRejected  - (*function*, optional) Function to execute when the value cannot be successfully resolved.

### Returns:

* (*object*) A new `Class.Thenable` instance that will have its value resolved based on the return values of the above mentioned arguments, compatible with [Promises/A+][].

### Example:

	var request = new Request();
	request.send().then(function(response){ console.log(response); });


Class.Thenable Method: catch {#Class.Thenable:catch}
----------------------------------------------------

Registers a callback to receive the reason why an eventual value cannot be successfully resolved.

### Syntax:

	myClass.catch(onRejected);

### Arguments:

1. onRejected  - (*function*, optional) Function to execute when the value cannot be successfully resolved.

### Returns:

* (*object*) A new `Class.Thenable` instance that will have its value resolved based on the return values of the above mentioned arguments, compatible with [Promises/A+][].

### Example:

	var request = new Request();
	request.send().catch(function(reason){ console.log(reason); });


Class.Thenable Method: resolve {#Class.Thenable:resolve}
--------------------------------------------------------

Function to resolve the eventual value of the `Thenable`.

### Syntax:

	myClass.resolve(value);

### Arguments:

1. value  - (*mixed*, optional) The value to resolve. If the value is "thenable" (like a [Promise][] or `Thenable`), it will be resolved with its eventual value (i.e. it will be resolved when the "thenable" is resolved).

### Returns:

* (*object*) This Class instance.

### Example:

	var MyClass = new Class({
		Implements: Class.Thenable,
		initialize: function(){
			this.resolve('Hello world!');
		}
	});


Class.Thenable Method: reject {#Class.Thenable:reject}
------------------------------------------------------

Function to make a `Thenable` rejected, that is to say it will not receive an eventual value.

### Syntax:

	myClass.reject(reason);

### Arguments:

1. reason  - (*mixed*, optional) The reason the `Thenable` will not be successfully resolved, often an `Error` instance.

### Returns:

* (*object*) This Class instance.

### Example:

	var MyClass = new Class({
		Implements: Class.Thenable,
		initialize: function(){
			this.reject(new Error('Cannot be successfully resolved.'));
		}
	});


Class.Thenable Method: getThenableState {#Class.Thenable:getThenableState}
--------------------------------------------------------------------------

Returns the state of the `Thenable` Class.

### Syntax:

	myClass.getThenableState();

### Returns:

* (*string*) The current state: "pending", "fulfilled" or "rejected".

### Example:

	var MyClass = new Class({
		Implements: Class.Thenable,
		initialize: function(){
			console.log(this.getThenableState());
		}
	});


Class.Thenable Method: resetThenable {#Class.Thenable:resetThenable}
--------------------------------------------------------------------

Resets the state of the `Thenable` Class, to make it usable multiple times. If the current `Thenable` state was not resolved yet, it will be rejected first and the `onRejected` handlers will be executed.

Use with caution, this is not in line with [Promise][] behaviour: a once resolved `Thenable` can be resolved with a different value after it is reset. Useful in case a Class can intentionally receive resolved values multiple times, e.g. a `Request` instance that can be executed multiple times or an `Fx` instance that is used multiple times.

### Syntax:

	myClass.resetThenable(reason);

### Arguments:

1. reason  - (*mixed*, optional) The reason to pass when rejecting a currently unresolved state.

### Returns:

* (*object*) This Class instance.

### Example:

	var MyClass = new Class({
		Implements: Class.Thenable,
		initialize: function(){
			var self = this;
			this.addEvent('start', function(){
				self.resetThenable();
			});
		}
	});

### Note: {#Class.Thenable:resetThenable-note}

Take care when using [Chain][] and `Class.Thenable` together. When multiple resolutions are chained, the registration of callbacks for later resolutions has to be chained as well. Since `myClass.chain()` returns the class instance, `myClass.chain(fn).then(callback)` is equivalent to `myClass.chain(fn); myClass.then(callback)`, and so the callback is not chained to whatever `fn` does.

To use `chain`, you can use one of the following patterns:

	myClass.start().chain(function(){ this.start() }).chain(function(){ this.then(callback); });
	myClass.start().chain(function(){ this.start().then(callback); });

If your aim is to use a Promise style flow, you should probably not use `chain`, and just use `then` instead:

	myClass.start().then(function(){ return myClass.start(); }).then(callback);


[Chain]: /core/Class/Class.Extras#Chain
[Class]: /core/Class/Class
[Class:implement]: /core/Class/Class/#Class:implement
[Promise]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Promises/A+]: https://promisesaplus.com/
