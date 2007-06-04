var Physics = new Class({

	options: {
		onComplete: Class.empty,
		onStart: Class.empty,
		onStep: Class.empty,
		gravity: 1,
		restitution: 0.6,
		friction: 0.9,
		unit: 'px',
		fps: 30,
		airFriction: false,
		blockers: []
	},

	initialize: function(element, container, options){
		this.setOptions(options);
		this.element = $(element);
		this.container = $(container);
		this.velocity = {'x': 0, 'y': 0};
		this.position = {};
		this.oldPosition = {};
		this.oldVelocity = {};
		this.position.x = this.oldPosition.x = this.element.getStyle('left').toInt();
		this.position.y = this.oldPosition.y = this.element.getStyle('top').toInt();
		this.blockers = $$(this.options.blockers);
	},
	step: function(){
		this.oldPosition.x = this.position.x;
		this.oldPosition.y = this.position.y;
		this.fireEvent('onStep');
		this.velocity.y += this.options.gravity;
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
		var onGround = false;
		var element = {};
		var container = {};
		element.width = this.element.offsetWidth;
		element.height = this.element.offsetHeight;
		element.top = this.position.y;
		element.left = this.position.x;
		element.right = element.left + element.width;
		element.bottom = element.top + element.height;
		container.width = this.container.offsetWidth;
		container.height = this.container.offsetHeight;
		this.blockers.each(function(blocker){
			var collision = false;
			var block = {};
			block.left = blocker.getStyle('left').toInt();
			block.right = block.left + blocker.offsetWidth;
			block.top = blocker.getStyle('top').toInt();
			block.bottom = block.top + blocker.offsetHeight;
			if (element.right > block.left && element.left < block.right && element.bottom > block.top && element.top < block.bottom){ //collision area
				if (element.top < block.top && this.velocity.y > 0){ //touches top part of the blocker
					this.position.y = block.top - element.height;
					this.velocity.y *= -this.options.restitution;
					if (!this.options.airFriction) this.velocity.x *= this.options.friction;
					collision = true;
					blocker.fireEvent('collisionTop', this.element);
					onGround = true;
				} else if (element.bottom > block.bottom && this.velocity.y < 0){ //touches bottom part of the blocker
					this.position.y = block.bottom;
					this.velocity.y *= -this.options.restitution;
					collision = true;
					blocker.fireEvent('collisionBottom', this.element);
				} else if (element.left < block.left && this.velocity.x > 0){ //touches left part of the blocker
					this.position.x = block.left - element.width;
					this.velocity.x *= -this.options.restitution;
					collision = true;
					blocker.fireEvent('collisionLeft');
				} else if (element.right > block.right && this.velocity.x < 0){ //touches right part of the blocker
					this.position.x = block.right;
					this.velocity.x *= -this.options.restitution;
					collision = true;
					blocker.fireEvent('collisionRight', this.element);
				}
			}
			if (collision) blocker.fireEvent('collision', this.element);
		}, this);
		if (this.position.y + element.height > container.height){ //touches bottom
			this.position.y = container.height - element.height;
			this.velocity.y *= -this.options.restitution;
			if (!this.options.airFriction) this.velocity.x *= this.options.friction;
			onGround = true;
			this.container.fireEvent('collisionBottom', this.element);
		}
		if (onGround) {
			this.onGround = true;
			this.element.fireEvent('ground');
		} else {
			this.element.fireEvent('air');
			this.onGround = false;
		}
		if (this.position.y < 0){ //touches top
			this.position.y = 0;
			this.velocity.y *= -this.options.restitution;
			this.onTop = true;
		} else {
			this.onTop = false;
		}
		if (this.position.x + element.width > container.width){ //touches right
			this.position.x = container.width - element.width;
			this.velocity.x *= -this.options.restitution;
			this.onRight = true;
		} else {
			this.onRight = false;
		}
		if (this.position.x < 0){ //touches left
			this.position.x = 0;
			this.velocity.x *= -this.options.restitution;
			this.onLeft = true;
		} else {
			this.onLeft = false;
		}
		if (this.options.airFriction){
			this.velocity.y *= this.options.friction;
			this.velocity.x *= this.options.friction;
		}
		this.element.setStyles({
			'left': this.position.x,
			'top': this.position.y
		});
	},

	start: function(){
		this.fireEvent('onStart');
		this.timer = this.step.periodical(Math.round(1000/this.options.fps), this);
		return this;
	},

	force: function(velx, vely){
		this.position.x = this.element.getStyle('left').toInt();
		this.position.y = this.element.getStyle('top').toInt();
		this.velocity.x += velx;
		this.velocity.y += vely;
	},

	stop: function(){
		this.timer = $clear(this.timer);
		this.fireEvent('onComplete');
	}

});

Physics.implement(new Events);
Physics.implement(new Options);