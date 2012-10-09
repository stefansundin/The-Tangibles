
/**
 By Pitebros - more comments coming soon :)
 */

var ImageProc = ImageProc || {};

ImageProc.HSVFilter = function() {
    
    this.HSV = [];
    this.thres = [];
    
    this.lowerH = 0;
    this.upperH = 360;
    
    this.lowerS = 0;
    this.upperS = 1;
    
    this.lowerV = 0;
    this.upperV = 1;
}

ImageProc.HSVFilter.prototype.setHueThreshold = function(lower, upper) {
    // Check [0, 360]?
    this.lowerH = lower;
    this.upperH = upper;
}

ImageProc.HSVFilter.prototype.setSaturationThreshold = function(lower, upper) {
    // Check [0, 1]?
    this.lowerS = lower;
    this.upperS = upper;
}

ImageProc.HSVFilter.prototype.setValueThreshold = function(lower, upper) {
    // Check [0, 1]?
    this.lowerV = lower;
    this.upperV = upper;
}

ImageProc.HSVFilter.prototype.shiftHueThreshold = function(degrees) {
    this.lowerH = (this.lowerH + degrees) % 360;
    this.upperH = (this.upperH + degrees) % 360;
}

ImageProc.HSVFilter.prototype.threshold = function(RGBData) {
    ImageProc.HSVFromRGBImage(RGBData, this.HSV);
    ImageProc.HSVThreshold(this.HSV,    this.thres,
                           this.lowerH, this.upperH,
                           this.lowerS, this.upperS,
                           this.lowerV, this.upperV);
    return this.thres;
}

ImageProc.HSVFilter.prototype.filter = function(srcRGB) {
    
	for (var i = 0; i < srcRGB.length; i += 4) {
        
        R = srcRGB[i + 0];
        G = srcRGB[i + 1];
        B = srcRGB[i + 2];
		
		var max = Math.max(R, G, B),
        min = Math.min(R, G, B),
        H, S, V = max / 255.0,
        delta = max - min;
        
    	S = (max == 0) ? 0 : delta / max;
        
    	if (max == min) {
        	H = 0; // achromatic
    	} else {
        	switch (max) {
            	case R: H = (G - B) / delta + (G < B ? 6 : 0); break;
            	case G: H = (B - R) / delta + 2; break;
            	case B: H = (R - G) / delta + 4; break;
        	}
        	H = (H / 6) * 360;
    	}
        
		if (((this.lowerH < this.upperH) && (H < this.lowerH || H > this.upperH)) ||
			((this.lowerH >= this.upperH) && (H < this.lowerH && H > this.upperH)) || // Threshold on hue
            (S < this.lowerS || S > this.upperS) ||  								  // Threshold on saturation
            (V < this.lowerV || V > this.upperV))    								  // Threshold on value
		{
          	srcRGB[i + 0] = 255;
			srcRGB[i + 1] = 255;
			srcRGB[i + 2] = 255;
		}
	}
}


/**
 * Creates an array with the HSV-values
 * corresponding to each pixel in imageData
 *
 * @param    ImageData imageData   The RGB-representation of the image
 */
ImageProc.HSVFromRGBImage = function(srcRGB, dstHSV) {
    
    var i, j,
    R, G, B;
    
    for (i = 0, j = 0; i < srcRGB.length; i += 4, j += 3) {
        
        R = srcRGB[i + 0];
        G = srcRGB[i + 1];
        B = srcRGB[i + 2];
        
        ImageProc.HSVFromRGBPixelX(R, G, B, dstHSV, j);
    }
}

/**
 * Converts an RGB color value to HSV. Conversion formula
 * Assumes R, G, and B are contained in the set [0, 255] and
 * returns H in [0, 360], S and V in [0, 1].
 *
 * @param    Number R    The red color value
 * @param    Number G    The green color value
 * @param    Number B    The blue color value
 * @return   Array       The HSV representation
 */
ImageProc.HSVFromRGBPixelX = function(R, G, B, dst, dstStartIndex) {
    
    var max = Math.max(R, G, B),
    min = Math.min(R, G, B),
    H, S, V = max / 255.0,
    delta = max - min;
    
    S = (max == 0) ? 0 : delta / max;
    
    if (max == min) {
        H = 0; // achromatic
    } else {
        switch (max) {
            case R: H = (G - B) / delta + (G < B ? 6 : 0); break;
            case G: H = (B - R) / delta + 2; break;
            case B: H = (R - G) / delta + 4; break;
        }
        H = (H / 6) * 360;
    }
    
    dst[dstStartIndex + 0] = H;
    dst[dstStartIndex + 1] = S;
    dst[dstStartIndex + 2] = V;
}

/**
 * Converts an RGB color value to HSV. Conversion formula
 * Assumes R, G, and B are contained in the set [0, 255] and
 * returns H in [0, 360], S and V in [0, 1].
 *
 * @param    Number R    The red color value
 * @param    Number G    The green color value
 * @param    Number B    The blue color value
 * @return   Array       The HSV representation
 */
ImageProc.HSVFromRGBPixel = function(R, G, B) {
    
    var max = Math.max(R, G, B),
    min = Math.min(R, G, B);
    
    var H, S, V = max / 255.0;
    var delta = max - min;
    
    S = (max == 0) ? 0 : delta / max;
    
    if (max == min) {
        H = 0; // achromatic
    } else {
        switch (max) {
            case R: H = (G - B) / delta + (G < B ? 6 : 0); break;
            case G: H = (B - R) / delta + 2; break;
            case B: H = (R - G) / delta + 4; break;
        }
        H = (H / 6) * 360;
    }
    return [H, S, V];
}

ImageProc.HSVThreshold = function(srcHSV, dstGrey,
                                  lowerH, upperH,
                                  lowerS, upperS,
                                  lowerV, upperV) {
    
    var H, S, V,
    i, HSVIndex = 0;
    
    if (lowerH < upperH) {
        
        for (i = 0; HSVIndex < srcHSV.length; i++) {
            
            H = srcHSV[HSVIndex++];
            S = srcHSV[HSVIndex++];
            V = srcHSV[HSVIndex++];
            
            dstGrey[i] = 255;
            
            if ((H < lowerH || H > upperH) || // Threshold on hue
                (S < lowerS || S > upperS) || // Threshold on saturation
                (V < lowerV || V > upperV))   // Threshold on value
            {
                dstGrey[i] = 0;
            }
        }
        
    } else {
        
        for (i = 0; HSVIndex < srcHSV.length; i++) {
            
            H = srcHSV[HSVIndex++];
            S = srcHSV[HSVIndex++];
            V = srcHSV[HSVIndex++];
            
            dstGrey[i] = 255;
            
            if ((H < lowerH && H > upperH) || // Threshold on hue
                (S < lowerS || S > upperS) || // Threshold on saturation
                (V < lowerV || V > upperV))   // Threshold on value
            {
                dstGrey[i] = 0;
            }
        }
        
    }    
    return dstGrey;
}

