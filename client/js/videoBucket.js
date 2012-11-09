

/**
 Constructor...
 */
VideoBucket = function(video, label) {
    
    this.video = video;
    this.label = label;

	this.enabled = true;
    
    this.transformCanvas = null;
    this.transformContext = null;
    this.coordinates = [];
    
    this.videoCanvas = null; //MediaExt.createCanvas(video.width, video.height);
    this.videoContext = null; // this.videoCanvas.getContext("2d");
    
    this.transform = null;
}

/**
 Call this function after calibration
 @param poly ...
 @param rect The local shared rectangle
 */
VideoBucket.prototype.setTransform = function(poly, rect) {
    
    console.log('creating transform');
    console.log(poly);
    console.log(rect);
    
    this.coordinates = poly;
    this.transformCanvas = MediaExt.createCanvas(rect.width, rect.height);
    this.transformContext = this.transformCanvas.getContext("2d");
    this.transform = new Geometry.PolyToCanvasTransform(poly, this.transformCanvas);
	
	this.videoCanvas = MediaExt.createCanvas(this.video.width, this.video.height);
    this.videoContext = this.videoCanvas.getContext("2d");
	
	var padding = 5;
	var cropRect = Geometry.rectFromPoly(poly);
	cropRect.x -= padding;
	cropRect.y -= padding;
	cropRect.width += padding * 2;
	cropRect.height += padding * 2;
	
	this.videoCropRect = cropRect;
	
	console.log('Crop rectangle:');
	console.log(cropRect);
}

VideoBucket.prototype.toggleEnabled = function() {
	this.enabled = !this.enabled;
}

VideoBucket.prototype.transformVideo = function() {
    
    if (this.transform == null || !this.enabled) {
		/*
		console.log("VideoBucket.prototype.transformVideo returning:");
		if (this.transform == null) {
			console.log("transform is null");
		}
		if (!this.enabled) {
			console.log("not enabled");
		}
		 */
		return null;
    }
    
    var	x = this.videoCropRect.x,
		y = this.videoCropRect.y,
		w = this.videoCropRect.width,
        h = this.videoCropRect.height;
	
	/*
	 First x, y, w and h need to be relative to the camera's native resolution
	 in order for this to work..
    
	 this.videoContext.drawImage(this.video,
								x, y, w, h,
								0, 0, w, h);
	 var imageData = this.videoContext.getImageData(0, 0, w, h);
     */

    this.videoContext.drawImage(this.video, 0, 0, this.video.width, this.video.height);
    var imageData = this.videoContext.getImageData(x, y, w, h);
	
    this.transform.transformImage(imageData,
								  this.transformCanvas,
								  this.videoCropRect);
    
    return this.transformCanvas;
}

VideoBucket.transformList = function(bucketList) {
    var transformedVideos = [];
    for (var i = 0; i < bucketList.length; i++) {
        var tv = bucketList[i].transformVideo();
        if (tv != null) {
            transformedVideos.push(tv);
        } else {
			// console.log("tranformed video is null");
		}
    }
	// console.log("length of transformedVideos: " + transformedVideos.length);
    return transformedVideos;
}
