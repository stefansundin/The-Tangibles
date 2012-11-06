/*
	Contanier class for handling all the buttons
*/
var Buttons = function (transform) {
	var listOfButtons = [];
	var trans = transform;

	this.addButton = function (button) {
		listOfButtons.push(button)
	}

	//this.deleteButton = deleteButton;
	//function deleteButton(button) {
	//  
	//}

	this.draw = function () {
		for (i in listOfButtons) {
			listOfButtons[i].draw();
		}
	}

	this.checkPressed = function (contextBlended) {
		for (i in listOfButtons) {
			listOfButtons[i].checkPressed(contextBlended, trans); // this.transform);
		}
	}

	this.start = function (video, contextSource, contextBlended) {
		for (i in listOfButtons) {
			setTimeout(function () { listOfButtons[i].pressed = false; }, 3000);
		}
		this.video = video;
		this.contextSource = contextSource;
		this.contextBlended = contextBlended;
		this.update();
	}

	this.update = function () {
		this.drawVideo();
		this.blend();

		this.checkPressed(this.contextBlended)
		var self = this;
		this.timeOut = setTimeout(function () {self.update()}, 200);
	}

	this.drawVideo = function () {
		this.contextSource.drawImage(this.video, 0, 0, this.video.width, this.video.height);
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
	Class for a simple button with an image
*/
var Button = function (x, y, sizeX, sizeY, image, ctx) {
	this.p1 = new Object();
	this.p1.x = x;
	this.p1.y = y;
	this.p4 = new Object();
	this.p4.x = x + sizeX;
	this.p4.y = y + sizeY;

	this.sizeX = sizeX;
	this.sizeY = sizeY;
	this.x = x;
	this.y = y;
	this.method; // method to invoke when pressed
	this.image = image; // image to draw
	this.ctx = ctx;

	this.pressed = true;
	this.enabled = true;
}

Button.prototype.checkPressed = function (contextBlended, transform) {
	var p1 = transform.transformPoint(this.p1);
	var p4 = transform.transformPoint(this.p4);

	var blendedData = contextBlended.getImageData(p1.x, p1.y, p4.x-p1.x, p4.y-p1.y);
	//var blendedData = contextBlended.getImageData(500, 100, 100, 100);
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
	console.log(average);
	// TODO decide open a value
	if (average > 20 && !this.pressed) {
		this.pressed = true;
		if (this.enabled) {
			this.enabled = false;
		} else {
			this.enabled = true;
		}
		this.draw()
		if (!!(this.method && this.method.constructor && this.method.call && this.method.apply)) {
			this.method();
		}
		var self = this;
		setTimeout(function () { self.pressed = false; }, 1000);
	}
}

Button.prototype.draw = function () {
	if (this.enabled) {
		this.ctx.strokeStyle = 'red'
	} else {
		this.ctx.strokeStyle = 'black'
	}
	this.ctx.strokeRect(this.x, this.y, this.sizeX, this.sizeY);
	this.ctx.drawImage(this.image, this.x, this.y, this.sizeX, this.sizeY);
}

/*
	Video button class, extends Button
*/
var VideoButton = function (x, y, sizeX, sizeY, image, ctx) {
	this.p1 = new Object();
	this.p1.x = x;
	this.p1.y = y;
	this.p4 = new Object();
	this.p4.x = x + sizeX;
	this.p4.y = y + sizeY;

	this.x = x;
	this.y = y;
	this.sizeX = sizeX;
	this.sizeY = sizeY;
	this.v = image;
	this.ctx = ctx;
	this.method;

	this.i;

	this.pressed = true;
	this.enabled = true;
}

VideoButton.prototype = new Button;

VideoButton.prototype.draw = function () {
	this.ctx.strokeStyle = 'black';
	this.ctx.strokeRect(this.x, this.y, this.sizeX, this.sizeY);
	if (this.enabled) {
		var self = this;
		this.i = window.setInterval(function () {self.drawMovie();},  40);
	} else {
		window.clearInterval(this.i);
		this.ctx.fillRect(this.x, this.y, this.sizeX, this.sizeY);
	}
}

VideoButton.prototype.drawMovie = function () {
	this.ctx.drawImage(this.v, this.x, this.y, this.sizeX, this.sizeY);
}
