/*
	Contanier class for handling all the buttons
*/
var Buttons = function (c, transform, v, w, h) {
	this.video = v;
	this._ctx = c;
	this.listOfButtons = [];
	this.trans = transform;
	this.i = null; // handle to cancel out draw...
	console.log(h);
	this.maxHeight = h; // height of canvas
	this.height = Math.round(this.maxHeight*0.15); // 15% of maxHeight 
	this.width = this.height; // same as height

	this.addButton = function (button) {
		this.listOfButtons.push(button)
		setTimeout(function () { button.pressed = false; console.log('enable button ' + button.id); }, 3000);
	}

	this.deleteButtonId = function (id) {
		var index = -1;
		for (i in this.listOfButtons) {
			console.log('delete button ' + this.listOfButtons[i].id + ' ' + id);
			if (this.listOfButtons[i].id == id) {
				index = i;
				break;
			}
		}
		if (index > -1) {
			this.listOfButtons.splice(index, 1);
		}
	}

	this.deleteButton = function(button) {
		var index = -1;
		for (i in this.listOfButtons) {
			if (this.listOfButtons[i] == button) {
				index = i;
				break;
			}
		}
		if (index > -1) {
			this.listOfButtons.splice(index, 1);
		}
	}

	this.draw = function () {
		if (this.listOfButtons.length < 1) {
			this._ctx.clearRect(0, 0, this.width + 20, this.maxHeight);
			return;
		}
		var x = 10;
		var y = 20;
		for (i in this.listOfButtons) {
			if (y + this.height > this.maxHeight) {
				break;
			}
			y = 10 + i * (this.height + 20);
			this.listOfButtons[i].draw(this._ctx, x, y, this.width, this.height);
		}
		// clear everything below the last button
		this._ctx.clearRect(0, y + this.height + 2, this.width + 20, this.maxHeight);
	}

	this.checkPressed = function (contextBlended) {
		var x = 10;
		var y = 20;
		for (i in this.listOfButtons) {
			if (y + this.height > this.maxHeight) {
				break;
			}
			y = y + i * (this.height + 20);
			var p1 = new Object();
			p1.x = x;
			p1.y = y;
			var p2 = new Object();
			p2.x = x + this.width;
			p2.y = y + this.height;
			p1 = transform.transformPoint(p1);
			p2 = transform.transformPoint(p2);
			//console.log(p1);
			//console.log(p2);
			// take into account that only a subset of video is used
			//p1.x = p1.x - this.p1.x;
			//p1.y = p1.y - this.p1.y;
			//p2.x = p2.x - this.p1.x;
			//p2.y = p2.y - this.p1.y;
			//console.log(p1);
			//console.log(p2);

			this.listOfButtons[i].checkPressed(this.contextBlended, p1, p2);
		}
	}

	this.start = function () {
		// only use a subset of video
		this.p1 = new Object();
		this.p1.x = 0;
		this.p1.y = 0;
		this.p2 = new Object();
		this.p2.x = this.width*2;
		this.p2.y = this.maxHeight;
		this.p1 = transform.transformPoint(this.p1);
		this.p2 = transform.transformPoint(this.p2);
		//console.log(this.p1);
		//console.log(this.p2);
		this.p1.x = 0;
		this.p1.y = 0;
		this.p2.x = this.video.width;
		this.p2.y = this.video.height;

		var canvasSource = MediaExt.createCanvas(this.p2.x-this.p1.x, this.p2.y-this.p1.y);
		var canvasBlended = MediaExt.createCanvas(this.p2.x-this.p1.x, this.p2.y-this.p1.y);
		this.contextSource = canvasSource.getContext('2d');
		this.contextBlended = canvasBlended.getContext('2d');
		this.update();
	}

	this.update = function () {
		//console.log('checking buttons');
		this.draw();
		if (this.listOfButtons.length > 0) {
			this.drawVideo();
			this.blend();

			this.checkPressed(this.contextBlended)
		}
		var self = this;
		this.timeOut = setTimeout(function () {self.update()}, 200);
	}

	this.drawVideo = function () {
		this.contextSource.drawImage(this.video, this.p1.x, this.p1.y, this.p2.x-this.p1.x, this.p2.y-this.p1.y);
	}

	this.blend = function () {
		var width = this.contextSource.canvas.width;
		var height = this.contextSource.canvas.height;
		// get webcam image data
		var sourceData = this.contextSource.getImageData(0, 0, width, height);
		// create an image if the previous image doesn’t exist
		if (!this.lastImageData) this.lastImageData = this.contextSource.getImageData(0, 0, width, height);
		// create a ImageData instance to receive the blended result
		var blendedData = this.contextSource.createImageData(width, height);
		// blend the 2 images
		this.differenceAccuracy(blendedData.data, sourceData.data, this.lastImageData.data);
		// draw the result in a canvas
		this.contextBlended.putImageData(blendedData, 0, 0);
		// store the current webcam image
		this.lastImageData = sourceData;
	}

	this.fastAbs = function (value) {
		// funky bitwise, equal Math.abs
		return (value ^ (value >> 31)) - (value >> 31);
	}

	this.threshold = function (value) {
		// TODO change accordingly
		return (value > 0x07) ? 0xFF : 0;
	}

	this.differenceAccuracy = function (target, data1, data2) {
		if (data1.length != data2.length) return null;
		var i = 0;
		while (i < (data1.length * 0.25)) {
			var average1 = (data1[4*i] + data1[4*i+1] + data1[4*i+2]) / 3;
			var average2 = (data2[4*i] + data2[4*i+1] + data2[4*i+2]) / 3;
			var diff = this.threshold(this.fastAbs(average1 - average2));
			target[4*i] = diff;
			target[4*i+1] = diff;
			target[4*i+2] = diff;
			target[4*i+3] = 0xFF;
			++i;
		}
	}
}

/*
	Class for a simple button with an image or video
*/
var Button = function (image, method, target) {
	this.method = method; // method to invoke when pressed
	this.image = image; // image to draw
	this.id = null;
	this.target = target;

	this.pressed = true;
	this.enabled = true;
}

Button.prototype.checkPressed = function (contextBlended, p1, p4) {
	var blendedData = contextBlended.getImageData(p1.x, p1.y, p4.x-p1.x, p4.y-p1.y);

	var i = 0;
	var average = 0;
	// loop over the pixels
	while (i < (blendedData.data.length * 0.25)) {
		// make an average between the color channel
		average += blendedData.data[i*4];
		++i;
	}
	// calculate an average between of the color values of the note area
	average = Math.round(average / (blendedData.data.length * 0.25));
	// TODO decide open a value
	if (average > 40 && !this.pressed) {
		console.log(average);
		this.pressed = true;
		this.enabled = !this.enabled;
		console.log('button presseeeed');
		if (!!(this.method && this.method.constructor && this.method.call && this.method.apply)) {
			this.method.call(this.target);
		}
		var self = this;
		setTimeout(function () { self.pressed = false; }, 1000);
	}
}

Button.prototype.draw = function (ctx, x, y, width, height) {
	if (this.enabled) {
		ctx.strokeStyle = 'red'
	} else {
		ctx.strokeStyle = 'black'
	}
	
	ctx.strokeRect(x, y, width, height);
	ctx.drawImage(this.image, x, y, width, height);
}
