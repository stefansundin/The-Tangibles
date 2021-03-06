
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
    ctx.strokeStyle = "blue";
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
    
    Minv = M.inv();
    
    this._a = Minv.multiply(A);
    this._b = Minv.multiply(B);
};

Geometry.PolyToRectTransform = function(fromPoly, toRect) {
    
    toPoly = [new Geometry.Point(toRect.x, toRect.y),
              new Geometry.Point(toRect.x + toRect.width, toRect.y),
              new Geometry.Point(toRect.x + toRect.width, toRect.y + toRect.height),
              new Geometry.Point(toRect.x, toRect.y + toRect.height)];
    
    return new Geometry.Transform(fromPoly, toPoly);
}

Geometry.Transform.prototype.transformPoint = function(p) {
    var nx, ny;
    nx = Math.round(this._a.e(1, 1) * p.x * p.y +
                    this._a.e(2, 1) * p.x +
                    this._a.e(3, 1) * p.y +
                    this._a.e(4, 1));
    ny = Math.round(this._b.e(1, 1) * p.x * p.y +
                    this._b.e(2, 1) * p.x +
                    this._b.e(3, 1) * p.y +
                    this._b.e(4, 1));
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

Geometry.Transform.prototype.transformImage = function(imageDataIn, dstCanvas) {
    
    var ctx = dstCanvas.getContext("2d");
    var newData = ctx.createImageData(dstCanvas.width, dstCanvas.height);
    var dataIn = imageDataIn.data;
    var dataOut = newData.data;
    
    for (var i = 0; i < dstCanvas.width; i++) {
        for (var j = 0; j < dstCanvas.height; j++) {
            
            var I = Math.round(this._a.e(1, 1) * i * j +
                               this._a.e(2, 1) * i +
                               this._a.e(3, 1) * j +
                               this._a.e(4, 1));
            var J = Math.round(this._b.e(1, 1) * i * j +
                               this._b.e(2, 1) * i +
                               this._b.e(3, 1) * j +
                               this._b.e(4, 1));
            var ci = i * 4 + j * dstCanvas.width * 4,
                di = I * 4 + J * dstCanvas.width * 4;
            
            dataOut[ci]     = dataIn[di];
            dataOut[ci + 1] = dataIn[di + 1];
            dataOut[ci + 2] = dataIn[di + 2];
            dataOut[ci + 3] = dataIn[di + 3];
        }
    }
    
    ctx.putImageData(newData, 0, 0);
};


Geometry.Transform.prototype.transformImageToRect = function(imageDataIn, dstCanvas, dstRect) {
    
    var ctx = dstCanvas.getContext("2d");
    var newData = ctx.createImageData(dstRect.width, dstRect.height);
    var dataIn = imageDataIn.data;
    var dataOut = newData.data;
    
    // console.log(dataIn.length + "," + dataOut.length);
    
    for (var i = 0; i < dstRect.width; i++) {
        for (var j = 0; j < dstRect.height; j++) {
            
            var I = Math.round(this._a.e(1, 1) * i * j +
                               this._a.e(2, 1) * i +
                               this._a.e(3, 1) * j +
                               this._a.e(4, 1));
            var J = Math.round(this._b.e(1, 1) * i * j +
                               this._b.e(2, 1) * i +
                               this._b.e(3, 1) * j +
                               this._b.e(4, 1));
            
            var ci = i * 4 + j * newData.width * 4,
                di = I * 4 + J * imageDataIn.width * 4;
            
            dataOut[ci]     = dataIn[di];
            dataOut[ci + 1] = dataIn[di + 1];
            dataOut[ci + 2] = dataIn[di + 2];
            dataOut[ci + 3] = dataIn[di + 3];
        }
    }
    // newCtx.putImageData(newData, 0, 0);
    // ctx.drawImage(newCanvas, dstRect.x, dstRect.y, dstRect.width, dstRect.height);
    
    ctx.putImageData(newData, dstRect.x, dstRect.y);
};


