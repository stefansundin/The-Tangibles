
/**
 By Pitebros - comments coming soon :)
 */

var MediaExt = MediaExt || {};

MediaExt.getCameraAccess = function(width, height, onSuccessCallback) {
	
	video = document.createElement('video');
    video.width = width;
    video.height = height;
    video.autoplay = true;
    
	// Try different vendor prefixes, if necessary
    var getUserMedia = function(t, onsuccess, onerror) {
        if (navigator.getUserMedia) {
            return navigator.getUserMedia(t, onsuccess, onerror);
        } else if (navigator.webkitGetUserMedia) {
            return navigator.webkitGetUserMedia(t, onsuccess, onerror);
        } else if (navigator.mozGetUserMedia) {
            return navigator.mozGetUserMedia(t, onsuccess, onerror);
        } else if (navigator.msGetUserMedia) {
            return navigator.msGetUserMedia(t, onsuccess, onerror);
        } else {
            onerror(new Error("No getUserMedia implementation found."));
        }
    };
    
    var URL = window.URL || window.webkitURL;
    var createObjectURL = URL.createObjectURL || webkitURL.createObjectURL;
    if (!createObjectURL) {
        throw new Error("URL.createObjectURL not found.");
    }
    
    getUserMedia({'video' : true }, // getVideo, 'audio' : getAudio} ,
                 function(stream) {
                    var url = createObjectURL(stream);
                    video.src = url;
                    onSuccessCallback();
                 },
                 function(error) {
                    alert("Couldn't access webcam.");
                 });
	
	return video;
}


MediaExt.createCanvas = function(width, height) {
  	var newCanvas = document.createElement('canvas');
	newCanvas.width = width;
    newCanvas.height = height;
    return newCanvas;
}
