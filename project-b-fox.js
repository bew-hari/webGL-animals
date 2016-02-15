function Fox() {
  var bodyVertices = makeFoxBody(),
      tailVertices = makeFoxTail(),
      legVertices = makeFoxLeg();

  var upperBody = {
    startVertexOffset: 0,
    numVertices: bodyVertices.upper.length / FLOATS_PER_VERTEX,
  };

  var lowerBody = {
    startVertexOffset: upperBody.numVertices,
    numVertices: bodyVertices.lower.length / FLOATS_PER_VERTEX,
  };

  var ear = {
    startVertexOffset: lowerBody.startVertexOffset + lowerBody.numVertices,
    numVertices: bodyVertices.ear.length / FLOATS_PER_VERTEX,
  };

  var upperTail = {
    startVertexOffset: ear.startVertexOffset + ear.numVertices,
    numVertices: tailVertices.upper.length / FLOATS_PER_VERTEX,
  };

  var middleTail = {
    startVertexOffset: upperTail.startVertexOffset + upperTail.numVertices,
    numVertices: tailVertices.middle.length / FLOATS_PER_VERTEX,
  };

  var lowerTail = {
    startVertexOffset: middleTail.startVertexOffset + middleTail.numVertices,
    numVertices: tailVertices.lower.length / FLOATS_PER_VERTEX,
  };

  var upperLeg = {
    startVertexOffset: lowerTail.startVertexOffset + lowerTail.numVertices,
    numVertices: legVertices.upper.length / FLOATS_PER_VERTEX,
  };

  var lowerLeg = {
    startVertexOffset: upperLeg.startVertexOffset + upperLeg.numVertices,
    numVertices: legVertices.lower.length / FLOATS_PER_VERTEX,
  };

  var paw = {
    startVertexOffset: lowerLeg.startVertexOffset + lowerLeg.numVertices,
    numVertices: legVertices.paw.length / FLOATS_PER_VERTEX,
  };

  var numElements = 
    bodyVertices.upper.length
    + bodyVertices.lower.length
    + bodyVertices.ear.length
    + tailVertices.upper.length
    + tailVertices.middle.length
    + tailVertices.lower.length
    + legVertices.upper.length
    + legVertices.lower.length
    + legVertices.paw.length;
  
  var vertices = new Float32Array(numElements);

  vertices.set(bodyVertices.upper, 0);
  vertices.set(bodyVertices.lower, lowerBody.startVertexOffset*FLOATS_PER_VERTEX);
  vertices.set(bodyVertices.ear, ear.startVertexOffset*FLOATS_PER_VERTEX);

  vertices.set(tailVertices.upper, upperTail.startVertexOffset*FLOATS_PER_VERTEX);
  vertices.set(tailVertices.middle, middleTail.startVertexOffset*FLOATS_PER_VERTEX);
  vertices.set(tailVertices.lower, lowerTail.startVertexOffset*FLOATS_PER_VERTEX);

  vertices.set(legVertices.upper, upperLeg.startVertexOffset*FLOATS_PER_VERTEX);
  vertices.set(legVertices.lower, lowerLeg.startVertexOffset*FLOATS_PER_VERTEX);
  vertices.set(legVertices.paw, paw.startVertexOffset*FLOATS_PER_VERTEX);

  // save all properties
  this.numElements = numElements;
  this.startVertexOffsetOffset = 0;
  this.numVertices = numElements / FLOATS_PER_VERTEX;
  this.vertices = vertices;
  this.upperBody = upperBody;
  this.lowerBody = lowerBody;
  this.ear = ear;
  this.upperTail = upperTail;
  this.middleTail = middleTail;
  this.lowerTail = lowerTail;
  this.upperLeg = upperLeg;
  this.lowerLeg = lowerLeg;
  this.paw = paw;
}

function makeFoxBody() {
  var numCapVertices = 8;
  var radius = {
    nose: 0.04,
    midSnout: 0.05,
    snoutHead: 0.1,
    midHead: 0.15,
    headNeck: 0.14,
    neckBody: 0.25,
    midBody: 0.2,
    lowerBody: 0.15,
  };

  // make the upper body
  var upperVertices = new Float32Array((numCapVertices*16) * FLOATS_PER_VERTEX);
  var i = 0;

  var modA = UTILS.makeCapOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.1, 1.0, 0.0, 0.0, 0.0, 1.0);
  var modB = UTILS.makeCapOptions(radius.nose, radius.nose, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.08, 0.93, 0.8, 0.3, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modA, modB]);

  modA = UTILS.makeCapOptions(radius.midSnout, radius.midSnout, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.1, 0.85, 0.8, 0.3, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modB, modA]);

  modB = UTILS.makeCapOptions(0.8*radius.snoutHead, radius.snoutHead, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.15, 0.78, 0.8, 0.3, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modA, modB]);

  modA = UTILS.makeCapOptions(radius.midHead, radius.midHead, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.18, 0.7, 0.8, 0.3, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modB, modA]);

  modB = UTILS.makeCapOptions(0.8*radius.headNeck, radius.headNeck, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.2, 0.55, 0.75, 0.25, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modA, modB]);

  modA = UTILS.makeCapOptions(0.8*radius.neckBody, radius.neckBody, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.05, 0.3, 0.8, 0.3, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modB, modA]);

  modB = UTILS.makeCapOptions(0.8*radius.midBody, radius.midBody, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, 0.0, 0.8, 0.3, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modA, modB]);

  modA = UTILS.makeCapOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, -0.2, 0.8, 0.3, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modB, modA]);

  // make the lower body
  var lowerVertices = new Float32Array((numCapVertices*6) * FLOATS_PER_VERTEX);
  var i = 0;

  modA = UTILS.makeCapOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, 0.2, 0.8, 0.3, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, lowerVertices, i, [modA, modB]);

  modA = UTILS.makeCapOptions(radius.lowerBody, radius.lowerBody, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, -0.5, 0.75, 0.25, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, lowerVertices, i, [modB, modA]);
  
  modB = UTILS.makeCapOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.1, -0.6, 0.65, 0.15, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, lowerVertices, i, [modA, modB]);

  // make the ear
  var earVertices = new Float32Array([
    0.5, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0,     1.0, 1.0, 1.0, 0.0,
    0.0, 0.0, -0.3, 1.0, 0.8, 0.3, 0.0, 1.0,    1.0, 1.0, 1.0, 0.0,
    -0.5, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0,    1.0, 1.0, 1.0, 0.0,
    0.0, 0.5, 0.0, 1.0, 0.8, 0.3, 0.0, 1.0,     1.0, 1.0, 1.0, 0.0,
    0.5, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0,     1.0, 1.0, 1.0, 0.0,
    0.0, 0.0, -0.3, 1.0, 0.8, 0.3, 0.0, 1.0,    1.0, 1.0, 1.0, 0.0,
  ]);

  // now do color correction
  var i = (12 + 2*numCapVertices) * FLOATS_PER_VERTEX;
  for ( ; i<upperVertices.length; i+=2*FLOATS_PER_VERTEX*numCapVertices) {
    upperVertices[i+4] = 1.0;
    upperVertices[i+5] = 1.0;
    upperVertices[i+6] = 1.0;
    upperVertices[i+7] = 1.0;
    upperVertices[i+FLOATS_PER_VERTEX+4] = 1.0;
    upperVertices[i+FLOATS_PER_VERTEX+5] = 1.0;
    upperVertices[i+FLOATS_PER_VERTEX+6] = 1.0;
    upperVertices[i+FLOATS_PER_VERTEX+7] = 1.0;
  }

  i = 12 * FLOATS_PER_VERTEX;
  for ( ; i<lowerVertices.length; i+=2*FLOATS_PER_VERTEX*numCapVertices) {
    lowerVertices[i+4] = 1.0;
    lowerVertices[i+5] = 1.0;
    lowerVertices[i+6] = 1.0;
    lowerVertices[i+7] = 1.0;
    lowerVertices[i+FLOATS_PER_VERTEX+4] = 1.0;
    lowerVertices[i+FLOATS_PER_VERTEX+5] = 1.0;
    lowerVertices[i+FLOATS_PER_VERTEX+6] = 1.0;
    lowerVertices[i+FLOATS_PER_VERTEX+7] = 1.0;
  }

  return {
    upper: upperVertices,
    lower: lowerVertices,
    ear: earVertices,
  };
}

function makeFoxTail() {
  var numCapVertices = 8;
  var radius = {
    upperTail: 0.08,
    midTail: 0.15,
    lowerTail: 0.1,
  };

  // make the upper tail
  var upperVertices = new Float32Array((numCapVertices*6) * FLOATS_PER_VERTEX);
  var i = 0;

  // initialize modification objects
  var modA = UTILS.makeCapOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, 0.0, 0.7, 0.2, 0.0, 1.0);
  var modB = UTILS.makeCapOptions(radius.upperTail, radius.upperTail, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, -0.1, 0.7, 0.2, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modA, modB]);

  modA = UTILS.makeCapOptions(radius.midTail, radius.midTail, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, -0.5, 0.8, 0.3, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modB, modA]);

  modB = UTILS.makeCapOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, -0.8, 0.8, 0.3, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modA, modB]);
  
  // middle tail
  var middleVertices = new Float32Array((numCapVertices*6) * FLOATS_PER_VERTEX);
  var i = 0;

  modB = UTILS.makeCapOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, -0.3, 0.8, 0.3, 0.0, 1.0);
  modA = UTILS.makeCapOptions(radius.midTail, radius.midTail, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, 0.0, 0.8, 0.3, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, middleVertices, i, [modB, modA]);

  modB = UTILS.makeCapOptions(radius.lowerTail, radius.lowerTail, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, -0.3, 1.0, 1.0, 1.0, 1.0);
  i = UTILS.makeTube(numCapVertices, middleVertices, i, [modA, modB]);

  modA = UTILS.makeCapOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, -0.4, 1.0, 1.0, 1.0, 1.0);
  i = UTILS.makeTube(numCapVertices, middleVertices, i, [modB, modA]);

  // lower tail
  var lowerVertices = new Float32Array((numCapVertices*4) * FLOATS_PER_VERTEX);
  var i = 0;

  modA = UTILS.makeCapOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, -0.3, 1.0, 1.0, 1.0, 1.0);
  modB = UTILS.makeCapOptions(radius.lowerTail, radius.lowerTail, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0);
  i = UTILS.makeTube(numCapVertices, lowerVertices, i, [modA, modB]);

  modA = UTILS.makeCapOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, -0.2, 1.0, 1.0, 1.0, 1.0);
  i = UTILS.makeTube(numCapVertices, lowerVertices, i, [modB, modA]);

  return {
    upper: upperVertices,
    middle: middleVertices,
    lower: lowerVertices,
  };
}

function makeFoxLeg() {
  var numCapVertices = 8;
  var radius = {
    shoulder: 0.2,
    knee: 0.07,
    ankle: 0.05,
    anklePaw: 0.1,
    paw: 0.1,
  };

  // make the upper leg
  var upperVertices = new Float32Array((numCapVertices*6) * FLOATS_PER_VERTEX);
  var i = 0;

  // initialize modification objects
  var modA = UTILS.makeCapOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, -0.05, -0.2, 0.8, 0.3, 0.0, 1.0);
  var modB = UTILS.makeCapOptions(radius.shoulder, 0.7*radius.shoulder, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, 0.0, 0.78, 0.28, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modA, modB]);

  modA = UTILS.makeCapOptions(radius.knee, 0.7*radius.knee, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, 0.5, 0.7, 0.2, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modB, modA]);

  modB = UTILS.makeCapOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, 0.58, 0.7, 0.2, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modA, modB]);

  // make the lower leg
  var lowerVertices = new Float32Array((numCapVertices*6) * FLOATS_PER_VERTEX);
  var i = 0;

  modA = UTILS.makeCapOptions(radius.knee, 0.7*radius.knee, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, 0.0, 0.7, 0.2, 0.0, 1.0);
  modB = UTILS.makeCapOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, -0.05, 0.7, 0.2, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, lowerVertices, i, [modB, modA]);

  modB = UTILS.makeCapOptions(radius.ankle, radius.ankle, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, 0.4, 0.3, 0.1, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, lowerVertices, i, [modA, modB]);

  modA = UTILS.makeCapOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, 0.45, 0.3, 0.1, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, lowerVertices, i, [modB, modA]);

  // make the paw
  var pawVertices = new Float32Array((numCapVertices*8) * FLOATS_PER_VERTEX);
  var i = 0;

  modA = UTILS.makeCapOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, -0.05, 0.3, 0.1, 0.0, 1.0);
  modB = UTILS.makeCapOptions(radius.ankle, radius.ankle, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, 0.0, 0.3, 0.1, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, pawVertices, i, [modA, modB]);

  modA = UTILS.makeCapOptions(radius.anklePaw, 0.7*radius.anklePaw, 0.0, 0.0, 0.0, 0.0, 0.1, -0.05, 0.0, 0.05, 0.3, 0.1, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, pawVertices, i, [modB, modA]);

  modB = UTILS.makeCapOptions(radius.paw, 0.7*radius.paw, 0.0, 0.0, 0.0, 0.0, 0.1, -0.05, 0.0, 0.1, 0.3, 0.1, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, pawVertices, i, [modA, modB]);

  modA = UTILS.makeCapOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, 0.1, 0.4, 0.15, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, pawVertices, i, [modB, modA]);

  return {
    upper: upperVertices,
    lower: lowerVertices,
    paw: pawVertices,
  };
}