// RotatingTriangle.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' +
  '  gl_PointSize = 10.0;\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

// constants
var FLOATS_PER_VERTEX = 7;
var FSIZE = Float32Array.BYTES_PER_ELEMENT;

var OVERALL_ANGLE_STEP = 45.0,
    OVERALL_TRANSLATE_STEP = 0.5,
    EAGLE_WING_ANGLE_STEP = 100.0,
    FOX_LEG_ANGLE_STEP = 150.0;

var globals = {};

function initGlobals() {
  // animation rates
  globals.rates = {
    overallHorizontalStep: 0,
    overallVerticalStep: 0,
    eagleWingAngleStep: EAGLE_WING_ANGLE_STEP,
    foxUpperLegAngleStep: FOX_LEG_ANGLE_STEP,
    foxLowerLegAngleStep: FOX_LEG_ANGLE_STEP,
  };

  // animation states
  globals.state = {
    isPaused: false,
    showEagle: true,
    showFox: true,
    overallHorizontalOffset: 0.0,
    overallVerticalOffset: 0.0,
    orientation: {
      quat: new Quaternion(0, 0, 0, 1),
      mat: new Matrix4(),
    },
    eagle: {
      tailAngle: -10.0,
      wingAngle: 5.0,
    },
    fox: {
      upperLegAngle: 0.0,
      lowerLegAngle: 30.0,
      pawAngle: 0.0,
    },
  };

  // mouse data
  globals.mouse = {
    isDragging: false,
    click: {
      x: 0,
      y: 0,
    },
    pos: {
      x: 0,
      y: 0,
    },
    drag: {
      x: 0,
      y: 0,
    },
  };
}

function main() {
  initGlobals();

  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders.');
    return;
  }

  // Create data and write the positions of vertices to a vertex shader
  globals.data = new VerticesData();
  console.log(globals);

  var buffer = initVertexBuffers(gl);
  
  if (globals.data.numElements < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  registerMouseEvents(canvas, gl);

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  gl.enable(gl.DEPTH_TEST);

  // Get storage location of u_ModelMatrix
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) { 
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) { 
    console.log('Failed to get u_ViewMatrix');
    return;
  }

  var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  if (!u_ProjMatrix) { 
    console.log('Failed to get u_ProjMatrix');
    return;
  }

  var matrices = {
    u_ModelMatrix: u_ModelMatrix,
    modelMatrix: new Matrix4(),

    u_ViewMatrix: u_ViewMatrix,
    viewMatrix: new Matrix4(),

    u_ProjMatrix: u_ProjMatrix,
    projMatrix: new Matrix4(),
  };

  // Start drawing
  var tick = function() {
    animate(gl, buffer);
    
    // Clear <canvas>  colors AND the depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    

    // Lower left viewport
    // ----------------------------------------------------------------------
    gl.viewport(0,                              // Viewport lower-left corner
                0,                              // (x,y) location(in pixels)
                gl.drawingBufferWidth/2,        // viewport width, height.
                gl.drawingBufferHeight/2);

    matrices.viewMatrix.setLookAt(0, 0, 3, 0, 0, 0, 0, 1, 0);
    matrices.projMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);

    draw(gl, canvas, matrices);


    // Lower right viewport
    // ----------------------------------------------------------------------
    gl.viewport(gl.drawingBufferWidth/2,        // Viewport lower-right corner
                0,                              // (x,y) location(in pixels)
                gl.drawingBufferWidth/2,        // viewport width, height.
                gl.drawingBufferHeight/2);

    matrices.viewMatrix.setLookAt(0, 0, 3, 0, 0, 0, 0, 1, 0);
    //matrices.projMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
    matrices.projMatrix.setOrtho(-1.0, 1.0, -1.0, 1.0, 0.0, 5.0);
    
    draw(gl, canvas, matrices);
    
    // request that the browser calls tick
    requestId = requestAnimationFrame(tick, canvas);
  };
  tick();
}

function initVertexBuffers(gl) {

  var data = globals.data;

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write data into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, data.vertices, gl.STATIC_DRAW);

  // Assign the buffer object to a_Position variable
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(
    a_Position, 
    4, 
    gl.FLOAT, 
    false, 
    FSIZE * FLOATS_PER_VERTEX,
    0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  // Get graphics system's handle for our Vertex Shader's color-input variable;
  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }
  // Use handle to specify how to retrieve **COLOR** data from our VBO:
  gl.vertexAttribPointer(
    a_Color,        // choose Vertex Shader attribute to fill with data
    3,              // how many values? 1,2,3 or 4. (we're using R,G,B)
    gl.FLOAT,       // data type for each value: usually gl.FLOAT
    false,          // did we supply fixed-point data AND it needs normalizing?
    FSIZE * FLOATS_PER_VERTEX,      // Stride -- how many bytes used to store each vertex?
    FSIZE * 4);     // Offset -- how many bytes from START of buffer to the
                    
  gl.enableVertexAttribArray(a_Color);  
                    // Enable assignment of vertex buffer object's position data

  return vertexBuffer;
}

function draw(gl, canvas, matrices) {
  
  var data = globals.data;
  var state = globals.state;

  var u_ViewMatrix = matrices.u_ViewMatrix;
  var viewMatrix = matrices.viewMatrix;
  var u_ProjMatrix = matrices.u_ProjMatrix;
  var projMatrix = matrices.projMatrix;

  // Pass in the projection matrix
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

  // Pass in the unaltered view matrix (+y is up)
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  // Draw the models
  drawModels(gl, matrices);

  // Draw the environment
  drawEnvironment(gl, matrices);
}

function drawEnvironment(gl, matrices) {
  var data = globals.data;
  var state = globals.state;

  var u_ModelMatrix = matrices.u_ModelMatrix;
  var modelMatrix = matrices.modelMatrix;
  var u_ViewMatrix = matrices.u_ViewMatrix;
  var viewMatrix = matrices.viewMatrix;

  // Reset the model matrix and set up the view matrix for the environment
  modelMatrix.setTranslate(0.0, 0.0, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  
  // modify view matrix with mouse drag quaternion-based rotation
  viewMatrix.concat(state.orientation.mat);

  // rotate view matrix (+z is up)
  viewMatrix.rotate(-90.0, 1, 0, 0);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  // draw the ground
  var environment = data.environment;
  gl.drawArrays(gl.LINES,
      environment.startVertexOffset + environment.ground.startVertexOffset,
      environment.ground.numVertices);
}

function drawModels(gl, matrices) {
  var data = globals.data;
  var state = globals.state;
  var mouse = globals.mouse;

  var u_ModelMatrix = matrices.u_ModelMatrix;
  var modelMatrix = matrices.modelMatrix;

  // init the model matrix
  modelMatrix.setTranslate(0.0, 0.0, 0.0);

  // convert to left-handed to match WebGL display canvas
  //modelMatrix.scale(1, 1, -1);

  // translate based on user input
  modelMatrix.translate(
    state.overallHorizontalOffset, 
    state.overallVerticalOffset,
    0.0);

  // mouse drag quaternion-based rotation
  modelMatrix.concat(state.orientation.mat);

  pushMatrix(modelMatrix);

  // draw eagle if not hidden by user
  if (state.showEagle) {
    modelMatrix.translate(0.0, 0.5, 0.0);
    drawEagle(gl, data.eagle, state.eagle, modelMatrix, u_ModelMatrix);
  }

  modelMatrix = popMatrix();

/*
  // draw fox if not hidden by user
  if (state.showFox) {
    drawFox(gl, data.fox, state.fox, modelMatrix, u_ModelMatrix);
  }
*/

}

function drawEagle(gl, eagle, state, modelMatrix, u_ModelMatrix) {

  //modelMatrix.scale(0.6, 0.6, 0.6);
  
  // BODY
  //=========================================================================//
  modelMatrix.scale(0.25, 0.25, 0.25);
  modelMatrix.translate(0.0, -state.wingAngle / 360, 0.0);

  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  // save for later use
  pushMatrix(modelMatrix);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    eagle.startVertexOffset + eagle.body.startVertexOffset,
    eagle.body.numVertices);

  // tail
  modelMatrix.translate(0.0, 0.0, -0.48);
  modelMatrix.rotate(state.tailAngle, 1, 0, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    eagle.startVertexOffset + eagle.tail.startVertexOffset,
    eagle.tail.numVertices);

  // WINGS
  //=========================================================================//
  modelMatrix = popMatrix();
  modelMatrix.scale(3.5, 3.0, 2.5);
  pushMatrix(modelMatrix);

  // right wing
  drawEagleWing(gl, eagle, state, modelMatrix, u_ModelMatrix);

  // left wing
  modelMatrix = popMatrix();
  modelMatrix.scale(-1.0, 1.0, 1.0);
  drawEagleWing(gl, eagle, state, modelMatrix, u_ModelMatrix);
}

function drawEagleWing(gl, eagle, state, modelMatrix, u_ModelMatrix) {
  // upper wing
  modelMatrix.translate(0.02, 0.0, 0.0);
  modelMatrix.rotate(state.wingAngle, 0, 0, 1);

  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    eagle.startVertexOffset + eagle.upperWing.startVertexOffset,
    eagle.upperWing.numVertices);

  // middle wing
  modelMatrix.translate(0.24, 0.0, 0.0);
  modelMatrix.rotate(state.wingAngle*0.8, 0, 0, 1);

  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    eagle.startVertexOffset + eagle.middleWing.startVertexOffset,
    eagle.middleWing.numVertices);
  
  // lower wing
  modelMatrix.translate(0.29, 0.0, 0.0);
  modelMatrix.rotate(state.wingAngle/1.5, 0, 0, 1);

  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    eagle.startVertexOffset + eagle.lowerWing.startVertexOffset,
    eagle.lowerWing.numVertices);
}

function drawFox(gl, fox, state, modelMatrix, u_ModelMatrix) {
  modelMatrix.scale(0.5, 0.5, 0.5);
  modelMatrix.rotate(5.0, 1, 0, 0);
  
  // UPPER HALF
  //=========================================================================//
  // upper body
  modelMatrix.rotate(state.upperLegAngle/6, 1, 0, 0);
  modelMatrix.translate(0.0, state.upperLegAngle/480, 0.0);
  pushMatrix(modelMatrix);

  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    fox.startVertexOffset + fox.upperBody.startVertexOffset,
    fox.upperBody.numVertices);

  // draw the ears
  pushMatrix(modelMatrix);
  drawFoxEar(gl, fox, state, modelMatrix, u_ModelMatrix);

  modelMatrix = popMatrix();
  pushMatrix(modelMatrix);
  modelMatrix.scale(-1.0, 1.0, 1.0);
  drawFoxEar(gl, fox, state, modelMatrix, u_ModelMatrix);  

  modelMatrix = popMatrix();
  modelMatrix.scale(0.7, 0.7, 0.7);
  pushMatrix(modelMatrix);

  // front right leg
  drawFoxFrontLeg(gl, fox, state, modelMatrix, u_ModelMatrix);

  // front left leg
  modelMatrix = popMatrix();
  modelMatrix.scale(-1.0, 1.0, 1.0);
  drawFoxFrontLeg(gl, fox, state, modelMatrix, u_ModelMatrix);

  // LOWER HALF
  //=========================================================================//
  // lower body
  modelMatrix = popMatrix();
  modelMatrix.translate(0.0, 0.0, 0.03);
  modelMatrix.rotate(-state.upperLegAngle*2/6, 1, 0, 0);
  pushMatrix(modelMatrix);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    fox.startVertexOffset + fox.lowerBody.startVertexOffset,
    fox.lowerBody.numVertices);

  // legs
  modelMatrix.scale(0.7, 0.7, 0.7);
  modelMatrix.translate(0.0, -0.03, -0.03);
  pushMatrix(modelMatrix);

  // hind right leg
  modelMatrix = popMatrix();
  pushMatrix(modelMatrix);
  drawFoxHindLeg(gl, fox, state, modelMatrix, u_ModelMatrix);

  // hind left leg
  modelMatrix = popMatrix();
  modelMatrix.scale(-1.0, 1.0, 1.0);
  drawFoxHindLeg(gl, fox, state, modelMatrix, u_ModelMatrix);

  // TAIL
  //=========================================================================//
  modelMatrix = popMatrix();

  modelMatrix.translate(0.0, 0.05, -0.5);
  
  // upper
  modelMatrix.rotate(state.lowerLegAngle/3, 1, 0, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    fox.startVertexOffset + fox.upperTail.startVertexOffset,
    fox.upperTail.numVertices);

  // middle
  modelMatrix.translate(0.0, 0.0, -0.50);
  modelMatrix.rotate(-state.lowerLegAngle*2/6, 1, 0, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    fox.startVertexOffset + fox.middleTail.startVertexOffset,
    fox.middleTail.numVertices);

  // lower
  modelMatrix.translate(0.0, 0.0, -0.3);
  modelMatrix.rotate(-state.lowerLegAngle*2/6, 1, 0, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    fox.startVertexOffset + fox.lowerTail.startVertexOffset,
    fox.lowerTail.numVertices);
}

function drawFoxEar(gl, fox, state, modelMatrix, u_ModelMatrix) {
  modelMatrix.translate(0.08, 0.25, 0.7);
  modelMatrix.rotate(-40.0, 0, 0, 1);
  modelMatrix.rotate(20.0, 1, 0, 0);
  modelMatrix.rotate(-state.upperLegAngle/2, 1, 0, 0);
  modelMatrix.scale(0.15, 0.3, 0.3);

  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    fox.startVertexOffset + fox.ear.startVertexOffset,
    fox.ear.numVertices);
}

function drawFoxFrontLeg(gl, fox, state, modelMatrix, u_ModelMatrix) {
  modelMatrix.translate(0.18, 0.05, 0.35);
  modelMatrix.rotate(90.0, 1, 0, 0);
  modelMatrix.rotate(-90.0, 0, 0, 1);
  modelMatrix.rotate(15.0, 0, 1, 0);
  modelMatrix.rotate(state.upperLegAngle, 0, 1, 0);
  
  // upper
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    fox.startVertexOffset + fox.upperLeg.startVertexOffset,
    fox.upperLeg.numVertices);

  // lower
  modelMatrix.translate(0.0, 0.0, 0.5);
  modelMatrix.rotate(-60.0, 0, 1, 0);
  modelMatrix.rotate(state.lowerLegAngle/1.5, 0, 1, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    fox.startVertexOffset + fox.lowerLeg.startVertexOffset,
    fox.lowerLeg.numVertices);

  // paw
  modelMatrix.translate(0.0, 0.0, 0.4);
  modelMatrix.rotate(20.0, 0, 1, 0);
  modelMatrix.rotate(state.pawAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    fox.startVertexOffset + fox.paw.startVertexOffset,
    fox.paw.numVertices);
}

function drawFoxHindLeg(gl, fox, state, modelMatrix, u_ModelMatrix) {
  modelMatrix.translate(0.13, 0.03, -0.45);
  modelMatrix.rotate(90.0, 1, 0, 0);
  modelMatrix.rotate(-90.0, 0, 0, 1);
  modelMatrix.rotate(20.0, 0, 1, 0);
  modelMatrix.rotate(-state.upperLegAngle, 0, 1, 0);
  
  // upper
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    fox.startVertexOffset + fox.upperLeg.startVertexOffset,
    fox.upperLeg.numVertices);

  // lower
  modelMatrix.translate(0.0, 0.0, 0.5);
  modelMatrix.rotate(-30.0, 0, 1, 0);
  modelMatrix.rotate(-state.lowerLegAngle/1.2, 0, 1, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    fox.startVertexOffset + fox.lowerLeg.startVertexOffset,
    fox.lowerLeg.numVertices);

  // paw
  modelMatrix.translate(0.0, 0.0, 0.4);
  modelMatrix.rotate(20.0, 0, 1, 0);
  modelMatrix.rotate(state.pawAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    fox.startVertexOffset + fox.paw.startVertexOffset,
    fox.paw.numVertices);
}

// Last time that this function was called
var g_last = Date.now();

function animate(gl, buffer) {
  var state = globals.state;
  var rates = globals.rates;

  // Calculate the elapsed time
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;

  // don't change any animation parameter if paused
  if (state.isPaused)
    elapsed = 0;

  // overall translation
  state.overallHorizontalOffset += (rates.overallHorizontalStep * elapsed) / 1000.0;
  state.overallVerticalOffset += (rates.overallVerticalStep * elapsed) / 1000.0;

  // eagle wing angle
  var wingAngle = state.eagle.wingAngle;
  if (wingAngle >   30.0 && rates.eagleWingAngleStep > 0) 
    rates.eagleWingAngleStep = -rates.eagleWingAngleStep*2;

  if (wingAngle <  -40.0 && rates.eagleWingAngleStep < 0) 
    rates.eagleWingAngleStep = -rates.eagleWingAngleStep/2;
  
  var newWingAngle = wingAngle + (rates.eagleWingAngleStep * elapsed) / 1000.0;
  state.eagle.wingAngle = newWingAngle % 360;

  state.eagle.tailAngle = (newWingAngle % 360) / 3.0;


  // fox leg angle
  var upperLegAngle = state.fox.upperLegAngle;
  if (upperLegAngle >   40.0 && rates.foxUpperLegAngleStep > 0) 
    rates.foxUpperLegAngleStep = -rates.foxUpperLegAngleStep;
  if (upperLegAngle <  -40.0 && rates.foxUpperLegAngleStep < 0) 
    rates.foxUpperLegAngleStep = -rates.foxUpperLegAngleStep;

  var newAngle = upperLegAngle + (rates.foxUpperLegAngleStep * elapsed) / 1000.0;
  newAngle %= 360;
  state.fox.upperLegAngle = newAngle;
  state.fox.pawAngle = newAngle / 2 + 30.0;

  var lowerLegAngle = state.fox.lowerLegAngle;
  if (lowerLegAngle >   40.0 && rates.foxLowerLegAngleStep > 0) 
    rates.foxLowerLegAngleStep = -rates.foxLowerLegAngleStep;
  if (lowerLegAngle <  -40.0 && rates.foxLowerLegAngleStep < 0) 
    rates.foxLowerLegAngleStep = -rates.foxLowerLegAngleStep;

  newAngle = lowerLegAngle + (rates.foxLowerLegAngleStep * elapsed) / 1000.0;
  newAngle %= 360;
  state.fox.lowerLegAngle = newAngle; 
}

// HTML elements functions
function play() { globals.state.isPaused = false; }
function pause() { globals.state.isPaused = true; }
function reset() {
  initGlobals();

  // reset HTML elements
  document.getElementById('toggle-eagle').checked = true;
  document.getElementById('toggle-fox').checked = true;
}

function toggleEagle(cb) {
  var state = globals.state;

  if (cb.checked) 
    state.showEagle = true;
  else
    state.showEagle = false;
}

function toggleFox(cb) {
  var state = globals.state;

  if (cb.checked) 
    state.showFox = true;
  else
    state.showFox = false;
}

// mouse functions
function registerMouseEvents(canvas, gl) {
  canvas.onmousedown = function(e) { myMouseDown(e, gl, canvas); };
  canvas.onmousemove = function(e) { myMouseMove(e, gl, canvas); };
  canvas.onmouseup = function(e) { myMouseUp(e, gl, canvas); };
}

function unregisterMouseEvents(canvas, gl) {
  canvas.onmousedown = null;
  canvas.onmousemove = null;
  canvas.onmouseup = null;
}

function myMouseDown(e, gl, canvas) {
  var mouse = globals.mouse;

  // get canvas corners in pixels
  var rect = e.target.getBoundingClientRect();
  // x==0 at canvas left edge, y==0 at canvas bottom edge
  var xp = e.clientX - rect.left;
  var yp = canvas.height - (e.clientY - rect.top);

  // convert to Canonical View Volume (CVV) coordinates:
  var x = (xp - canvas.width/2) / (canvas.width/2);
  var y = (yp - canvas.height/2) / (canvas.height/2);

  mouse.isDragging = true;
  mouse.click.x = x;
  mouse.click.y = y;

  mouse.pos.x = x;
  mouse.pos.y = y;
}

function myMouseMove(e, gl, canvas) {
  var mouse = globals.mouse;
  var state = globals.state;

  if (!mouse.isDragging) return;

  // get canvas corners in pixels
  var rect = e.target.getBoundingClientRect();
  // x==0 at canvas left edge, y==0 at canvas bottom edge
  var xp = e.clientX - rect.left;
  var yp = canvas.height - (e.clientY - rect.top);

  // convert to Canonical View Volume (CVV) coordinates:
  var x = (xp - canvas.width/2) / (canvas.width/2);
  var y = (yp - canvas.height/2) / (canvas.height/2);

  // find how far we dragged the mouse
  mouse.drag.x += (x - mouse.pos.x);
  mouse.drag.y += (y - mouse.pos.y);

  // then update orientation quaternion
  updateOrientation(state.orientation, x - mouse.pos.x, y - mouse.pos.y);
  
  mouse.pos.x = x;
  mouse.pos.y = y;
}

function myMouseUp(e, gl, canvas) {
  var mouse = globals.mouse;
  var state = globals.state;
  var data = globals.data;

  // get canvas corners in pixels
  var rect = e.target.getBoundingClientRect();
  // x==0 at canvas left edge, y==0 at canvas bottom edge
  var xp = e.clientX - rect.left;
  var yp = canvas.height - (e.clientY - rect.top);

  // convert to Canonical View Volume (CVV) coordinates:
  var x = (xp - canvas.width/2) / (canvas.width/2);
  var y = (yp - canvas.height/2) / (canvas.height/2);

  // find how far we dragged the mouse
  mouse.drag.x += (x - mouse.pos.x);
  mouse.drag.y += (y - mouse.pos.y);

  // then update orientation quaternion
  updateOrientation(state.orientation, x - mouse.pos.x, y - mouse.pos.y);

  mouse.isDragging = false;

  // check for click
  if (Math.abs(x - mouse.click.x) < 0.001 
      && Math.abs(y - mouse.click.y) < 0.001) {
    
    // do something for click
  }
}

function updateOrientation(orientation, xdrag, ydrag) {
  var newQuat = new Quaternion(0, 0, 0, 1);
  var tmpQuat = new Quaternion(0, 0, 0, 1);

  var dist = Math.sqrt(xdrag*xdrag + ydrag*ydrag);

  newQuat.setFromAxisAngle(-ydrag + 0.0001, xdrag + 0.0001, 0.0, dist*150.0);

  // apply new rotation
  tmpQuat.multiply(newQuat, orientation.quat);
  tmpQuat.normalize();

  // then set orientation to result
  orientation.quat.copy(tmpQuat);

  // convert quaternion to matrix
  orientation.mat.setFromQuat(tmpQuat.x, tmpQuat.y, tmpQuat.z, tmpQuat.w);
}

// keyboard listeners
window.onkeydown = function(e) {
  var rates = globals.rates;

  if (e.keyCode == 37) // left arrow
    rates.overallHorizontalStep = OVERALL_TRANSLATE_STEP;
  else if (e.keyCode == 39) // right arrow
    rates.overallHorizontalStep = -OVERALL_TRANSLATE_STEP;
  else if (e.keyCode == 38) // up arrow
    rates.overallVerticalStep = OVERALL_TRANSLATE_STEP;
  else if (e.keyCode == 40) // down arrow
    rates.overallVerticalStep = -OVERALL_TRANSLATE_STEP;
};

window.onkeyup = function(e) {
  var rates = globals.rates;
  var state = globals.state;

  if ((e.keyCode == 37) || (e.keyCode == 39)) 
    rates.overallHorizontalStep = 0;
  else if ((e.keyCode == 38) || (e.keyCode == 40)) 
    rates.overallVerticalStep = 0;
  else if (e.keyCode == 32) // spacebar
    state.isPaused = !state.isPaused;
};
