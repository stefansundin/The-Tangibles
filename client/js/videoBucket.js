
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

VideoBucket.prototype.initWebGL = function() {
	
	/*
	 Less efficient program but, for some reason, more accurate
	 (With the faster program the image is a bit distorted along the diagonal; interpolation problems or something...)
	 Here, the transform is calculated per fragment instead of per vertex
	 
	 // Vertex shader
	 var vsStr = [
	 "precision lowp float;",
	 "attribute vec2 vertex;",
	 "attribute vec2 uv1;",
	 "varying vec2 uv;",
	 "void main(void) {",
		"gl_Position = vec4(vertex.x, -vertex.y, 0.0, 1.0);",
		"uv = uv1;",
	 "}"
	 ].join("\n");
	 
	 // Fragment shader
	 var fsStr = [
	 "precision lowp float;",
	 "varying vec2 uv;",
	 "uniform vec4 a, b;",
	 "uniform float widthIn, heightIn;",
	 "uniform float widthOut, heightOut;",
	 "uniform sampler2D tex;",
	 "void main(void) {",
		"float x = uv.x * widthIn;",
		"float y = uv.y * heightIn;",
		"float nx = a.x * x * y + a.y * x + a.z * y + a.w;",
		"float ny = b.x * x * y + b.y * x + b.z * y + b.w;",
		"gl_FragColor = texture2D(tex, vec2(nx / widthOut, ny / heightOut));",
	"}"
	].join("\n");
	*/
	
	// Vertex shader
	var vsStr = [
				 "precision mediump float;",
				 "attribute vec2 vertex;",
				 "attribute vec2 uv1;",
				 "varying vec2 uv;",
				 "uniform vec4 a, b;",
				 "uniform float widthIn, heightIn;",
				 "uniform float widthOut, heightOut;",
				 "void main(void) {",
					"gl_Position = vec4(vertex.x, -vertex.y, 0.0, 1.0);",
					"float x = uv1.x * widthIn;",
					"float y = uv1.y * heightIn;",
					"float nx = a.x * x * y + a.y * x + a.z * y + a.w;",
					"float ny = b.x * x * y + b.y * x + b.z * y + b.w;",
					"uv = vec2(nx / widthOut, ny / heightOut);",
				 "}"
				 ].join("\n");
	
	// Fragment shader
	var fsStr = [
				 "precision mediump float;",
				 "varying vec2 uv;",
				 "uniform sampler2D tex;",
				 "void main(void) {",
					"gl_FragColor = texture2D(tex, uv);",
				 "}"
				 ].join("\n");
	
	
	var gl = WebGLUtils.setupWebGL2D(this.transformCanvas);
	
	if (!gl) {
		// WebGL is unavailable
		return;
	}
	
	// Create the shader program from the source code at the top of the page
	// var vsStr = document.getElementById("shader-vs").text;
	// var fsStr = document.getElementById("shader-fs").text;
	var prog = WebGLUtils.createProgram(gl, vsStr, fsStr);
	
	// Store the attribute and uniform locations as properties of the program
	prog.attrLocVertex = gl.getAttribLocation(prog, 'vertex');
	prog.attrLocTexCoord = gl.getAttribLocation(prog, 'uv1');
	prog.unifLocA = gl.getUniformLocation(prog, 'a');
	prog.unifLocB = gl.getUniformLocation(prog, 'b');
	prog.unifLocWidthIn = gl.getUniformLocation(prog, 'widthIn');
	prog.unifLocHeightIn = gl.getUniformLocation(prog, 'heightIn');
	prog.unifLocWidthOut = gl.getUniformLocation(prog, 'widthOut');
	prog.unifLocHeightOut = gl.getUniformLocation(prog, 'heightOut');
	prog.unifLocTex = gl.getUniformLocation(prog, 'tex');
	
	this.glContext = gl;
	this.program = prog;
	this.texture = WebGLUtils.createTexture(gl);
	
	this.generateBuffers();
	
	// Some logging
	console.log(vsStr);
	console.log(fsStr);
	console.log(prog);
}

/**
 Not used atm, will be removed (probably :)
 */
VideoBucket.prototype.generateBuffers = function() {
	
	var depth = this.prime.depth,
		fields = Math.pow(2, depth),
		dV = 2.0 / fields, // Space between vertices (x,y E [-1, 1])
		dT = 1.0 / fields; // Space between texture coordinates (s,t E [0, 1])
	
	var data = [],
		vertX = -1,
		vertY = -1,
		texX = 0,
		texY = 0;
	
	var gl = this.glContext;
	
	// Split the grid into 4^depth fields with a vertex/texture coordinate
	// in the corners of each field.
	for (var i = 0; i <= fields; i++) {
		
		vertX = -1;
		texX = 0;
		
		for (var j = 0; j <= fields; j++) {
			
			// Vertices and texture coordinates are interleaved
			data.push(vertX);
			data.push(vertY);
			data.push(texX);
			data.push(texY);
			
			vertX += dV;
			texX += dT;
		}
		
		vertY += dV;
		texY += dT;
	}
	
	console.log(data);
	
	// Buffer vertices and texture coordinates
	this.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	
	// Let each child calculate its indices into the vertex array
	var indices = [];
	this.prime.prepareForRendering(indices, this.transformCanvas, gl, fields + 1);
	
	console.log(indices);
	
	var index = 8;
	for (var i = 0; i < 4; i++) {
		console.log("x:" + data[indices[index] * 4] +
					", y:" + data[indices[index] * 4 + 1]);
		index++;
	}
	// Buffer indices
	this.indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}


/**
 Call this function after calibration
 @param poly Poly returned by the Calibrator
 @param rect The local shared rectangle
 */
VideoBucket.prototype.setTransform = function(prime, rect,
											  detectionWidth,
											  detectionHeight) {
    
    console.log('creating transform');
    console.log(rect);
    
	this.prime = prime;
    this.transformCanvas = MediaExt.createCanvas(rect.width, rect.height);
	this.initWebGL();
	this.detectionWidth = detectionWidth;
	this.detectionHeight = detectionHeight;
	
	if (!this.glContext) {
		// If WebGL failed to initialize,
		// use the old method as fallback
		this.transformContext = this.transformCanvas.getContext("2d");
		this.videoCanvas = MediaExt.createCanvas(this.video.width, this.video.height);
		this.videoContext = this.videoCanvas.getContext("2d");
    }
	
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
	
	console.log('Crop rectangle:');
	console.log(cropRect);
    */
}

VideoBucket.prototype.toggleEnabled = function() {
	console.log('toggle change');
	this.enabled = !this.enabled;
}

VideoBucket.prototype.transformVideo = function() {
    
    if (this.prime == null) { //  || !this.enabled) {
		return null;
    }
	
	// If the current frame of the video has already been transformed,
	// just return the transform canvas
	if (this.lastTransformedTimestamp == this.video.currentTime) {
		return this.transformCanvas;
	}

	this.lastTransformedTimestamp = this.video.currentTime;
	
	// Use WebGL if available, otherwise use the old method
	if (this.glContext) {
		var prog = this.program;
		var gl = this.glContext;
	
		// Generate a new texture from video stream
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.video);
		
		// Activate shaders
		gl.useProgram(prog);
		
		// Send values to the shaders
		gl.uniform1i(prog.unifLocTex, 0);
		gl.uniform1f(prog.unifLocWidthOut, this.detectionWidth); // video.width);
		gl.uniform1f(prog.unifLocHeightOut, this.detectionHeight); // video.height);

		// Render the transformed video
		this.prime.render(prog, gl);
	
		gl.bindTexture(gl.TEXTURE_2D, null);
	
	} else {

		// Draw the video
		this.videoContext.drawImage(this.video, 0, 0, this.video.width, this.video.height);

		// Get the image data
		var imageData = this.videoContext.getImageData(0, 0, this.video.width, this.video.height);
		
		/* Transform the video
		this.transform.transformImage(imageData,
									  this.transformCanvas,
									  this.videoCropRect);
		 */
		
		// Let Optimus Prime transform the video
		this.prime.draw(imageData, this.transformContext);
	}
	
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
