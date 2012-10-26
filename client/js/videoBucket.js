

/**
 Constructor...
 */
VideoBucket = function(video, label) {
    
    this.video = video;
    this.label = label;
    
    this.transCanvas = null;
    this.transContext = null;
    this.coordinates = [];
    
    this.videoCanvas = MediaExt.createCanvas(640, 480);
    this.videoContext = this.videoCanvas.getContext("2d");
    
    this.tranform = null; // new Geometry.PolyToCanvasTransform(poly, this.transCanvas);
}

/**
 Call this function after calibration
 @param poly ...
 @param rect The local shared rectangle
 */
VideoBucket.prototype.setTransform = function(poly, rect) {
    this.coordinates = poly;
    this.transCanvas = MediaExt.createCanvas(rect.width, rect.height);
    this.transContext = this.transCanvas.getContext("2d");
    this.tranform = new Geometry.PolyToCanvasTransform(poly, this.transCanvas);
}

VideoBucket.prototype.transformVideo = function() {
    
    if (this.tranform == null) {
        return null;
    }
    
    var w = this.transCanvas.width,
        h = this.transCanvas.height;
    
    this.videoContext.drawImage(this.video, w, h);
    var imageData = this.videoContext.getImageData(0, 0, w, h);
    
    this.transform.transformImage(imageData, this.transCanvas);
    
    return this.transCanvas;
}

VideoBucket.transformList = function(bucketList) {
    var transformedVideos = [];
    for (var i = 0; i < bucketList.length; i++) {
        var tv = bucketList[i].transformVideo();
        if (tv != null) {
            transformedVideos.push();
        }
    }
    return transformedVideos;
}

