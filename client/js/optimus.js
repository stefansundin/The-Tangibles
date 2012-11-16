
/**
 Calibration helper that recursively splits the area into smaller pieces
 Comments coming soon / Pitebros
 Requires geometry.js and mediaext.js
 */

var Transformers = Transformers || {};

Transformers.init = function() {
	
	if (Transformers.MarkerImages)
		return;
	
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

Transformers.OptimusPrime = function(rect, poly, depth, imageIndex) {
	
	Transformers.init();
	
	this.rect = rect;
	this.poly = poly;
	this.depth = depth;
	this.imageIndex = imageIndex;

	this.children = null;
	
	if (depth <= 0) {
		this.canvas = MediaExt.createCanvas(rect.width, rect.height);
		this.transform = Geometry.PolyToCanvasTransform(poly, this.canvas);
	} else {
		this.canvas = null;
		this.transform = null;
		
		var x = rect.x,
			y = rect.y,
			w = rect.width / 2,
			h = rect.height / 2;
		this.childRects = [new Geometry.Rectangle(x, y, w, h),
						   new Geometry.Rectangle(x + w, y, w, h),
						   new Geometry.Rectangle(x + w, y + h, w, h),
						   new Geometry.Rectangle(x, y + h, w, h)];
	}
	this.markerImage = Transformers.MarkerImages[imageIndex % Transformers.MarkerImages.length];
}

Transformers.OptimusPrime.prototype.tick = function(markers, context) {
	
	if (this.transform != null) {
		return true;
		
	} else if (this.children == null) {
		
		var r = this.childRects[2];
		context.drawImage(this.markerImage, r.x, r.y, r.width, r.height);
		
		for (var i = 0; i < markers.length; i++) {
			
			var marker = markers[i];
			
			if (marker.id == this.markerImage.markerId) {
				
				var smallPoly = Geometry.orderPoly(marker.corners);
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
		
		return false;
		
	} else {
		
		for (var i = 0; i < 4; i++) {
			if (!this.children[i].tick(markers, context)) {
				return false;
			}
		}
	}
	
	return true;
}

Transformers.OptimusPrime.prototype.draw = function(imageData, context) {
	
	if (this.transform == null) {
		for (var i = 0; i < 4; i++) {
			this.children[i].draw(imageData, context);
		}
	} else {
		this.transform.transformImage(imageData, this.canvas);
		context.drawImage(this.canvas,
						  this.rect.x,
						  this.rect.y,
						  this.rect.width,
						  this.rect.height);
	}
}






