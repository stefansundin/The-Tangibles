
// Senaste, riktiga....

/**
 Constructor...
 */
VideoBucket = function(video, label) {
    
    this.video = video;
    this.label = label;

	this.enabled = true;
    
    this.transformCanvas = null;
    this.transformContext = null;
	// this.transform = null;
    this.coordinates = [];
    
    this.videoCanvas = null; //MediaExt.createCanvas(video.width, video.height);
    this.videoContext = null; // this.videoCanvas.getContext("2d");
	
	this.lastTransformedTimestamp = -1;
    this.prime = null;
}

/**
 Call this function after calibration
 @param poly Poly returned by the Calibrator
 @param rect The local shared rectangle
 */
VideoBucket.prototype.setTransform = function(prime, rect) {
    
    console.log('creating transform');
    console.log(rect);
    
    // this.coordinates = poly;
    this.transformCanvas = MediaExt.createCanvas(rect.width, rect.height);
    this.transformContext = this.transformCanvas.getContext("2d");
    // this.transform = new Geometry.PolyToCanvasTransform(poly, this.transformCanvas);
	
	this.videoCanvas = MediaExt.createCanvas(this.video.width, this.video.height);
    this.videoContext = this.videoCanvas.getContext("2d");
    
    this.prime = prime;
	
	// A rectangle containing the transform polygon -
	// used for cropping out image data from the video stream
    
    /*
	var padding = 5;
	var cropRect = Geometry.rectFromPoly(poly);
	cropRect.x -= padding;
	cropRect.y -= padding;
	cropRect.width += padding * 2;
	cropRect.height += padding * 2;
	
	this.videoCropRect = cropRect;
	*/
	console.log('Crop rectangle:');
	console.log(cropRect);
}

VideoBucket.prototype.toggleEnabled = function() {
	console.log('toggle change');
	this.enabled = !this.enabled;
}

VideoBucket.prototype.transformVideo = function() {
    
    if (this.transform == null) { //  || !this.enabled) {
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
	
	// If the current frame of the video has already been transformed,
	// just return the transform canvas
	if (this.lastTransformedTimestamp == this.video.currentTime) {
		return this.transformCanvas;
	}
    
    /*
    var	x = this.videoCropRect.x,
		y = this.videoCropRect.y,
		w = this.videoCropRect.width,
        h = this.videoCropRect.height;

	 First x, y, w and h need to be relative to the camera's native resolution
	 in order for this to work..
    
	 this.videoContext.drawImage(this.video, x, y, w, h, 0, 0, w, h);
	 var imageData = this.videoContext.getImageData(0, 0, w, h);
     */

	// Draw the video
    this.videoContext.drawImage(this.video, 0, 0, this.video.width, this.video.height);
	
	/* Crop out the interesting part of the video
    var imageData = this.videoContext.getImageData(x, y, w, h);
	*/
    var imageData = this.videoContext.getImageData(0, 0, this.video.width, this.video.height);
    
	/* Transform the video
    this.transform.transformImage(imageData,
								  this.transformCanvas,
								  this.videoCropRect);
     */
    
	// Store timestamp
    this.prime.draw(imageData, this.transformContext);
	this.lastTransformedTimestamp = this.video.currentTime;
	
    return this.transformCanvas;
}

/**
 @param bucketList a list of VideoBucket objects to be transformed
 @return a list of canvases containing the current video frames transformed
 */
VideoBucket.transformList = function(bucketList) {
    var transformedVideos = [];
    for (var i = 0; i < bucketList.length; i++) {
        
		if (!bucketList[i].enabled) {
			continue;
		}
		
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
