
/**
  Requires sylvester.js to be included in html
 */

var Geometry = Geometry || {};

Geometry.Point = function(x, y) {
	this.x = x;
	this.y = y;
};

Geometry.Rectangle = function(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
};

Geometry.Rectangle.prototype.copy = function() {
	return new Geometry.Rectangle(this.x, this.y, this.width, this.height);
}

Geometry.Rectangle.prototype.makePositive = function() {

	if (this.width < 0) {
		this.width = -this.width;
		this.x -= this.width;
	}

	if (this.height < 0) {
		this.height = -this.height;
		this.y -= this.height;
	}
};

Geometry.Rectangle.prototype.draw = function(ctx) {
	ctx.lineWidth = 3;
	ctx.strokeStyle = "red";
	ctx.strokeRect(this.x, this.y, this.width, this.height);
}

/**
  Returns a rectangle containing all points of poly
 */
Geometry.rectFromPoly = function(poly) {

	var minX = Infinity,
		minY = Infinity,
		maxX = -Infinity,
		maxY = -Infinity;

	for (var i = 0; i < poly.length; i++) {
		minX = Math.min(minX, poly[i].x);
		maxX = Math.max(maxX, poly[i].x);
		minY = Math.min(minY, poly[i].y);
		maxY = Math.max(maxY, poly[i].y);
	}

	return new Geometry.Rectangle(minX, minY, (maxX - minX), (maxY - minY));
};

Geometry.drawPolys = function(polys, ctx) {

	var corners, corner, i, j;

	ctx.lineWidth = 3;

	for (i = 0; i < polys.length; i++) {

		corners = polys[i];

		// Create a path to draw the poly
		ctx.strokeStyle = "blue";
		ctx.beginPath();

		for (j = 0; j < corners.length; j++) {
			corner = corners[j];
			ctx.moveTo(corner.x, corner.y);
			corner = corners[(j + 1) % corners.length];
			ctx.lineTo(corner.x, corner.y);
		}

		ctx.stroke();
		ctx.closePath();

		// Mark the corners with small green rectangles
		ctx.strokeStyle = "green";
		for (j = 0; j < corners.length; j++) {
			corner = corners[j];
			ctx.strokeRect(corners[j].x - 1, corners[j].y - 1, 2, 2);
		}
	}
};

// Returns the index of the upper left corner of the given polygon
Geometry.findTopLeftCorner = function(poly) {

	var leftMostX = Infinity,
		secMostX = Infinity;
	var first, second;
	for (var i = 0; i < 4; i++) {

		if (poly[i].x < leftMostX) {
			first = i;
			leftMostX = poly[i].x;
		}
	}
	for (var i = 0; i < 4; i++) {
		if (poly[i].x < secMostX && i != first) {
			second = i;
			secMostX = poly[i].x;
		}
	}

	return (poly[first].y > poly[second].y) ? second : first;
};

/**
  Constructor. Creates a Transform object used for corner fitting and
  mapping coordinates between arbitrary four-sided polygons
 */
Geometry.Transform = function(fromPoly, toPoly) {

	this._fromPoly = fromPoly;
	this._toPoly = toPoly;

	var M = $M([
			[toPoly[0].x * toPoly[0].y, toPoly[0].x, toPoly[0].y, 1],
			[toPoly[1].x * toPoly[1].y, toPoly[1].x, toPoly[1].y, 1],
			[toPoly[2].x * toPoly[2].y, toPoly[2].x, toPoly[2].y, 1],
			[toPoly[3].x * toPoly[3].y, toPoly[3].x, toPoly[3].y, 1]
			]);

	var A = $M([
			[fromPoly[0].x],
			[fromPoly[1].x],
			[fromPoly[2].x],
			[fromPoly[3].x]
			]);

	var B = $M([
			[fromPoly[0].y],
			[fromPoly[1].y],
			[fromPoly[2].y],
			[fromPoly[3].y]
			]);

	var Minv = M.inv();
	var a = Minv.multiply(A);
	var b = Minv.multiply(B);
    
	this._a = [a.e(1, 1), a.e(2, 1), a.e(3, 1), a.e(4, 1)];
	this._b = [b.e(1, 1), b.e(2, 1), b.e(3, 1), b.e(4, 1)];
	
    this._imageDataOut = null;
};

Geometry.Transform.prototype.inverse = function() {
	return new Geometry.Transform(this._toPoly, this._fromPoly);
}

Geometry.PolyToRectTransform = function(fromPoly, toRect) {

	toPoly = [new Geometry.Point(toRect.x, toRect.y),
		   new Geometry.Point(toRect.x + toRect.width, toRect.y),
		   new Geometry.Point(toRect.x + toRect.width, toRect.y + toRect.height),
		   new Geometry.Point(toRect.x, toRect.y + toRect.height)];

	return new Geometry.Transform(fromPoly, toPoly);
}

Geometry.PolyToCanvasTransform = function(poly, canvas) {
    var canvasPoly = [new Geometry.Point(0, 0),
                      new Geometry.Point(canvas.width, 0),
                      new Geometry.Point(canvas.width, canvas.height),
                      new Geometry.Point(0, canvas.height)];
    return new Geometry.Transform(poly, canvasPoly);
}

Geometry.Transform.prototype.transformPoint = function(p) {
	var nx, ny;
	nx = Math.round(this._a[0] * p.x * p.y +
					this._a[1] * p.x +
					this._a[2] * p.y +
					this._a[3]);
	ny = Math.round(this._b[0] * p.x * p.y +
					this._b[1] * p.x +
					this._b[2] * p.y +
					this._b[3]);
	return new Geometry.Point(nx, ny);
};

/**
  Transforms the points of poly using the Transform mapping
 */
Geometry.Transform.prototype.transformPoly = function(poly) {

	var newPoly = [];
	var nx, ny;

	for (var i = 0; i < poly.length; i++) {
		newPoly.push(this.transformPoint(poly[i]));
	}

	return newPoly;
};

/**
 Uses a smaller polygon to divide a larger polygon into four
 (better explanation coming soon!)
 */
Geometry.splitIntoFour = function(bigPoly, smallPoly) {
    
    /* The coordinate pairs that will be used
     for as corners in the resulting polyons */
    var x1, x2, x3, x4, x5, x6, x7, x8, x9;
    var y1, y2, y3, y4, y5, y6, y7, y8, y8;
    
    /* The four corners of the input polygons, going
     clockwise from northwest to southwest) */
    var bigNW, bigNE, bigSE, bigSW;
    var smallNW, smallNE, smallSW;
    
    var bigNWIndex = Geometry.findTopLeftCorner(bigPoly);
    var smallNWIndex = Geometry.findTopLeftCorner(smallPoly);
    
    bigNW = bigPoly[bigNWIndex];
    bigNE = bigPoly[(bigNWIndex + 1) % 4];
    bigSE = bigPoly[(bigNWIndex + 2) % 4];
    bigSW = bigPoly[(bigNWIndex + 3) % 4];
    
    smallNW = smallPoly[smallNWIndex];
    smallNE = smallPoly[(smallNWIndex + 1) % 4];
    // Unused: smallSE = bigSE;
    smallSW = smallPoly[(smallNWIndex + 3) % 4];
    
    x1 = bigNW.x;
    y1 = bigNW.y;
    
    // (x2, y2) unknown at this stage.
    
    x3 = bigNE.x;
    y3 = bigNE.y;
    
    // (x4, y4) unknown at this stage.
    
    x5 = smallNW.x;
    y5 = smallNW.y;
    
    x6 = smallNE.x;
    y6 = smallNE.y;
    
    x7 = bigSW.x;
    y7 = bigSW.y;
    
    x8 = smallSW.x;
    y8 = smallSW.y;
    
    x9 = bigSE.x;
    y9 = bigSE.y;
    
    var k1, k2, k3, k4;
    var m1, m2, m3, m4;
    
    // Equation for line through (x1, y1), (x2, y2) and (x3, y3)
    k1 = (y3 - y1) / (x3 - x1);
    m1 = y1 - k1 * x1;
    
    // Equation for line through (x4, y4), (x5, y5) and (x6, y6)
    k2 = (y6 - y5) / (x6 - x5);
    m2 = y5 - k2 * x5;
    
    // Check if the incline is infinite
    if (x7 == x1) {
        x4 = x7;
    } else {
        // Equation for line through (x1, y1), (x4, y4) and (x7, y7)
        k3 = (y7 - y1) / (x7 - x1);
        m3 = y1 - k3 * x1;
        
        x4 = (m3 - m2) / (k2 - k3);
    }
    y4 = k2 * x4 + m2;
    
    // Check if the incline is infinite
    if (x8 == x5) {
        x2 = x8;
    } else {
        // Equation for line through (x2, y2), (x5, y8) and (x5, y8)
        k4 = (y8 - y5) / (x8 - x5);
        m4 = y5 - k4 * x5;
        
        x2 = (m4 - m1) / (k1 - k4);
    }
    y2 = k1 * x2 + m1;
    
    q1 = [
          new Geometry.Point(x1, y1),
          new Geometry.Point(x2, y2),
          new Geometry.Point(x5, y5),
          new Geometry.Point(x4, y4)
          ];
    
    q2 = [
          new Geometry.Point(x2, y2),
          new Geometry.Point(x3, y3),
          new Geometry.Point(x6, y6),
          new Geometry.Point(x5, y5)
          ];
    
    q3 = [
          new Geometry.Point(x5, y5),
          new Geometry.Point(x6, y6),
          new Geometry.Point(x9, y9),
          new Geometry.Point(x8, y8)
          ];
    
    q4 = [
          new Geometry.Point(x4, y4),
          new Geometry.Point(x5, y5),
          new Geometry.Point(x8, y8),
          new Geometry.Point(x7, y7)
          ];
    
    return [q1, q2, q3, q4];
}


/**
 @param imageDataIn source data to transform
 @param dstCanvas canvas to put the transformed image into
 @param offset optional offset, if the image data coordinates doesn't match the transform's coordinates
 */
Geometry.Transform.prototype.transformImage = function(imageDataIn, dstCanvas, offset) {
	
	var ctx = dstCanvas.getContext("2d");
    var imageDataOut;
    
	// Make sure outdata buffer exists and is of the correct size
    if (this._imageDataOut == null ||
        this._imageDataOut.width != dstCanvas.width ||
        this._imageDataOut.height != dstCanvas.height) {
        imageDataOut = ctx.createImageData(dstCanvas.width, dstCanvas.height);
    } else {
        imageDataOut = this._imageDataOut;
    }
	
	// Set offset to (0, 0) if none is passed
	if (!offset) {
		// console.log("What are you doing here?");
		offset = {x:0, y:0};
	}
	
	var dataIn = imageDataIn.data,
		dataOut = imageDataOut.data;

	var rowWidth = imageDataIn.width;
	var indexOut = 0;
	
	// Reordered loop for better data locality
	// (access [1, 2, 3, 4, 5, 6, 7, 8] instead of [1, 3, 5, 7, 2, 4, 6, 8])
	for (var y = 0; y < dstCanvas.height; y++) {
		for (var x = 0; x < dstCanvas.width; x++) {
		
			var nx = Math.round(this._a[0] * x * y +
								this._a[1] * x +
								this._a[2] * y +
								this._a[3] -
								offset.x);
			
			var ny = Math.round(this._b[0] * x * y +
								this._b[1] * x +
								this._b[2] * y +
								this._b[3] -
								offset.y);
			
			var indexIn = (nx + ny * rowWidth) * 4;

			dataOut[indexOut++] = dataIn[indexIn];
			dataOut[indexOut++] = dataIn[indexIn + 1];
			dataOut[indexOut++] = dataIn[indexIn + 2];
			dataOut[indexOut++] = dataIn[indexIn + 3];
		}
	}

	ctx.putImageData(imageDataOut, 0, 0);
    this._imageDataOut = imageDataOut;
};
