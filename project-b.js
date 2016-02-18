// RotatingTriangle.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'attribute vec4 a_Normal;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'uniform int u_LightType;\n' +
  'uniform vec4 u_LightPos;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' +
  '  gl_PointSize = 10.0;\n' +
  
  '  float diff;\n' +
  '  if (u_LightType == 0) {\n' +
  '    diff = 1.0;\n' + 
  '  } else if (u_LightType == 1) {\n' +
  '    vec4 norm = u_NormalMatrix * a_Normal;\n' +
  '    diff = clamp(dot(normalize(norm), normalize(u_LightPos)), 0.0, 1.0);\n' +
  '  } else {\n' +
  '    vec4 norm = u_NormalMatrix * a_Normal;\n' +
  '    vec4 toLight = u_LightPos - u_ModelMatrix * a_Position;\n' +
  '    diff = clamp(dot(normalize(norm), normalize(toLight)), 0.0, 1.0);\n' +
  '  }\n' +

  '  v_Color = vec4(a_Color.xyz * (0.3 + 0.7*diff), 1.0);\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  //'#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  //'#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

// constants
var FLOATS_PER_VERTEX = 12;
var FSIZE = Float32Array.BYTES_PER_ELEMENT;

var EYE_STEP = 2.0,
    PAN_STEP = 2.0,
    EAGLE_STEP = 100.0,
    FOX_LEG_ANGLE_STEP = 150.0;

var globals = {};

function initGlobals() {
  // animation rates
  globals.rates = {
    view: {
      eyeStep: { right: 0, up: 0, forward: 0, },
      panStep: { horizontal: 0, vertical: 0, },
    },
    
    eagleStep: -EAGLE_STEP,
    foxUpperLegAngleStep: FOX_LEG_ANGLE_STEP,
    foxLowerLegAngleStep: FOX_LEG_ANGLE_STEP,
  };

  // animation states
  globals.state = {
    isPaused: false,
    isUIOpened: false,
    
    projection: {
      angle: 40,
      near: 1,
      far: 67,
    },

    view: {
      eye: { x: 0.0, y: -5.0, z: 0.0, },
      lookAt: { x: 0.0, y: 0.0, z: 0.0, },
      pan: { horizontal: 0.0, vertical: 0.0, },
      cylinderRadius: 5,
    },

    light: {
      type: 0,
      pos: { x: 0.0, y: -5.0, z: 5.0, },
    },

    orientation: {
      quat: new Quaternion(0, 0, 0, 1),
      mat: new Matrix4(),
    },

    eagle: {
      show: true,
      tailAngle: -10.0,
      wingAngle: 5.0,
    },

    fox: {
      show: true,
      upperLegAngle: 0.0,
      lowerLegAngle: 30.0,
      pawAngle: 0.0,
    },
  };

  // update the UI
  var lightTypes = document.getElementsByName('light-type');
  for (var i=0; i<lightTypes.length; i++) {
    lightTypes[i].checked = false;
  }
  lightTypes[globals.state.light.type].checked = true;
  
  document.getElementById('light-x').value = globals.state.light.pos.x;
  document.getElementById('light-y').value = globals.state.light.pos.y;
  document.getElementById('light-z').value = globals.state.light.pos.z;

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

  winResize();
}

function main() {
  initGlobals();

  // Retrieve <canvas> element
  var canvas = globals.canvas;

  // Get the rendering context for WebGL
  var gl = globals.gl;
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

  registerMouseEvents(gl);

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  gl.enable(gl.DEPTH_TEST);

  // Get storage location of uniform matrices
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

  var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if (!u_NormalMatrix) { 
    console.log('Failed to get u_NormalMatrix');
    return;
  }

  // Get the light type storage location
  var u_LightType = gl.getUniformLocation(gl.program, 'u_LightType');
  if (!u_LightType) { 
    console.log('Failed to get u_LightType');
    return;
  }

  // Get the light position storage location
  var u_LightPos = gl.getUniformLocation(gl.program, 'u_LightPos');
  if (!u_LightPos) { 
    console.log('Failed to get u_LightPos');
    return;
  }

  globals.uniforms = {
    u_ModelMatrix: u_ModelMatrix,
    modelMatrix: new Matrix4(),

    u_ViewMatrix: u_ViewMatrix,
    viewMatrix: new Matrix4(),

    u_ProjMatrix: u_ProjMatrix,
    projMatrix: new Matrix4(),

    u_NormalMatrix: u_NormalMatrix,
    normalMatrix: new Matrix4(),

    u_LightPos: u_LightPos,
  };

  // Start drawing
  var tick = function() {
    var gl = globals.gl;

    animate(gl, buffer);
    
    // Clear <canvas>  colors AND the depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Send in light type
    gl.uniform1i(u_LightType, globals.state.light.type);

    // Send in light position
    var lightPos = globals.state.light.pos;
    gl.uniform4f(u_LightPos, lightPos.x, lightPos.y, lightPos.z, 1);
    
    var eye = globals.state.view.eye,
        lookAt = globals.state.view.lookAt,
        pan = globals.state.view.pan;

    var proj = globals.state.projection;
    proj.aspectRatio = (globals.canvas.width/2) / globals.canvas.height;

    // Left viewport
    // ----------------------------------------------------------------------
    gl.viewport(0,
                0, 
                gl.drawingBufferWidth/2, 
                gl.drawingBufferHeight);

    globals.uniforms.viewMatrix.setLookAt(
      eye.x, eye.y, eye.z,
      lookAt.x, lookAt.y, lookAt.z,
      0, 0, 1);
    globals.uniforms.projMatrix.setPerspective(proj.angle, proj.aspectRatio, proj.near, proj.far);

    draw(gl);

    // Right viewport
    // ----------------------------------------------------------------------
    gl.viewport(gl.drawingBufferWidth/2,
                0,
                gl.drawingBufferWidth/2,
                gl.drawingBufferHeight);

    globals.uniforms.viewMatrix.setLookAt(
      eye.x, eye.y, eye.z,
      lookAt.x, lookAt.y, lookAt.z,
      0, 0, 1);
    
    var bounds = proj.near + ((proj.far - proj.near) / 3) * Math.tan(proj.angle/2 * Math.PI/180);
    globals.uniforms.projMatrix.setOrtho(-bounds*proj.aspectRatio, bounds*proj.aspectRatio, -bounds, bounds, proj.near, proj.far);
    draw(gl);
    
    // request that the browser calls tick
    requestId = requestAnimationFrame(tick, globals.canvas);
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
    4,              // how many values? 1,2,3 or 4. (we're using R,G,B,A)
    gl.FLOAT,       // data type for each value: usually gl.FLOAT
    false,          // did we supply fixed-point data AND it needs normalizing?
    FSIZE * FLOATS_PER_VERTEX,      // Stride -- how many bytes used to store each vertex?
    FSIZE * 4);     // Offset -- how many bytes from START of buffer to the
                    
  gl.enableVertexAttribArray(a_Color);  
                    // Enable assignment of vertex buffer object's position data

  // Assign the buffer object to a_Normal variable
  var a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if(a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return -1;
  }
  gl.vertexAttribPointer(
    a_Normal, 
    4, 
    gl.FLOAT, 
    false, 
    FSIZE * FLOATS_PER_VERTEX,
    FSIZE * 8);

  // Enable the assignment to a_Normal variable
  gl.enableVertexAttribArray(a_Normal);

  return vertexBuffer;
}

function draw(gl) {
  var canvas = globals.canvas;
  var uniforms = globals.uniforms;

  var data = globals.data;
  var state = globals.state;

  var u_ViewMatrix = uniforms.u_ViewMatrix;
  var viewMatrix = uniforms.viewMatrix;
  var u_ProjMatrix = uniforms.u_ProjMatrix;
  var projMatrix = uniforms.projMatrix;

  // Pass in the projection matrix
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

  // Pass in the view matrix (+z is up)
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  
  // Draw the environment
  drawEnvironment(gl, uniforms);

  // Draw the models
  drawAnimals(gl, uniforms); 
}

function drawEnvironment(gl, uniforms) {
  var environment = globals.data.environment;
  var state = globals.state;

  var u_ModelMatrix = uniforms.u_ModelMatrix;
  var modelMatrix = uniforms.modelMatrix;
  var u_NormalMatrix = uniforms.u_NormalMatrix;
  var normalMatrix = uniforms.normalMatrix;

  // Set modelMatrix and pass it into vertex shader
  modelMatrix.setTranslate(0.0, 0.0, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

  // draw the 3D axes
  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    environment.startVertexOffset + environment.axes.startVertexOffset,
    environment.axes.numVertices);

  // draw the ground
  gl.drawArrays(
    gl.LINES,
    environment.startVertexOffset + environment.ground.startVertexOffset,
    environment.ground.numVertices);

  // draw the forest
  modelMatrix.setTranslate(0.0, 6.0, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    environment.startVertexOffset + environment.forest.startVertexOffset,
    environment.forest.numVertices);

  // draw the rocks
  modelMatrix.setTranslate(0.0, 6.0, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    environment.startVertexOffset + environment.rock.startVertexOffset,
    environment.rock.numVertices);

  // draw some foxes
  modelMatrix.setTranslate(0.0, 6.0, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    environment.startVertexOffset + environment.fox.startVertexOffset,
    environment.fox.numVertices);

  // draw the mountain
  modelMatrix.setTranslate(-1.5, 16.0, 0.0);
  modelMatrix.scale(10.0, 10.0, 5.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    environment.startVertexOffset + environment.mountain.startVertexOffset,
    environment.mountain.numVertices);
}

function drawAnimals(gl, uniforms) {
  var data = globals.data;
  var state = globals.state;
  var mouse = globals.mouse;

  var u_ModelMatrix = uniforms.u_ModelMatrix;
  var modelMatrix = uniforms.modelMatrix;

  var u_NormalMatrix = uniforms.u_NormalMatrix;
  var normalMatrix = uniforms.normalMatrix;

  // init the model matrix
  modelMatrix.setTranslate(0.0, 0.0, 0.0);

  // convert to left-handed to match WebGL display canvas
  modelMatrix.scale(1, 1, -1);

  // rotate to get into "world" coordinates (+z is up)
  modelMatrix.rotate(-90.0, 1, 0, 0);

  modelMatrix.concat(state.orientation.mat);

  pushMatrix(modelMatrix);

  // draw eagle if not hidden by user
  if (state.eagle.show) {
    modelMatrix.translate(0.0, 0.5, 0.0);
    drawEagle(gl, data.eagle, state.eagle, modelMatrix, u_ModelMatrix, normalMatrix, u_NormalMatrix);
  }

  modelMatrix = popMatrix();

  // draw fox if not hidden by user
  if (state.fox.show) {
    drawFox(gl, data.fox, state.fox, modelMatrix, u_ModelMatrix, normalMatrix, u_NormalMatrix);
  }

}

function drawEagle(gl, eagle, state, modelMatrix, u_ModelMatrix, normalMatrix, u_NormalMatrix) {

  // BODY
  //=========================================================================//
  modelMatrix.scale(0.2, 0.2, 0.2);
  modelMatrix.translate(0.0, -state.wingAngle / 360, 0.0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

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

  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    eagle.startVertexOffset + eagle.tail.startVertexOffset,
    eagle.tail.numVertices);

  // WINGS
  //=========================================================================//
  modelMatrix = popMatrix();
  modelMatrix.scale(3.5, 3.0, 2.5);
  modelMatrix.rotate(90.0, 0, 1, 0);
  pushMatrix(modelMatrix);

  // right wing
  drawEagleWing(gl, eagle, state, modelMatrix, u_ModelMatrix, normalMatrix, u_NormalMatrix);

  // left wing
  modelMatrix = popMatrix();
  modelMatrix.scale(1.0, 1.0, -1.0);
  drawEagleWing(gl, eagle, state, modelMatrix, u_ModelMatrix, normalMatrix, u_NormalMatrix);
}

function drawEagleWing(gl, eagle, state, modelMatrix, u_ModelMatrix, normalMatrix, u_NormalMatrix) {
  // upper wing
  modelMatrix.translate(0.0, 0.0, 0.02);
  modelMatrix.rotate(state.wingAngle, 1, 0, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    eagle.startVertexOffset + eagle.upperWing.startVertexOffset,
    eagle.upperWing.numVertices);

  // middle wing
  modelMatrix.translate(0.0, 0.0, 0.24);
  modelMatrix.rotate(state.wingAngle*0.8, 1, 0, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    eagle.startVertexOffset + eagle.middleWing.startVertexOffset,
    eagle.middleWing.numVertices);
 
  // lower wing
  modelMatrix.translate(0.0, 0.0, 0.29);
  modelMatrix.rotate(state.wingAngle/1.5, 1, 0, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    eagle.startVertexOffset + eagle.lowerWing.startVertexOffset,
    eagle.lowerWing.numVertices);

  // draw 3D axes
  pushMatrix(modelMatrix);
  modelMatrix.scale(0.15, 0.15, 0.15);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  var environment = globals.data.environment;
  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    environment.startVertexOffset + environment.axes.startVertexOffset,
    environment.axes.numVertices);

  modelMatrix = popMatrix();
}

function drawFox(gl, fox, state, modelMatrix, u_ModelMatrix, normalMatrix, u_NormalMatrix) {

  modelMatrix.translate(0.0, 0.19, 0.0);
  modelMatrix.scale(0.3, 0.3, 0.3);
  modelMatrix.rotate(5.0, 1, 0, 0);
  
  // UPPER HALF
  //=========================================================================//
  // upper body
  modelMatrix.rotate(state.upperLegAngle/6, 1, 0, 0);
  modelMatrix.translate(0.0, state.upperLegAngle/480, 0.0);
  pushMatrix(modelMatrix);

  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    fox.startVertexOffset + fox.upperBody.startVertexOffset,
    fox.upperBody.numVertices);

  // draw the ears
  pushMatrix(modelMatrix);
  drawFoxEar(gl, fox, state, modelMatrix, u_ModelMatrix, normalMatrix, u_NormalMatrix);

  modelMatrix = popMatrix();
  pushMatrix(modelMatrix);
  modelMatrix.scale(-1.0, 1.0, 1.0);
  drawFoxEar(gl, fox, state, modelMatrix, u_ModelMatrix, normalMatrix, u_NormalMatrix);

  modelMatrix = popMatrix();
  modelMatrix.scale(0.7, 0.7, 0.7);
  pushMatrix(modelMatrix);

  // front right leg
  drawFoxFrontLeg(gl, fox, state, modelMatrix, u_ModelMatrix, normalMatrix, u_NormalMatrix);

  // front left leg
  modelMatrix = popMatrix();
  modelMatrix.scale(-1.0, 1.0, 1.0);
  drawFoxFrontLeg(gl, fox, state, modelMatrix, u_ModelMatrix, normalMatrix, u_NormalMatrix);

  // LOWER HALF
  //=========================================================================//
  // lower body
  modelMatrix = popMatrix();
  modelMatrix.translate(0.0, 0.0, 0.03);
  modelMatrix.rotate(-state.upperLegAngle/3, 1, 0, 0);
  pushMatrix(modelMatrix);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

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
  drawFoxHindLeg(gl, fox, state, modelMatrix, u_ModelMatrix, normalMatrix, u_NormalMatrix);

  // hind left leg
  modelMatrix = popMatrix();
  modelMatrix.scale(-1.0, 1.0, 1.0);
  drawFoxHindLeg(gl, fox, state, modelMatrix, u_ModelMatrix, normalMatrix, u_NormalMatrix);

  // TAIL
  //=========================================================================//
  modelMatrix = popMatrix();

  modelMatrix.translate(0.0, 0.05, -0.5);
  
  // upper
  modelMatrix.rotate(state.lowerLegAngle/3, 1, 0, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    fox.startVertexOffset + fox.upperTail.startVertexOffset,
    fox.upperTail.numVertices);

  // middle
  modelMatrix.translate(0.0, 0.0, -0.50);
  modelMatrix.rotate(-state.lowerLegAngle/3, 1, 0, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    fox.startVertexOffset + fox.middleTail.startVertexOffset,
    fox.middleTail.numVertices);

  // lower
  modelMatrix.translate(0.0, 0.0, -0.3);
  modelMatrix.rotate(-state.lowerLegAngle/3, 1, 0, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    fox.startVertexOffset + fox.lowerTail.startVertexOffset,
    fox.lowerTail.numVertices);

  // draw 3D axes
  pushMatrix(modelMatrix);
  modelMatrix.scale(0.2, 0.2, -0.2);  // flip to right-hand
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  var environment = globals.data.environment;
  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    environment.startVertexOffset + environment.axes.startVertexOffset,
    environment.axes.numVertices);

  modelMatrix = popMatrix();
}

function drawFoxEar(gl, fox, state, modelMatrix, u_ModelMatrix, normalMatrix, u_NormalMatrix) {
  modelMatrix.translate(0.08, 0.25, 0.7);
  modelMatrix.rotate(-40.0, 0, 0, 1);
  modelMatrix.rotate(20.0, 1, 0, 0);
  modelMatrix.rotate(-state.upperLegAngle/2, 1, 0, 0);
  modelMatrix.scale(0.15, 0.3, 0.3);

  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    fox.startVertexOffset + fox.ear.startVertexOffset,
    fox.ear.numVertices);
}

function drawFoxFrontLeg(gl, fox, state, modelMatrix, u_ModelMatrix, normalMatrix, u_NormalMatrix) {
  modelMatrix.translate(0.18, 0.05, 0.35);
  modelMatrix.rotate(90.0, 1, 0, 0);
  modelMatrix.rotate(-90.0, 0, 0, 1);
  modelMatrix.rotate(15.0, 0, 1, 0);
  modelMatrix.rotate(state.upperLegAngle, 0, 1, 0);
  
  // upper
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    fox.startVertexOffset + fox.upperLeg.startVertexOffset,
    fox.upperLeg.numVertices);

  // lower
  modelMatrix.translate(0.0, 0.0, 0.5);
  modelMatrix.rotate(-60.0, 0, 1, 0);
  modelMatrix.rotate(state.lowerLegAngle/1.5, 0, 1, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    fox.startVertexOffset + fox.lowerLeg.startVertexOffset,
    fox.lowerLeg.numVertices);

  // paw
  modelMatrix.translate(0.0, 0.0, 0.4);
  modelMatrix.rotate(20.0, 0, 1, 0);
  modelMatrix.rotate(state.pawAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    fox.startVertexOffset + fox.paw.startVertexOffset,
    fox.paw.numVertices);
}

function drawFoxHindLeg(gl, fox, state, modelMatrix, u_ModelMatrix, normalMatrix, u_NormalMatrix) {
  modelMatrix.translate(0.13, 0.03, -0.45);
  modelMatrix.rotate(90.0, 1, 0, 0);
  modelMatrix.rotate(-90.0, 0, 0, 1);
  modelMatrix.rotate(20.0, 0, 1, 0);
  modelMatrix.rotate(-state.upperLegAngle, 0, 1, 0);
  
  // upper
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    fox.startVertexOffset + fox.upperLeg.startVertexOffset,
    fox.upperLeg.numVertices);

  // lower
  modelMatrix.translate(0.0, 0.0, 0.5);
  modelMatrix.rotate(-30.0, 0, 1, 0);
  modelMatrix.rotate(-state.lowerLegAngle/1.2, 0, 1, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    fox.startVertexOffset + fox.lowerLeg.startVertexOffset,
    fox.lowerLeg.numVertices);

  // paw
  modelMatrix.translate(0.0, 0.0, 0.4);
  modelMatrix.rotate(20.0, 0, 1, 0);
  modelMatrix.rotate(state.pawAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

  gl.drawArrays(
    gl.TRIANGLE_STRIP,
    fox.startVertexOffset + fox.paw.startVertexOffset,
    fox.paw.numVertices);
}