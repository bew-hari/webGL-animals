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
  var eagle = globals.state.eagle;

  if (cb.checked) 
    eagle.show = true;
  else
    eagle.show = false;
}

function toggleFox(cb) {
  var fox = globals.state.fox;

  if (cb.checked) 
    fox.show = true;
  else
    fox.show = false;
}

function winResize() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');
  
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  globals.canvas = canvas;
  globals.gl = gl;
}

function updateLightType (radio) {
  if (radio.id == 'ambient-light')
    globals.state.light.type = 0;
  else if (radio.id == 'directional-light')
    globals.state.light.type = 1;
  else if (radio.id == 'point-source-light')
    globals.state.light.type = 2;
}

function updateLightPos() {
  var xInput = document.getElementById('light-x'),
      yInput = document.getElementById('light-y'),
      zInput = document.getElementById('light-z');

  if (xInput.value == '')
    xInput.value = globals.state.light.pos.x;
  else
    globals.state.light.pos.x = xInput.value;

  if (yInput.value == '')
    yInput.value = globals.state.light.pos.y;
  else
    globals.state.light.pos.y = yInput.value;

  if (zInput.value == '')
    zInput.value = globals.state.light.pos.z;
  else
    globals.state.light.pos.z = zInput.value;
}

// mouse functions
function registerMouseEvents(gl) {
  var canvas = globals.canvas;
  canvas.onmousedown = function(e) { myMouseDown(e, gl); };
  canvas.onmousemove = function(e) { myMouseMove(e, gl); };
  canvas.onmouseup = function(e) { myMouseUp(e, gl); };
}

function unregisterMouseEvents(gl) {
  var canvas = globals.canvas;
  canvas.onmousedown = null;
  canvas.onmousemove = null;
  canvas.onmouseup = null;
}

function myMouseDown(e, gl) {
  var canvas = globals.canvas;
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

function myMouseMove(e, gl) {
  var canvas = globals.canvas;
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

function myMouseUp(e, gl) {
  var canvas = globals.canvas;
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
    //console.log(globals.state.view.pan);
    var pan = globals.state.view.pan; var cylinderRadius = globals.state.view.cylinderRadius;
    //console.log(Math.sin(pan.horizontal*Math.PI/180), -Math.cos(pan.horizontal*Math.PI/180), pan.vertical/cylinderRadius);
    console.log(globals.state.view.lookAt);
  }
}

function updateOrientation(orientation, xdrag, ydrag) {
  var newQuat = new Quaternion(0, 0, 0, 1);
  var tmpQuat = new Quaternion(0, 0, 0, 1);

  var dist = Math.sqrt(xdrag*xdrag + ydrag*ydrag);

  newQuat.setFromAxisAngle(-ydrag + 0.0001, -xdrag + 0.0001, 0.0, dist*150.0);

  // apply new rotation
  tmpQuat.multiply(newQuat, orientation.quat);
  tmpQuat.normalize();

  // then set orientation to result
  orientation.quat.copy(tmpQuat);

  // convert quaternion to matrix
  orientation.mat.setFromQuat(tmpQuat.x, tmpQuat.y, tmpQuat.z, tmpQuat.w);
}

function openUI() {
  globals.isUIToggled = true;
  document.getElementById('instructions').style.display = 'block';
}

function closeUI() {
  globals.isUIToggled = false;
  document.getElementById('instructions').style.display = 'none';
}

document.getElementById('close-instructions').onclick = function() {
  document.getElementById('instructions').style.display = 'none';
}

// keyboard listeners
window.onkeydown = function(e) {
  var eye = globals.state.view.eye,
      pan = globals.state.view.pan,
      cylinderRadius = globals.state.view.cylinderRadius;

  var eyeStep = globals.rates.view.eyeStep,
      panStep = globals.rates.view.panStep;

  var forward = new Vector3([Math.sin(pan.horizontal*Math.PI/180), pan.vertical/cylinderRadius, -Math.cos(pan.horizontal*Math.PI/180)]).normalize();
  var right = forward.cross(new Vector3([0, 1, 0])).normalize();

  switch (e.keyCode) {
    case 65: // A key
      eyeStep.right = -EYE_STEP;
      break;
    case 68: // D key
      eyeStep.right = EYE_STEP;
      break;
    case 87: // W key
      eyeStep.up = EYE_STEP;
      break;
    case 83: // S key
      eyeStep.up = -EYE_STEP;
      break;
    case 81: // Q key
      eyeStep.forward = -EYE_STEP;
      break;
    case 69: // E key
      eyeStep.forward = EYE_STEP;
      break;
    case 37: // left arrow
      panStep.horizontal = -20*PAN_STEP;
      break;
    case 39: // right arrow
      panStep.horizontal = 20*PAN_STEP;
      break;
    case 38: // up arrow
      panStep.vertical = PAN_STEP;
      break;
    case 40: // down arrow
      panStep.vertical = -PAN_STEP;
      break;
    default:
      return;
  }
};

window.onkeyup = function(e) {
  var state = globals.state;
  var eyeStep = globals.rates.view.eyeStep,
      panStep = globals.rates.view.panStep;

  switch (e.keyCode) {
    case 65: // A key
    case 68: // D key
      eyeStep.right = 0;
      break;
    case 87: // W key
    case 83: // S key
      eyeStep.up = 0;
      break;
    case 81: // Q key
    case 69: // E key
      eyeStep.forward = 0;
      break;
    case 37: // left arrow
    case 39: // right arrow
      panStep.horizontal = 0;
      break;
    case 38: // up arrow
    case 40: // down arrow
      panStep.vertical = 0;
      break;
    case 32: // spacebar
      state.isPaused = !state.isPaused;
      break;
    case 72: // H key
      openUI();
      break;
    case 27: // esc key
      closeUI();
      break;
    default:
      return;
  }
};
