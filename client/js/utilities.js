/**
* utilities.js
*/

var Utilities = Utilities || {};

/*
 * Merge any number of images, using the Pixastic library function blend. 
 * @images array of image / canvas objects.
 * returns the merged image, or null if no argument supplied.
 */
Utilities.mergeImages = function(images) {
   if (images.length > 1) {
        var tmpImage = images[0];
        for (var i = 1; i < images.length; i++) {
            tmpImage = Pixastic.process(tmpImage, "blend", 
            {
                amount : 1, 
                mode : "multiply", 
                image : images[i]
            }
            );
        }
        return tmpImage;    
    } else if (images.length < 1) {
        // No pictures to merge.
        console.log("No argument given to Utilities.mergeImages; returns null.");
        return null;
    } else {
        // Only one picture supplied, so nothing to merge.
        console.log("Only one image given to Utilities.mergeItems; returns image.")
        return images[0];
    }	
}

/*
 * Downloads the data of the given canvas as filename.PNG or 
 * <TODAYSDATE>.png if no argument is supplied.
 *
 */
Utilities.downloadCanvasAsPng = function(filename, canvas) {
    if (canvas) {
        var link = document.createElement('a');
        link.href = canvas.toDataURL("image/png");

        if (filename) {
            link.download = filename;
        } else {
            var d = new Date();
            var date = d.getFullYear()
                + ('0' + String(d.getMonth()+1)).substr(-2)
                + ('0' + String(d.getDate())).substr(-2);
                link.download=date;
        }
        link.click();
    } else {
        console.log("No canvas passed Utilities.downloadCanvasAsPng.");
    }
}
