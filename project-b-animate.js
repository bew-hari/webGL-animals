// Last time that this function was called
var g_last = Date.now();

function animate() {
  var state = globals.state;
  var rates = globals.rates;

  // Calculate the elapsed time
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;

  // don't change any animation parameter if paused
  if (state.isPaused)
    elapsed = 0;

  animateView(elapsed);

  animateAnimals(elapsed);
}

function animateAnimals(elapsed) {
  var state = globals.state;
  var rates = globals.rates;

  // eagle wing angle
  var wingAngle = state.eagle.wingAngle;
  if (wingAngle >   30.0 && rates.eagleStep > 0) 
    rates.eagleStep = -rates.eagleStep/2;

  if (wingAngle <  -40.0 && rates.eagleStep < 0) 
    rates.eagleStep = -rates.eagleStep*2;

  var newWingAngle = wingAngle + (rates.eagleStep * elapsed) / 1000.0;
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

function animateView(elapsed) {

  var eye = globals.state.view.eye,
      lookAt = globals.state.view.lookAt,
      pan = globals.state.view.pan,
      cylinderRadius = globals.state.view.cylinderRadius;

  var eyeStep = globals.rates.view.eyeStep,
      panStep = globals.rates.view.panStep;

  // calculate forward and right unit vectors
  var forward = new Vector3([Math.sin(pan.horizontal*Math.PI/180), Math.cos(pan.horizontal*Math.PI/180), pan.vertical/cylinderRadius]).normalize();
  var right = forward.cross(new Vector3([0, 0, 1])).normalize();

  var normalizer = Math.sqrt(eyeStep.right*eyeStep.right + eyeStep.forward*eyeStep.forward);
  normalizer = normalizer == 0 ? 1 : normalizer;

  var dx = (eyeStep.right * right.elements[0] + eyeStep.forward * forward.elements[0]) / normalizer * EYE_STEP,
      dy = (eyeStep.right * right.elements[1] + eyeStep.forward * forward.elements[1]) / normalizer * EYE_STEP,
      dz = (eyeStep.up + eyeStep.forward * forward.elements[2]) / normalizer;
  
  // eye translation
  eye.x += (dx * elapsed) / 1000.0;
  eye.y += (dy * elapsed) / 1000.0;
  eye.z += (dz * elapsed) / 1000.0;

  // pan
  pan.horizontal += (panStep.horizontal * elapsed) / 1000.0;
  pan.vertical += (panStep.vertical * elapsed) / 1000.0;
  pan.horizontal %= 360;
  pan.vertical %= 360;

  // lookAt adjustment
  lookAt.x = eye.x + Math.sin(pan.horizontal*Math.PI/180)*cylinderRadius;
  lookAt.y = eye.y + Math.cos(pan.horizontal*Math.PI/180)*cylinderRadius;
  lookAt.z = eye.z + pan.vertical;
}