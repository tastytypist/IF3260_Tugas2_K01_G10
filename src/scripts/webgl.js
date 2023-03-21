var gl;

function defineWebGL(canvas) {
    gl = canvas.getContext('webgl');

    return gl;
}

function createBuffer(vertices, indices) {
    /* Step2: Define the geometry and store it in buffer objects */

    // Create vertex buffer
    var vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Create index buffer
    var index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
}

function createShader(color) {
    /* Step3: Create and compile Shader programs */
    // Vertex shader source code
    var vertCode =
    `attribute vec3 coordinates;
    void main(void) {
        gl_Position = vec4(coordinates, 1.0);
    }`;

    //Create, attach, compile a vertex shader object
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);

    //Fragment shader source code
    var fragCode = 
    `void main(void) { 
        gl_FragColor = vec4(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]});
    }`;

    // Create, attach, compile fragment shader object
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(fragShader);

    // Create a shader program object to store combined shader program
    var shaderProgram = gl.createProgram();

    // Attach a vertex shader and fragment shader
    gl.attachShader(shaderProgram, vertShader); 
    gl.attachShader(shaderProgram, fragShader);

    // Link both programs and use
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
    
    /* Step 4: Associate the shader programs to buffer objects */
    
    //Get the attribute location
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");

    //point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

    //Enable the attribute
    gl.enableVertexAttribArray(coord);
}

function render(indices) {
    // Resize canvas
    resizeCanvasToDisplaySize(gl.canvas);
    
    // Clear the canvas
    gl.clearColor(1, 1, 1, 0);
   
    // Enable the depth test
    gl.enable(gl.DEPTH_TEST); 
    
    // Clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);
   
    // Set the view port
    gl.viewport(0,0,canvas.width,canvas.height);
   
    // Draw the triangle
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);
}

function resizeCanvasToDisplaySize(canvas) {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    const displayWidth  = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    // Check if the canvas is not the same size.
    const needResize = canvas.width  !== displayWidth ||
                       canvas.height !== displayHeight;

    if (needResize) {
      // Make the canvas the same size
      canvas.width  = displayWidth;
      canvas.height = displayHeight;
    }

    return needResize;
  }

export { defineWebGL, createBuffer, createShader, render };