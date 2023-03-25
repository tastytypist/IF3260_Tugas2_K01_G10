import * as helper from "./helper.js"

let gl;

// data
var globalPosition = [];
var globalColor = [];
var globalTranslation = [];
var globalRotation = [];
var globalScale = [];
var globalCount = 0;
var globalFudgeFactor = 0;
var globalFOVRadians = helper.degToRad(0);
var globalCameraAngleRadians = helper.degToRad(90);

// buffer
var positionBuffer;
var colorBuffer;

// location
var positionLocation;
var colorLocation;
var matrixLocation;
var fudgeLocation;

// program
 var shaderProgram;

function defineWebGL(canvas) {
    gl = canvas.getContext('webgl');
    return gl;
}

function renderObject(object) {
    createBuffer(object.position, object.count, object.color, object.translation, object.rotation, object.scale, object.fov, object.cameraAngle)
    createShader();
    drawScene()
}

function createBuffer(position, count, color, translation, rotation, scale, fieldOfView, cameraAngle) {
    /* Step2: Define the geometry and store it in buffer objects */

    // Create position buffer
    if (!positionBuffer) {
        positionBuffer = gl.createBuffer();
    }
    globalPosition = position;
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(globalPosition), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // Create color buffer
    if (!colorBuffer) {
        colorBuffer = gl.createBuffer();
    }
    globalColor = color;
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(globalColor), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    globalTranslation = translation;
    globalRotation = [];
    rotation.forEach((d) => {
        globalRotation.push(helper.degToRad(d));
    })
    globalScale = scale;
    globalCount = count;
    globalFOVRadians = helper.degToRad(fieldOfView);
    globalCameraAngleRadians = helper.degToRad(cameraAngle);
}

function createShader() {
    /* Step3: Create and compile Shader programs */
    // Vertex shader source code
    var vertCode =
    `attribute vec4 a_position;
    attribute vec4 a_color;

    uniform mat4 u_matrix;
    uniform float u_fudgeFactor;

    varying vec4 v_color;

    void main(void) {
        // Multiply the position by the matrix
        //vec4 position = u_matrix * a_position;
        gl_Position = u_matrix * a_position;

        // pass the color to the fragment shader.
        v_color = a_color;

        // Adjust the z to divide by
        // float zToDivideBy = 1.0 + position.z * u_fudgeFactor;

        // Divide x and y by z
        // gl_Position = vec4(position.xyz, zToDivideBy);
    }`;

    //Create, attach, compile a vertex shader object
    let vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);

    //Fragment shader source code
    let fragCode =
    `precision mediump float;

    // Passed in from the vertex shader.
    varying vec4 v_color;

    void main(void) { 
        gl_FragColor = v_color;
    }`;

    // Create, attach, compile fragment shader object
    let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
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
    colorLocation = gl.getAttribLocation(shaderProgram, "a_color");
    matrixLocation = gl.getUniformLocation(shaderProgram, "u_matrix");
    fudgeLocation = gl.getUniformLocation(shaderProgram, "u_fudgeFactor");

}

function drawScene() {
    helper.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Turn on culling. By default backfacing triangles
    // will be culled.
    gl.enable(gl.CULL_FACE);

    // Enable the depth buffer
    gl.enable(gl.DEPTH_TEST);

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

    // Turn on the attribute
    gl.enableVertexAttribArray(colorLocation);

    // Bind the color buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

     // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
     var size = 3;                 // 3 components per iteration
     var type = gl.UNSIGNED_BYTE;  // the data is 8bit unsigned values
     var normalize = true;         // normalize the data (convert from 0-255 to 0-1)
     var stride = 0;               // 0 = move forward size * sizeof(type) each iteration to get the next position
     var offset = 0;               // start at the beginning of the buffer
     gl.vertexAttribPointer(
         colorLocation, size, type, normalize, stride, offset);

    // Compute the matrices
    
    // var matrix = helper.m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);

    // var left = 0;
    // var right = gl.canvas.clientWidth;
    // var bottom = gl.canvas.clientHeight;
    // var top = 0;
    // var near = 400;
    // var far = -400;
    // var matrix = helper.m4.orthographic(left, right, bottom, top, near, far);

    // var matrix = helper.makeZToWMatrix(globalFudgeFactor);
    // matrix = helper.m4.multiply(matrix, helper.m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400));

    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var zNear = 1;
    var zFar = 2000;
    var projectionMatrix = helper.m4.perspective(globalFOVRadians, aspect, zNear, zFar);

    var radius = 100;
    
    // Compute a matrix for the camera
    var cameraMatrix = helper.m4.yRotation(globalCameraAngleRadians);
    cameraMatrix = helper.m4.translate(cameraMatrix, 0, 0, radius * 1.5);

    // Make a view matrix from the camera matrix
    var viewMatrix = helper.m4.inverse(cameraMatrix);

    // Compute a view projection matrix
    var viewProjectionMatrix = helper.m4.multiply(projectionMatrix, viewMatrix)
    var matrix = helper.m4.translate(viewProjectionMatrix, globalTranslation[0], globalTranslation[1], globalTranslation[2]);
    matrix = helper.m4.xRotate(matrix, globalRotation[0]);
    matrix = helper.m4.yRotate(matrix, globalRotation[1]);
    matrix = helper.m4.zRotate(matrix, globalRotation[2]);
    matrix = helper.m4.scale(matrix, globalScale[0], globalScale[1], globalScale[2]);

    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    // Set the fudgeFactor
    gl.uniform1f(fudgeLocation, globalFudgeFactor);

    // Draw the geometry.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    // 18 6 triangles in the 'F', 3 points per triangle
    gl.drawArrays(primitiveType, offset, globalCount);
}

export { defineWebGL, renderObject, drawScene};
