/**
 Requires geometry.js and transform.js to be included in html
 */

const DEFAULT_RATIO = 3.0 / 4.0;

/*const MINI_CANVAS_WIDTH = 640,
 MINI_CANVAS_HEIGHT = 480;*/

const BUTTON_RATIO = 0.05;
const SHARED_RECT_MIN_RATIO = 0.2;

const SCREEN_MARKER_ID = 1012,
FINAL_MARKER_ID = 1012,
LEFT_MARKER_ID = 188,
RIGHT_MARKER_ID = 956;

const QR_FRAME = 15;

/**
 Creates a Calibrator object
 */
Calibrator = function(video, canvas) {
    
	this.video = video;
	this.detector = new AR.Detector();
    
	// The default shared rectangle is 400x300px centered in the canvas
	var w = canvas.width / 2,
    h = w * DEFAULT_RATIO;
	this.sharedRect = new Geometry.Rectangle(canvas.width / 2 - w / 2,
                                             canvas.height / 2 - h / 2, w, h);
	this.sharedRectPrev = this.sharedRect.copy();
    
	this.sharedPoly = [];
	this.sharedTransform = null;
    
	this.screenPoly = [];
	this.screenTransform = null;
    
	this.canvas = canvas;
	this.context = canvas.getContext("2d");
	
	this.videoCanvas = MediaExt.createCanvas(video.width, video.height);
	this.videoContext = this.videoCanvas.getContext("2d");
	this.videoWidth = video.width;
	this.videoHeight = video.height;
	
	this.calibrationStage = 1;
    
	// this.buttonImage = new Image();
	// this.buttonImage.src = 'img/doneButton.png';
    
	this.qrImg = new Image();
	/*qrImg.onload = function() {
     this.context.drawImage(qrImg, 0, 0,
     fullscreenCanvas.width,
     fullscreenCanvas.height);
     };*/
	this.qrImg.src = "img/qr1012.png";
    
	this.firstStageCallback = null;
	this.onFinishedCallback = null;
    this.target = null;
}

/**
 @param callback function that takes one argument, receives the transform polygon
 */
Calibrator.prototype.startCalibration = function(firstStageCallback, onFinishedCallback, target) {
	this.firstStageCallback = firstStageCallback;
	this.onFinishedCallback = onFinishedCallback;
    
    if (target) {
        this.target = target;
    } else {
        this.target = this;
    }
	
    this.tick();
}

Calibrator.prototype.tick = function() {
    
	this.draw();
    
	// Draw video to an offscreen canvas and detect markers
	this.videoContext.drawImage(this.video, 0, 0, this.videoWidth, this.videoHeight);
	var imageData = this.videoContext.getImageData(0, 0, this.videoWidth, this.videoHeight);
	var markers = this.detector.detect(imageData);
    
	// Use detected marker to calibrate
	this.calibrateWithMarkers(markers);
    
	// If done, do the callback and stop
	if (this.isDone()) {
		if (this.onFinishedCallback != null) {
            // var callback = this.onFinishedCallback;
            this.onFinishedCallback.call(this.target, this.sharedRect, this.sharedPoly);
			// this.target.callback(this.sharedRect, this.sharedPoly);
		}
	} else {
		setTimeout(function(_this) {
                   _this.tick();
                   }, 1, this); // Can't use this.tick(), since 'this' will apparently refer to something different then invoked
	}
}

Calibrator.prototype.isDone = function() {
	return (this.calibrationStage >= 4 && this.sharedTransform != null);
}

Calibrator.prototype.draw = function() {
    
	switch (this.calibrationStage) {
		case 1:
			// Draw a fullscreen QR marker
			this.context.drawImage(this.qrImg, QR_FRAME, QR_FRAME,
                                   this.canvas.width - QR_FRAME * 2,
                                   this.canvas.height - QR_FRAME * 2);
			break;
		case 2:
			// Draw the frame of the rectangle to be shared
			this.context.clearRect(this.sharedRectPrev.x - 2,
                                   this.sharedRectPrev.y - 2,
                                   this.sharedRectPrev.width + 4,
                                   this.sharedRectPrev.height + 4);
			this.sharedRect.draw(this.context);
			break;
		case 3:
			// Draw a marker in the shared rectangle
			this.context.drawImage(this.qrImg,
                                   this.sharedRect.x,
                                   this.sharedRect.y,
                                   this.sharedRect.width,
                                   this.sharedRect.height);
			break;
		case 4:
			break;
		default:
			break;
			// this.sharedTransform.transformImageToRect(imageData, this.canvas, this.sharedRect);
			// break;
	}
}

/**
 Does calibration on detected markers
 */
Calibrator.prototype.calibrateWithMarkers = function(markers) {
    
	/* Perform actions depending on what calibration stage the
     program is currently in */
	switch (this.calibrationStage) {
		case 1:
			this.firstCalibration(markers);
			break;
		case 2:
			this.secondCalibration(markers);
			break;
		case 3:
			this.thirdCalibration(markers);
			break;
		default:
			break;
	}
}


/**
 --The first calibration step--
 Looks for a fullscreen AR marker that is used for
 mapping coordinates from camera to canvas
 */
Calibrator.prototype.firstCalibration = function(markers) {
    
	var marker;
	for (var i = 0; i < markers.length; i++) {
        
		var marker = markers[i];
        
		// console.log(marker.id);
        
		if (marker.id == SCREEN_MARKER_ID) {
            
			var topLeft = Geometry.findTopLeftCorner(marker.corners);
            
			// Poly of the screen as seen by the camera
			this.screenPoly = [marker.corners[topLeft],
                               marker.corners[(topLeft + 1) % 4],
                               marker.corners[(topLeft + 2) % 4],
                               marker.corners[(topLeft + 3) % 4]];
            
			var canvasRectangle = [{x:QR_FRAME, y:QR_FRAME},
                                   {x:this.canvas.width - QR_FRAME, y:QR_FRAME},
                                   {x:this.canvas.width - QR_FRAME, y:this.canvas.height - QR_FRAME},
                                   {x:QR_FRAME, y:this.canvas.height - QR_FRAME}];
            
			// Transforms points from camera to screen
			this.screenTransform = new Geometry.Transform(canvasRectangle, this.screenPoly); // new Geometry.PolyToRectTransform(this.screenPoly, new Geometry.Rectangle(5, 5, this.canvas.width - 10, this.canvas.height - 10));
            
			if (this.firstStageCallback != null) {
                this.firstStageCallback.call(this.target, this.screenTransform);
			}
            
			// Clear the canvas and go to the next calibration stage
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.calibrationStage = 2;
		}
	}
}

/**
 --The second calibration step--
 Checks for two markers and draws a rectangle of
 the area of the workspace that will be shared
 */
Calibrator.prototype.secondCalibration = function(markers) {
    
	var foundLeft = false;
	var marker;
	var leftMarkerCorner, rightMarkerCorner;
    var buttonWidth = BUTTON_PERCENT * canvas.width;
    
    var sharedMinWidth = SHARED_RECT_MIN_RATIO * canvas.width;
    var sharedMinHeight = SHARED_RECT_MIN_RATIO * canvas.height;
    
	this.sharedRectPrev = this.sharedRect.copy();
    
	for (var i = 0; i < markers.length; i++) {
        
		marker = markers[i];
        
		//console.log(marker.id);
        
		// If the left marker is found, move the shared rectangle
		if (marker.id == LEFT_MARKER_ID) {
            
			foundLeft = true;
            
			var transformedCorners = this.screenTransform.transformPoly(marker.corners);
			leftMarkerCorner = transformedCorners[Geometry.findTopLeftCorner(transformedCorners)];
            
            /* Set the x-position of sharedRect, making sure it's not too far
             too the left or right */
			this.sharedRect.x = Math.max(leftMarkerCorner.x, buttonWidth)
            this.sharedRect.x = Math.min(canvas.width - sharedMinWidth,
                                         this.sharedRect.x);
            
            /* Set the y-position of sharedRect, making sure it's not too far
             up or down */
			this.sharedRect.y = Math.max(leftMarkerCorner.y, 0);
            this.sharedRect.y = Math.min(canvas.height - sharedMinHeight,
                                         this.sharedHeight.y);
		}
	}
    
	if (foundLeft) {
		for (var i = 0; i < markers.length; i++) {
			marker = markers[i];
			// If the right marker is also found, resize the shared rectangle
			if (marker.id == RIGHT_MARKER_ID) {
				var transformedCorners = this.screenTransform.transformPoly(marker.corners);
				rightMarkerCorner = transformedCorners[Geometry.findTopLeftCorner(transformedCorners)];
                
                /* Set the width of sharedRect, making sure it's not too
                 wide or too thin */
				this.sharedRect.width = Math.max(rightMarkerCorner.x - leftMarkerCorner.x, sharedMinWidth);
                
				this.sharedRect.height = this.sharedRect.width * DEFAULT_RATIO;
                
                // Finally, make sure the proportions haven't been distorted
                if (sharedRect.height == sharedMinHeight) {
                    sharedRect.width = sharedMinWidth;
                }
			}
		}
	}
    
    if
        }

/**
 -- The third calibration step --
 Finds the final marker to make the transform that
 will be sent to the other users
 */
Calibrator.prototype.thirdCalibration = function(markers) {
    
	var marker;
    
	for (var i = 0; i < markers.length; i++) {
		marker = markers[i];
		if (marker.id == FINAL_MARKER_ID) {
            
			var topLeft = Geometry.findTopLeftCorner(marker.corners);
            
			// console.log(markers);
            
			this.sharedPoly = [marker.corners[topLeft],
                               marker.corners[(topLeft + 1) % 4],
                               marker.corners[(topLeft + 2) % 4],
                               marker.corners[(topLeft + 3) % 4]];
            
			// TODO: Change implementation of Transform.transformImageToRect
			var r = this.sharedRect.copy();
			r.x = 0;
			r.y = 0;
            
			this.sharedTransform = Geometry.PolyToRectTransform(this.sharedPoly, r);
			this.calibrationStage = 4;
		}
	}
}

/**
 Is called when the calibration button is clicked
 Will be used in the second calibration step to
 confirm the shared window size
 */
Calibrator.prototype.confirmSharedRectangle = function() {
	//console.log("tada " + this.calibrationStage);
	if (this.calibrationStage == 2) {
		//console.log("aha");
		this.calibrationStage = 3;
		// TODO: Stop drawing buttons
	}
}


