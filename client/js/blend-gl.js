
/**
 Library for merging images using WebGL. Currently only has support for
 merging images with one shader that uses a blend function similar to 
 Photoshop's 'darken' blend mode (shader code in vsStr and fsStr below).
 I will add some more filters if I have time! / Jimmy
 */
BlendGL = function() {
	
	// Create a canvas and WebGL context
	var canvas = document.createElement("canvas");
	var gl = WebGLUtils.setupWebGL2D(canvas);
	
	// If gl is null, WebGL is unavailable
	// Let the mergeImages function throw an exception to indicate this
	if (!gl) {
		return {
			mergeImages:function() { throw "WebGL not available"; }
		};
	}
	
	// Vertex shader
	var vsStr = [
				 "precision mediump float;",
				 "attribute vec2 position;",
				 "attribute vec2 texCoord;",
				 "varying vec2 uv;",
				 
				 "void main(void) {",
					// Flip y, textures are upside down by default
					"gl_Position = vec4(position.x, -position.y, 0.0, 1.0);",
					"uv = texCoord;",
				 "}"
				 ].join("\n");
	
	// Fragment shader
	var fsStr = [
				 "precision mediump float;",
				 "uniform sampler2D tex1, tex2;",
				 "varying vec2 uv;",
				 
				 "void main() {",
					"vec4 c1 = texture2D(tex1, uv);",
					"vec4 c2 = texture2D(tex2, uv);",
					// Blend function (probably not quite right): 
					"gl_FragColor = vec4(min(c2.rgb * c1.a, c1.rgb * c2.a) + c2.rgb * (1.0 - c1.a) + c1.rgb * (1.0 - c2.a), 1.0) * 3.0;",
				 "}"
				 ].join("\n");
	
	// Create the shader program
	var prog = WebGLUtils.createProgram(gl, vsStr, fsStr);
	
	// Store the attribute and uniform locations as properties of the program
	prog.attrLocPosition = gl.getAttribLocation(prog, 'position');
	prog.attrLocTexCoord = gl.getAttribLocation(prog, 'texCoord');
	prog.unifLocTex1 = gl.getUniformLocation(prog, 'tex1');
	prog.unifLocTex2 = gl.getUniformLocation(prog, 'tex2');

	// Interleaved vertex and texture coordinate data
	var data = [-1, -1,
				 0,  0,
				 1, -1,
				 1,  0,
				-1,  1,
				 0,  1,
				 1,  1,
				 1,  1];
	
	// Create a buffer for the vertex and texture coordinate data
	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	
	// Create two textures to use when blending
	var baseTex = WebGLUtils.createTexture(gl);
	var overlayTex = WebGLUtils.createTexture(gl);

	/**
	 Private function that uses the above shader program to merge two images.
	 */
	var merge = function(img1, img2) {
		
		// Resize the canvas, if necessary (use the size of the first image)
		if (canvas.width != img1.width ||
			canvas.height != img1.height) {
			canvas.width = img1.width;
			canvas.height = img1.height;
			gl.viewport(0, 0, canvas.width, canvas.height);
		}
		// Activate shaders
		gl.useProgram(prog);
		
		// Bind and create base texture
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, baseTex);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img1);
		
		// Bind and create overlay texture
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, overlayTex);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img2);
		
		// Bind vertex buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		
		// Send uniform values to GPU
		gl.uniform1i(prog.unifLocTex1, 0);
		gl.uniform1i(prog.unifLocTex2, 1);
		
		// Send vertex attributes to GPU
		gl.enableVertexAttribArray(prog.attrLocPosition);
		gl.enableVertexAttribArray(prog.attrLocTexCoord);
		gl.vertexAttribPointer(prog.attrLocPosition, 2, gl.FLOAT, false, 16, 0);
		gl.vertexAttribPointer(prog.attrLocTexCoord, 2, gl.FLOAT, false, 16, 8);
		
		// Render the image
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		
		// Unbind textures and buffers
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, null);
		
		// The blend result is rendered to canvas, return it
		/*
		 TODO:
		 Render intermediate results to framebuffer instead, should be more efficient
		 */
		return canvas;
	}
	
	/**
	 Public function for merging a list of images.
	 Should include a parameter for blend function(s)/programs in the future,
	 but we only have one at the moment :)
	 */
	var mergeImages = function(images) {

		if (images.length > 1) {
			var tmpImage = images[0];
			for (var i = 1; i < images.length; i++) {
				tmpImage = merge(tmpImage, images[i]);
			}
			return tmpImage;
		} else if (images.length < 1) {
			// No pictures to merge.
			return null;
		} else {
			// Only one picture supplied, so nothing to merge.
			return images[0];
		}
	}

	// Return the public interface
	return {
		mergeImages:mergeImages
	};
}();

	

	