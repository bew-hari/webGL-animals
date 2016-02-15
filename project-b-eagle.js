function Eagle() {
  var bodyVertices = makeEagleBody(),
      tailVertices = makeEagleTail(),
      wingVertices = makeEagleWing();

  var body = {
    startVertexOffset: 0,
    numVertices: bodyVertices.length / FLOATS_PER_VERTEX,
  };

  var tail = {
    startVertexOffset: body.numVertices,
    numVertices: tailVertices.length / FLOATS_PER_VERTEX,
  };

  var upperWing = {
    startVertexOffset: tail.startVertexOffset + tail.numVertices,
    numVertices: wingVertices.upper.length / FLOATS_PER_VERTEX,
  };

  var middleWing = {
    startVertexOffset: upperWing.startVertexOffset + upperWing.numVertices,
    numVertices: wingVertices.middle.length / FLOATS_PER_VERTEX,
  };

  var lowerWing = {
    startVertexOffset: middleWing.startVertexOffset + middleWing.numVertices,
    numVertices: wingVertices.lower.length / FLOATS_PER_VERTEX,
  };
  
  var numElements = 
    bodyVertices.length
     + tailVertices.length
     + wingVertices.upper.length
     + wingVertices.middle.length
     + wingVertices.lower.length;

  var vertices = new Float32Array(numElements);

  vertices.set(bodyVertices, 0);
  vertices.set(tailVertices, tail.startVertexOffset*FLOATS_PER_VERTEX);
  vertices.set(wingVertices.upper, upperWing.startVertexOffset*FLOATS_PER_VERTEX);
  vertices.set(wingVertices.middle, middleWing.startVertexOffset*FLOATS_PER_VERTEX);
  vertices.set(wingVertices.lower, lowerWing.startVertexOffset*FLOATS_PER_VERTEX);

  // save all properties
  this.numElements = numElements;
  this.startVertexOffset = 0;
  this.numVertices = numElements / FLOATS_PER_VERTEX;
  this.vertices = vertices;
  this.body = body;
  this.tail = tail;
  this.upperWing = upperWing;
  this.middleWing = middleWing;
  this.lowerWing = lowerWing;
}

function makeEagleBody() {
  var numCapVertices = 8;
  var radius = {
    midBeak: 0.05,
    beakHead: 0.1,
    midHead: 0.15,
    headBody: 0.2,
    midBody: 0.25,
    endBody: 0.1,
  };

  var vertices = new Float32Array((numCapVertices*14) * FLOATS_PER_VERTEX);
  var i = 0;

  var modA = UTILS.makeCapOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, -0.08, 1.0, 1.0, 0.8, 0.0, 1.0);
  var modB = UTILS.makeCapOptions(radius.midBeak, radius.midBeak, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, -0.02, 0.92, 1.0, 0.8, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeCapOptions(radius.beakHead, radius.beakHead, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, 0.8, 1.0, 1.0, 1.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeCapOptions(radius.midHead, radius.midHead, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, 0.6, 0.8, 0.8, 0.8, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeCapOptions(radius.headBody, radius.headBody, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, -0.03, 0.4, 0.5, 0.4, 0.2, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeCapOptions(radius.midBody, 0.8*radius.midBody, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, -0.05, 0.0, 0.5, 0.4, 0.2, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeCapOptions(radius.endBody, 0.5*radius.endBody, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, -0.5, 0.4, 0.3, 0.1, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeCapOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, -0.5, 0.5, 0.4, 0.2, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  return vertices;
}

function makeEagleTail() {
  var numCapVertices = 8;
  var vertices = new Float32Array((numCapVertices*8) * FLOATS_PER_VERTEX);
  var i = 0;

  var modA = UTILS.makeCapOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.4, 0.3, 0.1, 1.0);
  var modB = UTILS.makeCapOptions(0.1, 0.05, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.4, 0.3, 0.1, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeCapOptions(0.4, 0.03, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, -0.25, 0.5, 0.4, 0.2, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeCapOptions(0.8, 0.02, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, -0.6, 0.8, 0.8, 0.8, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeCapOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, -0.65, 1.0, 1.0, 1.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  return vertices;
}

function makeEagleWing() {
  var numCapVertices = 4;
  
  // make the upper wing
  var upperVertices = new Float32Array((numCapVertices*6) * FLOATS_PER_VERTEX);
  var i = 0;

  var modA = UTILS.makeCapOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.5, 0.4, 0.2, 1.0);
  var modB = UTILS.makeCapOptions(0.14, 0.04, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.5, 0.4, 0.2, 1.0);
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modA, modB]);

  modA = UTILS.makeCapOptions(0.17, 0.03, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.25, 0.5, 0.4, 0.2, 1.0);
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modB, modA]);

  modB = UTILS.makeCapOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.25, 0.5, 0.4, 0.2, 1.0);
  i = UTILS.makeTube(numCapVertices, upperVertices, i, [modA, modB]);

  // make the middle wing
  var middleVertices = new Float32Array((numCapVertices*6) * FLOATS_PER_VERTEX);
  var i = 0;

  var modA = UTILS.makeCapOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.5, 0.4, 0.2, 1.0);
  var modB = UTILS.makeCapOptions(0.17, 0.03, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.5, 0.4, 0.2, 1.0);
  i = UTILS.makeTube(numCapVertices, middleVertices, i, [modA, modB]);

  modA = UTILS.makeCapOptions(0.16, 0.02, 0.0, 0.0, 0.0, 0.0, 1.0, -0.08, 0.0, 0.3, 0.5, 0.4, 0.2, 1.0);
  i = UTILS.makeTube(numCapVertices, middleVertices, i, [modB, modA]);

  modB = UTILS.makeCapOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, -0.08, 0.0, 0.3, 0.5, 0.4, 0.2, 1.0);
  i = UTILS.makeTube(numCapVertices, middleVertices, i, [modA, modB]);

  // make the lower wing
  var lowerVertices = new Float32Array((numCapVertices*4) * FLOATS_PER_VERTEX);
  var i = 0;

  var modA = UTILS.makeCapOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, -0.08, 0.0, 0.0, 0.5, 0.4, 0.2, 1.0);
  var modB = UTILS.makeCapOptions(0.16, 0.02, 0.0, 0.0, 0.0, 0.0, 1.0, -0.08, 0.0, 0.0, 0.5, 0.4, 0.2, 1.0);
  i = UTILS.makeTube(numCapVertices, lowerVertices, i, [modA, modB]);

  modA = UTILS.makeCapOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.15, 0.0, 0.4, 0.5, 0.4, 0.2, 1.0);
  i = UTILS.makeTube(numCapVertices, lowerVertices, i, [modB, modA]);

  return {
    upper: upperVertices,
    middle: middleVertices,
    lower: lowerVertices,
  };
}