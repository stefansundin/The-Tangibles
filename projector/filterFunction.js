
var canvas, context;

const CANVAS_WIDTH = 640, CANVAS_HEIGHT = 480;

const MINI_CANVAS_WIDTH = 320, MINI_CANVAS_HEIGHT = 240;

const FILTER_MARKER_ID = 1012;


// Creates a Filter object
Filter = function(canvas, transform) {
    
    this.hsvFilter = new ImageProc.HSVFilter();
    
    this.transform = transform;
    this.detector = new AR.Detector();
    
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    
    this.miniCanvas = MediaExt.createCanvas(MINI_CANVAS_WIDTH, MINI_CANVAS_HEIGHT);
    this.miniContext = this.miniCanvas.getContext("2d");
    
    this.filterRect = new Geometry.Rectangle(100, 100, 1, 1);
    this.sampleIndex;// = 0;
}

// Update the index of the R-value of the sample point
Filter.prototype.updateSampleIndex = function(imageData) {
        
    var markers = this.detector.detect(imageData);
    var marker;
    
    for (var i = 0; i < markers.length; i++) {
        
        marker = markers[i];
        if (marker.id == FILTER_MARKER_ID) {
            var transformedCorners = this.transform.transformPoly(marker.corners);
            samplePoint = transformedCorners[Geometry.findTopLeftCorner(transformedCorners)];
            
            this.sampleIndex = (imageData.width * 4) * samplePoint.y + samplePoint.x * 4
            
            //HAXXVARNING
            this.sampleIndex = (imageData.width * 4) * (samplePoint.y - 15) + (samplePoint.x- 15) * 4
            //HAXXVARNING
            break; // No need to check more markers
        }
    }
}

// Draw the marker rectangle used to select sample point (SKA SÄKERT TAS BORT)
Filter.prototype.drawFilterRect = function() {
    this.context.clearRect(0, 0, canvas.width, canvas.height);
    this.Geometry.drawPolys([this.filterRect], context);
}


// Set the filter values using the current sample point
Filter.prototype.setFilterValues = function(rgbaData) {
    
    var R = rgbaData[this.sampleIndex];
    var G = rgbaData[this.sampleIndex + 1];
    var B = rgbaData[this.sampleIndex + 2];
    
    var HSV = ImageProc.HSVFromRGBPixel(R, G, B);
    var H = HSV[0];
    var S = HSV[1];
    var V = HSV[2];
    
    hTolerance = 30;
    sTolerance = 0.1;
    vTolerance = 0.5;
    
    this.hsvFilter.setHueThreshold(H - hTolerance, H + hTolerance);
    this.hsvFilter.setSaturationThreshold(S - sTolerance, S + sTolerance);
    this.hsvFilter.setValueThreshold(V - vTolerance, V + vTolerance);
}


// Returns an enhanced version of the input image
Filter.prototype.filterImage = function(imageData) {
    this.updateSampleIndex(imageData); // Move?
    this.setFilterValues(imageData.data); // Move?
    /*
    this.hsvFilter.setHueThreshold(10, 350);
    this.hsvFilter.setSaturationThreshold(0.1, 0.9);
    this.hsvFilter.setValueThreshold(0.1, 0.9);
    */
    this.hsvFilter.filter(imageData.data);
}

