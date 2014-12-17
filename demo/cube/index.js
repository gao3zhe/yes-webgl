var canvas = document.getElementById('webgl');

var gl = getWebGLContext(canvas);

var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_Position = u_MvpMatrix * a_Position;\n' +
    '  v_Color = a_Color;\n' +
    '}\n';

var FSHADER_SOURCE =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';


initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.DEPTH_TEST);

//----------

var verticesColors = new Float32Array([
    // Vertex coordinates and color
    1.0, 1.0, 1.0, 1.0, 1.0, 1.0, // v0 White
    -1.0, 1.0, 1.0, 1.0, 0.0, 1.0, // v1 Magenta
    -1.0, -1.0, 1.0, 1.0, 0.0, 0.0, // v2 Red
    1.0, -1.0, 1.0, 1.0, 1.0, 0.0, // v3 Yellow
    1.0, -1.0, -1.0, 0.0, 1.0, 0.0, // v4 Green
    1.0, 1.0, -1.0, 0.0, 1.0, 1.0, // v5 Cyan
    -1.0, 1.0, -1.0, 0.0, 0.0, 1.0, // v6 Blue
    -1.0, -1.0, -1.0, 0.0, 0.0, 0.0 // v7 Black
]);

// Indices of the vertices
var indices = new Uint8Array([
    0, 1, 2, 0, 2, 3, // front
    0, 3, 4, 0, 4, 5, // right
    0, 5, 6, 0, 6, 1, // up
    1, 6, 7, 1, 7, 2, // left
    7, 4, 3, 7, 3, 2, // down
    4, 7, 6, 4, 6, 5 // back
]);

var vertexColorBuffer = gl.createBuffer();
var indexBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

var FSIZE = verticesColors.BYTES_PER_ELEMENT;
var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
gl.enableVertexAttribArray(a_Position);

var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
gl.enableVertexAttribArray(a_Color);


// Write the indices to the buffer object
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');

// Set the eye point and the viewing volume
var mvpMatrix = new Matrix4();
mvpMatrix.setPerspective(30, 1, 1, 100);
mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);

// Pass the model view projection matrix to u_MvpMatrix
gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);


//---------

gl.clear(gl.COLOR_BUFFER_BIT);

//gl.drawArrays(gl.POINTS, 0,4);
gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0);


//get the context
function getWebGLContext(canvas, err) {
    // bind err 
    if (canvas.addEventListener) {
        canvas.addEventListener("webglcontextcreationerror", function(event) {
            err(event.statusMessage);
        }, false);
    }
    //create context
    var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    var context = null;
    for (var ii = 0; ii < names.length; ++ii) {
        try {
            context = canvas.getContext(names[ii], err);
        } catch (e) {}
        if (context) {
            break;
        }
    }
    return context;
};

//init shader
function initShaders(gl, vshader, fshader) {
    var program = createProgram(gl, vshader, fshader);
    if (!program) {
        console.log('Failed to create program');
        return false;
    }

    gl.useProgram(program);
    gl.program = program;

    return true;
}


//create program
function createProgram(gl, vshader, fshader) {
    // Create shader object
    var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
    var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
    if (!vertexShader || !fragmentShader) {
        return null;
    }

    // Create a program object
    var program = gl.createProgram();
    if (!program) {
        return null;
    }

    // Attach the shader objects
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // Link the program object
    gl.linkProgram(program);

    // Check the result of linking
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        var error = gl.getProgramInfoLog(program);
        console.log('Failed to link program: ' + error);
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        return null;
    }
    return program;
}

//loadShader
function loadShader(gl, type, source) {
    // Create shader object
    var shader = gl.createShader(type);
    if (shader == null) {
        console.log('unable to create shader');
        return null;
    }

    // Set the shader program
    gl.shaderSource(shader, source);

    // Compile the shader
    gl.compileShader(shader);

    // Check the result of compilation
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        var error = gl.getShaderInfoLog(shader);
        console.log('Failed to compile shader: ' + error);
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}
