import * as helper from "./helper.js"

var gl;

// data
var globalPosition = [];
var globalColor = [];
var globalTranslation = [];
var globalRotation = [];
var globalScale = [];
var globalCount = 0;

// buffer
var positionBuffer;

// location
var positionLocation;
var colorLocation;
var matrixLocation;

// program
 var shaderProgram;

function defineWebGL(canvas) {
    gl = canvas.getContext('webgl');
    return gl;
}

function renderObject(object) {
    createBuffer(object.position, object.count, object.color, object.translation, object.rotation, object.scale)
    createShader();
    drawScene()
}

function createBuffer(position, count, color, translation, rotation, scale) {
    /* Step2: Define the geometry and store it in buffer objects */

    // Create position buffer
    if (!positionBuffer) {
        positionBuffer = gl.createBuffer();
    }
    globalPosition = position;
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(globalPosition), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    globalColor = color;
    globalTranslation = translation;
    globalRotation = [];
    rotation.forEach((d) => {
        globalRotation.push(helper.degToRad(d));
    })
    globalScale = scale;
    globalCount = count;
}

function createShader() {
    /* Step3: Create and compile Shader programs */
    // Vertex shader source code
    var vertCode =
    `attribute vec4 a_position;
    uniform mat4 u_matrix;
    void main(void) {
        // Multiply the position by the matrix
        gl_Position = u_matrix * a_position;
    }`;

    //Create, attach, compile a vertex shader object
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);

    //Fragment shader source code
    var fragCode = 
    `precision mediump float;
    uniform vec4 u_color;
    void main(void) { 
        gl_FragColor = u_color;
    }`;

    // Create, attach, compile fragment shader object
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(fragShader);

    // Check if fragment shader compiled successfully
    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
        console.error('Error compiling fragment shader: ', gl.getShaderInfoLog(fragShader));
        return;
    }

    shaderProgram = gl.createProgram();

    // Attach a vertex shader and fragment shader
    gl.attachShader(shaderProgram, vertShader); 
    gl.attachShader(shaderProgram, fragShader);

    // Link both programs
    gl.linkProgram(shaderProgram);

    // Check if shader program linked successfully
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Error linking shader program: ', gl.getProgramInfoLog(shaderProgram));
        return;
    }
    
    /* Step 4: Associate the shader programs to buffer objects */

    // Get Location of variable
    positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
    colorLocation = gl.getUniformLocation(shaderProgram, 'u_color');
    matrixLocation = gl.getUniformLocation(shaderProgram, 'u_matrix');


}

function drawScene() {
    helper.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas.
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(shaderProgram);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3;          // 3 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionLocation, size, type, normalize, stride, offset);

    // set the color
    gl.uniform4fv(colorLocation, globalColor);

    // Compute the matrices
    var matrix = helper.m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
    matrix = helper.m4.translate(matrix, globalTranslation[0], globalTranslation[1], globalTranslation[2]);
    matrix = helper.m4.xRotate(matrix, globalRotation[0]);
    matrix = helper.m4.yRotate(matrix, globalRotation[1]);
    matrix = helper.m4.zRotate(matrix, globalRotation[2]);
    matrix = helper.m4.scale(matrix, globalScale[0], globalScale[1], globalScale[2]);

    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    // Draw the geometry.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    // 18 6 triangles in the 'F', 3 points per triangle
    gl.drawArrays(primitiveType, offset, globalCount);
}

export { defineWebGL, renderObject, drawScene};