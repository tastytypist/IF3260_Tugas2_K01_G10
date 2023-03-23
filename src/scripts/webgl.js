import * as helper from "./helper.js"

var gl;

// data
var global_vertices = [];
var global_indices = [];
var global_colors = [];
var global_translation = [];

// buffer
var vertex_buffer;
var index_buffer;
var color_buffer;

// Matrix
var Pmatrix;
var Vmatrix;
var Mmatrix;

// 
var drawnObjects = [];

function setOffset() {
    let offset = 0;
    console.log("Calculating offset of " + drawnObjects.length + " objects.");
    drawnObjects.forEach((object) => {
        offset += object.vertices.length;
    })
    console.log("Calculated offset", offset);
    return offset;
}

function defineWebGL(canvas) {
    gl = canvas.getContext('webgl');
    return gl;
}

function renderObjects(listOfObjects) {
    listOfObjects.forEach((object) => {
        createBuffer(object.vertices, object.indices, object.colors, object.translation);
        createShader();
        render(object.indices);
        drawnObjects.push(object);
    })
}

function createBuffer(vertices, indices, colors, translation) {
    /* Step2: Define the geometry and store it in buffer objects */

    // Create vertex buffer
    if (!vertex_buffer) {
        vertex_buffer = gl.createBuffer();
    }
    global_vertices = [...global_vertices, ...vertices];
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(global_vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    // Create index buffer
    if (!index_buffer) {
        index_buffer = gl.createBuffer();
    }

    let offset = setOffset() / 3;
    indices.forEach((i) => {
        global_indices.push(i+offset)
    });
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(global_indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    // Create an empty buffer object and store color data
    if (!color_buffer) {
        color_buffer = gl.createBuffer();
    }
    global_colors = [...global_colors, ...colors];
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(global_colors), gl.STATIC_DRAW);

    global_translation = translation;

    console.log(global_vertices);
    console.log(global_indices);
    console.log(global_colors);
}

function createShader() {
    /* Step3: Create and compile Shader programs */
    // Vertex shader source code
    var vertCode =
    `attribute vec3 position;
    uniform vec4 translation;

    uniform mat4 Pmatrix;
    uniform mat4 Vmatrix;
    uniform mat4 Mmatrix;

    attribute vec3 color;
    varying vec3 vColor;
    void main(void) {
        gl_Position = Pmatrix * Vmatrix * Mmatrix * vec4(position, 1.0) + translation;
        vColor = color;
    }`;

    //Create, attach, compile a vertex shader object
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);

    //Fragment shader source code
    var fragCode = 
    `precision mediump float;
    varying vec3 vColor;
    void main(void) { 
        gl_FragColor = vec4(vColor, 1.);
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

    // Link both programs
    gl.linkProgram(shaderProgram);
    
    /* Step 4: Associate the shader programs to buffer objects */
    
    Pmatrix = gl.getUniformLocation(shaderProgram, "Pmatrix");
    Vmatrix = gl.getUniformLocation(shaderProgram, "Vmatrix");
    Mmatrix = gl.getUniformLocation(shaderProgram, "Mmatrix");
    
    // Position
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    var position = gl.getAttribLocation(shaderProgram, "position");
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(position);
    
    // Color
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    var color = gl.getAttribLocation(shaderProgram, "color");
    gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0) ;
    gl.enableVertexAttribArray(color);
    
    // Use Program
    gl.useProgram(shaderProgram);

    /** Translation */
    let [Tx, Ty, Tz] = global_translation
    var translation = gl.getUniformLocation(shaderProgram, "translation")
    gl.uniform4f(translation, Tx, Ty, Tz, 1.0);
}

function render(indices) {
    var offset = setOffset();

    /** Matrix */
    var proj_matrix = helper.getProjection(40, canvas.width/canvas.height, 1, 100);

    var mov_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
    var view_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
    
    view_matrix[14] = view_matrix[14]-6;

    /** Drawing */
    helper.rotateX(mov_matrix, 0.5);
    helper.rotateY(mov_matrix, 0.5);
    helper.rotateZ(mov_matrix, 0.5);

    helper.resizeCanvasToDisplaySize(gl.canvas);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearColor(0.5, 0.5, 0.5, 0.9);
    gl.clearDepth(1.0);

    gl.viewport(0.0, 0.0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
    gl.uniformMatrix4fv(Vmatrix, false, view_matrix);
    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, offset);

    /** Animation */
    // var time_old = 0;
    // helper.resizeCanvasToDisplaySize(gl.canvas);
    // var animate = function(time) {
    //     var dt = time-time_old;
    //     helper.rotateZ(mov_matrix, dt*0.00005);
    //     helper.rotateY(mov_matrix, dt*0.00002);
    //     helper.rotateX(mov_matrix, dt*0.00003);
    //     time_old = time;

    //     gl.enable(gl.DEPTH_TEST);
    //     gl.depthFunc(gl.LEQUAL);
    //     gl.clearColor(0.5, 0.5, 0.5, 0.9);
    //     gl.clearDepth(1.0);

    //     gl.viewport(0.0, 0.0, canvas.width, canvas.height);
    //     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //     gl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
    //     gl.uniformMatrix4fv(Vmatrix, false, view_matrix);
    //     gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
    //     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
    //     gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    //     window.requestAnimationFrame(animate);
    // }
    // animate(0);
}

export { defineWebGL, renderObjects };