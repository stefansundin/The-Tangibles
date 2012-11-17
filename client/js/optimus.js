
/**
 Calibration helper that recursively splits the shared area into 
 smaller pieces to make the transform more accurate
 
 Important! The class is NOT named after the horrible Michael Bay version of Transformers!
 Also, it will be renamed to something that makes more sense in a little while...
 
 Better documentation coming soon / Pitebros
 Requires geometry.js and mediaext.js
 */

var Transformers = Transformers || {};

/*
Transformers.init = function() {
	if (Transformers.MarkerImages)
		return;
 */

// Load AR marker images (is it AR or QR? We haven't really decided on what to call them:)
if (!Transformers.MarkerImages) {
	
	var imgList = [];
	var img;

	img = new Image();
	img.src = "img/qr933.png";
	img.markerId = 933;
	imgList.push(img);

	img = new Image();
	img.src = "img/qr1012.png";
	img.markerId = 1012;
	imgList.push(img);

	Transformers.MarkerImages = imgList;
}

/** 
 Constructor.
 @param rect the shared rectangle
 @param poly rect as seen by the camera
 @param depth recursion depth - the area is split into 4^depth subregions
 @param imageIndex may be left out, it is used to alternate between marker images
 */
Transformers.OptimusPrime = function(rect, poly, depth, imageIndex) {
	
	// Transformers.init();
	
	this.rect = rect;
	this.poly = poly;
	this.depth = depth;
	this.imageIndex = imageIndex || 0;

	this.children = null;
	
	// At depth 0, create a canvas and a transform to draw to
	// Only the leaf nodes will actually perform transform work
	if (depth <= 0) {
		this.canvas = MediaExt.createCanvas(rect.width, rect.height);
		this.transform = Geometry.PolyToCanvasTransform(poly, this.canvas);
		
	} else {
		
		// Only leaf nodes need canvas and transform
		this.canvas = null;
		this.transform = null;
		
		var x = rect.x,
			y = rect.y,
			w = rect.width / 2,
			h = rect.height / 2;
		
		// Split the canvas into four regions, one for each child
		// The order is top left, top right, bottom right, bottom left
		this.childRects = [new Geometry.Rectangle(x, y, w, h),
						   new Geometry.Rectangle(x + w, y, w, h),
						   new Geometry.Rectangle(x + w, y + h, w, h),
						   new Geometry.Rectangle(x, y + h, w, h)];
	}
	
	// Select marker image to look for
	// The image alternates between two different markers to avoid confusion
	// and video delay problems
	this.markerImage = Transformers.MarkerImages[imageIndex % Transformers.MarkerImages.length];
}

/**
 The calibration update loop. The calibration is done recursively, but since each
 recursive call needs new image data from the camera, this function needs to find its way
 back to where it left off in the previous update.
 
 @param markers AR markers detected in image data from the camera
 @param context the context in which new markers are drawn (the fullscreen canvas context)
 @return true if the calibration is done
 */
Transformers.OptimusPrime.prototype.tick = function(markers, context) {
	
	if (this.transform != null) {
		// If a transform exists, this node is done
		return true;
		
	} else if (this.children == null) {
		
		// Draw the marker in the bottom right corner
		var r = this.childRects[2];
		context.drawImage(this.markerImage, r.x, r.y, r.width, r.height);
		
		for (var i = 0; i < markers.length; i++) {
			
			var marker = markers[i];
			
			if (marker.id == this.markerImage.markerId) {
				
				// If the correct marker is found, create four children
				var smallPoly = Geometry.orderPoly(marker.corners);
				// Split the poly into four regions, one for each child
				this.childPolys = Geometry.splitIntoFour(this.poly, smallPoly);
				this.children = [];
				
				for (var j = 0; j < 4; j++) {
					var child = new Transformers.OptimusPrime(this.childRects[j],
															  this.childPolys[j],
															  this.depth - 1,
															  this.imageIndex + j + 1);
					this.children.push(child);
				}
			}
		}
		// Not done yet! :)
		return false;
		
	} else {
		
		// Check if all children are done
		for (var i = 0; i < 4; i++) {
			if (!this.children[i].tick(markers, context)) {
				return false;
			}
		}
	}
	
	return true;
}

/**
 Transforms imageData and draws it into context
 */
Transformers.OptimusPrime.prototype.draw = function(imageData, context) {
	
	if (this.transform == null) {
		// Recursively call draw on all children
		for (var i = 0; i < 4; i++) {
			this.children[i].draw(imageData, context);
		}
	} else {
		// Only leaf nodes do actual drawing
		this.transform.transformImage(imageData, this.canvas);
		context.drawImage(this.canvas,
						  this.rect.x,
						  this.rect.y,
						  this.rect.width,
						  this.rect.height);
	}
}


/**
 Encodes the transforms as a list of lists (of lists...) of polygons
 */
Transformers.OptimusPrime.prototype.encode = function(list) {
	
	if (this.transform != null) {
	
		list.push(this.poly);
	
	} else {
		
		var childList = [];
		
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].encode(childList);
		}
		
		list.push(childList);
	}
}

/**
 Decodes a list produced by {Transformers.OptimusPrime.prototype.encode}
 into an OptimusPrime hierarchy
 */
Transformers.OptimusPrime.decode = function(polyList, rect, depth) {
	
	var prime = new Transformers.OptimusPrime(polyList, rect, depth, 0);
	
	if (depth > 0) {
		
		var x = rect.x, // || 0,
		y = rect.y, // || 0,
		w = rect.width / 2,
		h = rect.height / 2;
		
		var rects = [new Geometry.Rectangle(x, y, w, h),
					 new Geometry.Rectangle(x + w, y, w, h),
					 new Geometry.Rectangle(x + w, y + h, w, h),
					 new Geometry.Rectangle(x, y + h, w, h)];
		
		var children = [];
		
		for (var i = 0; i < 4; i++) {
			var child = Transformers.OptimusPrime.decode(polyList[i],
														 rects[i],
														 depth - 1, 0);
			children.push(child);
		}
		
		prime.children = children;
	}
	
	return prime;
}




