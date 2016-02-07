function Fox() {
  var bodyVertices = makeFoxBody(),
      tailVertices = makeFoxTail(),
      legVertices = makeFoxLeg();

  var upperBody = {
    startVertex: 0,
    numVertices: bodyVertices.upper.length / FLOATS_PER_VERTEX,
  };

  var lowerBody = {
    startVertex: upperBody.numVertices,
    numVertices: bodyVertices.lower.length / FLOATS_PER_VERTEX,
  };

  var ear = {
    startVertex: lowerBody.startVertex + lowerBody.numVertices,
    numVertices: bodyVertices.ear.length / FLOATS_PER_VERTEX,
  };

  var upperTail = {
    startVertex: ear.startVertex + ear.numVertices,
    numVertices: tailVertices.upper.length / FLOATS_PER_VERTEX,
  };

  var middleTail = {
    startVertex: upperTail.startVertex + upperTail.numVertices,
    numVertices: tailVertices.middle.length / FLOATS_PER_VERTEX,
  };

  var lowerTail = {
    startVertex: middleTail.startVertex + middleTail.numVertices,
    numVertices: tailVertices.lower.length / FLOATS_PER_VERTEX,
  };

  var upperLeg = {
    startVertex: lowerTail.startVertex + lowerTail.numVertices,
    numVertices: legVertices.upper.length / FLOATS_PER_VERTEX,
  };

  var lowerLeg = {
    startVertex: upperLeg.startVertex + upperLeg.numVertices,
    numVertices: legVertices.lower.length / FLOATS_PER_VERTEX,
  };

  var paw = {
    startVertex: lowerLeg.startVertex + lowerLeg.numVertices,
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
  vertices.set(bodyVertices.lower, lowerBody.startVertex*FLOATS_PER_VERTEX);
  vertices.set(bodyVertices.ear, ear.startVertex*FLOATS_PER_VERTEX);

  vertices.set(tailVertices.upper, upperTail.startVertex*FLOATS_PER_VERTEX);
  vertices.set(tailVertices.middle, middleTail.startVertex*FLOATS_PER_VERTEX);
  vertices.set(tailVertices.lower, lowerTail.startVertex*FLOATS_PER_VERTEX);

  vertices.set(legVertices.upper, upperLeg.startVertex*FLOATS_PER_VERTEX);
  vertices.set(legVertices.lower, lowerLeg.startVertex*FLOATS_PER_VERTEX);
  vertices.set(legVertices.paw, paw.startVertex*FLOATS_PER_VERTEX);

  // save all properties
  this.numElements = numElements;
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

  this.adjustStartVertices = function(offset) {
    this.upperBody.startVertex += offset;
    this.lowerBody.startVertex += offset;
    this.ear.startVertex += offset;
    this.upperTail.startVertex += offset;
    this.middleTail.startVertex += offset;
    this.lowerTail.startVertex += offset;
    this.upperLeg.startVertex += offset;
    this.lowerLeg.startVertex += offset;
    this.paw.startVertex += offset;
  };
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

  // initialize modification objects
  var modA = {
    scale: {x: 0.0, y: 0.0, z: 0.0}, 
    translate: {x: 0.0, y: 0.1, z: 1.0},
    color: {r: 0.0, g: 0.0, b: 0.0},
  };

  var modB = {
    scale: {x: radius.nose, y: radius.nose, z: 0.0}, 
    translate: {x: 0.0, y: 0.08, z: 0.93},
    color: {r: 0.8, g: 0.3, b: 0.0},
  };
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modA, modB]);

  modA = {
    scale: {x: radius.midSnout, y: radius.midSnout, z: 0.0},
    translate: {x: 0.0, y: 0.1, z: 0.85},
    color: {r: 0.8, g: 0.3, b: 0.0},
  };
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modB, modA]);

  modB = {
    scale: {x: 0.8*radius.snoutHead, y: radius.snoutHead, z: 0.0}, 
    translate: {x: 0.0, y: 0.15, z: 0.78},
    color: {r: 0.8, g: 0.3, b: 0.0},
  };
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modA, modB]);

  modA = {
    scale: {x: radius.midHead, y: radius.midHead, z: 0.0},
    translate: {x: 0.0, y: 0.18, z: 0.7},
    color: {r: 0.8, g: 0.3, b: 0.0},
  };
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modB, modA]);

  modB = {
    scale: {x: 0.8*radius.headNeck, y: radius.headNeck, z: 0.0}, 
    translate: {x: 0.0, y: 0.2, z: 0.55},
    color: {r: 0.75, g: 0.25, b: 0.0},
  };
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modA, modB]);

  modA = {
    scale: {x: 0.8*radius.neckBody, y: radius.neckBody, z: 0.0},
    translate: {x: 0.0, y: 0.05, z: 0.3},
    color: {r: 0.8, g: 0.3, b: 0.0},
  };
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modB, modA]);

  modB = {
    scale: {x: 0.8*radius.midBody, y: radius.midBody, z: 0.0}, 
    translate: {x: 0.0, y: 0.0, z: 0.0},
    color: {r: 0.8, g: 0.3, b: 0.0},
  };
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modA, modB]);

  modA = {
    scale: {x: 0.0, y: 0.0, z: 0.0},
    translate: {x: 0.0, y: 0.0, z: -0.2},
    color: {r: 0.8, g: 0.3, b: 0.0},
  };
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modB, modA]);

  // make the lower body
  var lowerVertices = new Float32Array((numCapVertices*6) * FLOATS_PER_VERTEX);
  var i = 0;

  modA.translate.z = 0.2;
  modB.translate.z = 0.0;
  i = UTILS.makeTube(numCapVertices, lowerVertices, i, [modA, modB]);

  modA = {
    scale: {x: 0.9*radius.lowerBody, y: radius.lowerBody, z: 0.0}, 
    translate: {x: 0.0, y: 0.0, z: -0.5},
    color: {r: 0.75, g: 0.25, b: 0.0},
  };
  i = UTILS.makeTube(numCapVertices, lowerVertices, i, [modB, modA]);
  
  modB = {
    scale: {x: 0.0, y: 0.0, z: 0.0}, 
    translate: {x: 0.0, y: 0.1, z: -0.6},
    color: {r: 0.65, g: 0.15, b: 0.0},
  };
  i = UTILS.makeTube(numCapVertices, lowerVertices, i, [modA, modB]);

  // make the ear
  var earVertices = new Float32Array([
    0.5, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0,
    0.0, 0.0, -0.3, 1.0, 0.8, 0.3, 0.0,
    -0.5, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0,
    0.0, 0.5, 0.0, 1.0, 0.8, 0.3, 0.0,
    0.5, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0,
    0.0, 0.0, -0.3, 1.0, 0.8, 0.3, 0.0,
  ]);

  // now do color correction
  var i = (12 + 2*numCapVertices) * FLOATS_PER_VERTEX;
  for ( ; i<upperVertices.length; i+=2*FLOATS_PER_VERTEX*numCapVertices) {
    upperVertices[i+4] = 1.0;
    upperVertices[i+5] = 1.0;
    upperVertices[i+6] = 1.0;
    upperVertices[i+11] = 1.0;
    upperVertices[i+12] = 1.0;
    upperVertices[i+13] = 1.0;
  }

  i = 12 * FLOATS_PER_VERTEX;
  for ( ; i<lowerVertices.length; i+=2*FLOATS_PER_VERTEX*numCapVertices) {
    lowerVertices[i+4] = 1.0;
    lowerVertices[i+5] = 1.0;
    lowerVertices[i+6] = 1.0;
    lowerVertices[i+11] = 1.0;
    lowerVertices[i+12] = 1.0;
    lowerVertices[i+13] = 1.0;
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
  var modA = {
    scale: {x: 0.0, y: 0.0, z: 0.0}, 
    translate: {x: 0.0, y: 0.0, z: 0.0},
    color: {r: 0.7, g: 0.2, b: 0.0},
  };

  var modB = {
    scale: {x: radius.upperTail, y: radius.upperTail, z: 0.0}, 
    translate: {x: 0.0, y: 0.0, z: -0.1},
    color: {r: 0.7, g: 0.2, b: 0.0},
  };
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modA, modB]);

  modA = {
    scale: {x: radius.midTail, y: radius.midTail, z: 0.0}, 
    translate: {x: 0.0, y: 0.0, z: -0.5},
    color: {r: 0.8, g: 0.3, b: 0.0},
  };
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modB, modA]);

  modB = {
    scale: {x: 0.0, y: 0.0, z: 0.0}, 
    translate: {x: 0.0, y: 0.0, z: -0.8},
    color: {r: 0.8, g: 0.3, b: 0.0},
  };
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modA, modB]);
  
  // middle tail
  var middleVertices = new Float32Array((numCapVertices*6) * FLOATS_PER_VERTEX);
  var i = 0;

  modB.translate.z = -0.3;
  modA.translate.z = 0.0;
  i = UTILS.makeTube(numCapVertices, middleVertices, i, [modB, modA]);

  modB = {
    scale: {x: radius.lowerTail, y: radius.lowerTail, z: 0.0}, 
    translate: {x: 0.0, y: 0.0, z: -0.3},
    color: {r: 1.0, g: 1.0, b: 1.0},
  };
  i = UTILS.makeTube(numCapVertices, middleVertices, i, [modA, modB]);

  modA = {
    scale: {x: 0.0, y: 0.0, z: 0.0}, 
    translate: {x: 0.0, y: 0.0, z: -0.4},
    color: {r: 1.0, g: 1.0, b: 1.0},
  };
  i = UTILS.makeTube(numCapVertices, middleVertices, i, [modB, modA]);

  // lower tail
  var lowerVertices = new Float32Array((numCapVertices*4) * FLOATS_PER_VERTEX);
  var i = 0;

  modA.translate.z = -0.3;
  modB.translate.z = 0.0;
  i = UTILS.makeTube(numCapVertices, lowerVertices, i, [modA, modB]);

  modA = {
    scale: {x: 0.0, y: 0.0, z: 0.0}, 
    translate: {x: 0.0, y: 0.0, z: -0.2},
    color: {r: 1.0, g: 1.0, b: 1.0},
  };
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
  var modA = {
    scale: {x: 0.0, y: 0.0, z: 0.0}, 
    translate: {x: 0.0, y: -0.05, z: -0.2},
    color: {r: 0.8, g: 0.3, b: 0.0},
  };

  var modB = {
    scale: {x: radius.shoulder, y: 0.7*radius.shoulder, z: 0.0}, 
    translate: {x: 0.0, y: 0.0, z: 0.0},
    color: {r: 0.78, g: 0.28, b: 0.0},
  };
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modA, modB]);

  modA = {
    scale: {x: radius.knee, y: 0.7*radius.knee, z: 0.0}, 
    translate: {x: 0.0, y: 0.0, z: 0.5},
    color: {r: 0.7, g: 0.2, b: 0.0},
  };
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modB, modA]);

  modB = {
    scale: {x: 0.0, y: 0.0, z: 0.0}, 
    translate: {x: 0.0, y: 0.0, z: 0.58},
    color: {r: 0.7, g: 0.2, b: 0.0},
  };
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modA, modB]);

  // make the lower leg
  var lowerVertices = new Float32Array((numCapVertices*6) * FLOATS_PER_VERTEX);
  var i = 0;

  modA.translate.z = 0.0;
  modB.translate.z = -0.05;
  i = UTILS.makeTube(numCapVertices, lowerVertices, i, [modB, modA]);

  modB = {
    scale: {x: radius.ankle, y: radius.ankle, z: 0.0}, 
    translate: {x: 0.0, y: 0.0, z: 0.4},
    color: {r: 0.3, g: 0.1, b: 0.0},
  };
  i = UTILS.makeTube(numCapVertices, lowerVertices, i, [modA, modB]);

  modA = {
    scale: {x: 0.0, y: 0.0, z: 0.0}, 
    translate: {x: 0.0, y: 0.0, z: 0.45},
    color: {r: 0.3, g: 0.1, b: 0.0},
  };
  i = UTILS.makeTube(numCapVertices, lowerVertices, i, [modB, modA]);

  // make the paw
  var pawVertices = new Float32Array((numCapVertices*8) * FLOATS_PER_VERTEX);
  var i = 0;

  modA.translate.z = -0.05;
  modB.translate.z = 0.0;
  i = UTILS.makeTube(numCapVertices, pawVertices, i, [modA, modB]);

  modA = {
    scale: {x: radius.anklePaw, y: 0.7*radius.anklePaw, z: 0.0}, 
    translate: {x: -0.05, y: 0.0, z: 0.05},
    color: {r: 0.3, g: 0.1, b: 0.0},
  };
  i = UTILS.makeTube(numCapVertices, pawVertices, i, [modB, modA]);

  modB = {
    scale: {x: radius.paw, y: 0.7*radius.paw, z: 0.0}, 
    translate: {x: -0.05, y: 0.0, z: 0.1},
    color: {r: 0.3, g: 0.1, b: 0.0},
  };
  i = UTILS.makeTube(numCapVertices, pawVertices, i, [modA, modB]);

  modA = {
    scale: {x: 0.0, y: 0.0, z: 0.0}, 
    translate: {x: 0.0, y: 0.0, z: 0.1},
    color: {r: 0.4, g: 0.15, b: 0.0},
  };
  i = UTILS.makeTube(numCapVertices, pawVertices, i, [modB, modA]);

  return {
    upper: upperVertices,
    lower: lowerVertices,
    paw: pawVertices,
  };
}