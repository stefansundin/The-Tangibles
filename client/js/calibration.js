
/**
 Requires geometry.js and transform.js to be included in html
 */

const DEFAULT_RATIO = 3.0 / 4.0;

const SCREEN_MARKER_ID = 1012,
      FINAL_MARKER_ID = 1012,
      LEFT_MARKER_ID = 188,
      RIGHT_MARKER_ID = 956;

const defaultSharedRectangle = new Geometry.Rectangle(100, 100, 400, 300); // center in fullscreen canvas instead

Calibrator = function(fullscreenCanvas, video) {
    
    this.video = video;
    
    this.sharedRect = defaultSharedRectangle.copy();
    this.sharedRectPrev = defaultSharedRectangle.copy(); // (perhaps) needed to clear the context before redrawing the shared rectangle
    this.sharedPoly = [];
    this.sharedTransform = null;
    
    this.screenPoly = [];
    this.screenTransform = null;
    
    this.fullCanvas = fullscreenCanvas;
    this.fullContext = fullscreenCanvas.getContext("2d");
    
    this.calibrationStage = 1;
    
    this.qrImg = new Image();
    /*qrImg.onload = function() {
        this.fullContext.drawImage(qrImg, 0, 0,
                                   fullscreenCanvas.width,
                                   fullscreenCanvas.height);
    };*/
    this.qrImg.src = "img/qr1012.png";
}

Calibrator.prototype.isDone = function() {
    return (this.calibrationStage == 4 && this.sharedTransform != null);
}

Calibrator.prototype.draw = function(imageData) {
    
    switch (this.calibrationStage) {
        case 1:
            // Draw a fullscreen QR marker
            this.fullContext.drawImage(this.qrImg, 5, 5,
                                       this.fullCanvas.width - 10,
                                       this.fullCanvas.height - 10);
            break;
        case 2:
            // Draw the frame of the rectangle to be shared
            this.fullContext.clearRect(this.sharedRectPrev.x - 2,
                                       this.sharedRectPrev.y - 2,
                                       this.sharedRectPrev.width + 4,
                                       this.sharedRectPrev.height + 4);
            this.sharedRect.draw(this.fullContext);
            break;
        case 3:
            // Draw a marker in the shared rectangle
            this.fullContext.drawImage(this.qrImg,
                                       this.sharedRect.x,
                                       this.sharedRect.y,
                                       this.sharedRect.width,
                                       this.sharedRect.height);
            break;
        case 4:
            this.sharedTransform.transformImageToRect(imageData, this.fullCanvas, this.sharedRect);
            break;
    }
}

/* Keeps calibrating until the correct rectangle is found,
 then displays the transformed video stream */
    
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
        case 4:
            // finalTransform.transformImageToRect(imageData, fullCanvas,
            //                                    Geometry.rectFromPoly(windowRectangle));
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
            
            // Transforms points from camera to screen
            this.screenTransform = Geometry.PolyToRectTransform(this.screenPoly, new Geometry.Rectangle(5, 5, this.fullCanvas.width - 10, this.fullCanvas.height - 10));
            
            // Add a button for confirming the shared rectangle
            var buttonImage = new Image();
            buttonImage.src = 'doneButton.png';
            
            var button = new Button(5, 5, 100, 100, buttonImage, this.fullContext);
            button.method = this.confirmSharedRectangle;
            
            var cs = MediaExt.createCanvas(320, 240);
            var cb = MediaExt.createCanvas(320, 240);
            
            this.buttons = new Buttons(this.screenTransform);
            this.buttons.AddButton(button);
            this.buttons.Draw();
            this.buttons.Start(this.video, cs.getContext("2d"), cb.getContext("2d"));
            
            // Clear the canvas and go to the next calibration stage
            this.fullContext.clearRect(0, 0, this.fullCanvas.width, this.fullCanvas.height);
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
        
    this.sharedRectPrev = this.sharedRect.copy();
    
    for (var i = 0; i < markers.length; i++) {
            
        marker = markers[i];
            
        console.log(marker.id);
            
        // If the left marker is found, move the shared rectangle
        if (marker.id == LEFT_MARKER_ID) {
            foundLeft = true;
            var transformedCorners = this.screenTransform.transformPoly(marker.corners);
            leftMarkerCorner = transformedCorners[Geometry.findTopLeftCorner(transformedCorners)];
            this.sharedRect.x = leftMarkerCorner.x;
            this.sharedRect.y = leftMarkerCorner.y - this.sharedRect.height;
        }
    }
    
    if (foundLeft) {
        for (var i = 0; i < markers.length; i++) {
            
            marker = markers[i];
            // If the right marker is also found, resize the window
            if (marker.id == RIGHT_MARKER_ID && foundLeft) {
                var transformedCorners = this.screenTransform.transformPoly(marker.corners);
                rightMarkerCorner = transformedCorners[Geometry.findTopLeftCorner(transformedCorners)];
                this.sharedRect.width = rightMarkerCorner.x - leftMarkerCorner.x;
                this.sharedRect.height = this.sharedRect.width * DEFAULT_RATIO;
            }
            
            this.sharedRect.makePositive();
        }
    }
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
    console.log("tada " + this.calibrationStage);
    if (this.calibrationStage == 2) {
        console.log("aha");
        this.calibrationStage = 3;
        // TODO: Stop drawing buttons
    }
}


