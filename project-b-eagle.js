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

  var modA = UTILS.makeModOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, -0.08, 1.0, 1.0, 0.8, 0.0, 1.0);
  var modB = UTILS.makeModOptions(radius.midBeak, radius.midBeak, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, -0.02, 0.92, 1.0, 0.8, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(radius.beakHead, radius.beakHead, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, 0.8, 1.0, 1.0, 1.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(radius.midHead, radius.midHead, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, 0.6, 0.8, 0.8, 0.8, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(radius.headBody, radius.headBody, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, -0.03, 0.4, 0.5, 0.4, 0.2, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(radius.midBody, 0.8*radius.midBody, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, -0.05, 0.0, 0.5, 0.4, 0.2, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(radius.endBody, 0.5*radius.endBody, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, -0.5, 0.4, 0.3, 0.1, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, -0.5, 0.5, 0.4, 0.2, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  return vertices;
}

function makeEagleTail() {
  var numCapVertices = 8;
  var vertices = new Float32Array((numCapVertices*8) * FLOATS_PER_VERTEX);
  var i = 0;

  var modA = UTILS.makeModOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, 0.0, 0.4, 0.3, 0.1, 1.0);
  var modB = UTILS.makeModOptions(0.1, 0.05, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, 0.0, 0.4, 0.3, 0.1, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(0.4, 0.03, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, -0.25, 0.5, 0.4, 0.2, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(0.8, 0.02, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, -0.6, 0.8, 0.8, 0.8, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, -0.65, 1.0, 1.0, 1.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  return vertices;
}

function makeEagleWing() {
  return {
    upper: new Float32Array([
      0.0, 0.0, -0.14, 1.0, 0.4, 0.3, 0.1, 1.0,     0.0, 0.0, -1.0, 1.0,
      0.0, 0.0, 0.0, 1.0, 0.5, 0.4, 0.2, 1.0,      -1.0, 0.0, 0.0, 1.0,
      0.0, 0.04, 0.0, 1.0, 0.5, 0.4, 0.2, 1.0,      0.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 0.0, 1.0, 0.5, 0.4, 0.2, 1.0,      -1.0, 0.0, 0.0, 1.0,
      0.0, 0.0, 0.14, 1.0, 0.5, 0.4, 0.2, 1.0,      0.0, 0.0, 1.0, 1.0,
      0.0, 0.0, 0.0, 1.0, 0.5, 0.4, 0.2, 1.0,      -1.0, 0.0, 0.0, 1.0,
      0.0, -0.04, 0.0, 1.0, 0.5, 0.4, 0.2, 1.0,     0.0, -1.0, 0.0, 1.0,

      0.0, 0.0, -0.14, 1.0, 0.4, 0.3, 0.1, 1.0,     0.0, 0.0, -1.0, 1.0,
      0.25, 0.0, -0.17, 1.0, 0.4, 0.3, 0.1, 1.0,    0.0, 0.0, -1.0, 1.0,
      0.0, 0.04, 0.0, 1.0, 0.5, 0.4, 0.2, 1.0,      0.0, 1.0, 0.0, 1.0,
      0.25, 0.03, 0.0, 1.0, 0.5, 0.4, 0.2, 1.0,     0.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 0.17, 1.0, 0.5, 0.4, 0.2, 1.0,      0.0, 0.0, 1.0, 1.0,
      0.25, 0.0, 0.17, 1.0, 0.5, 0.4, 0.2, 1.0,     0.0, 0.0, 1.0, 1.0,
      0.0, -0.04, 0.0, 1.0, 0.5, 0.4, 0.2, 1.0,     0.0, -1.0, 0.0, 1.0,
      0.25, -0.03, 0.0, 1.0, 0.5, 0.4, 0.2, 1.0,    0.0, -1.0, 0.0, 1.0,
      0.25, 0.0, -0.17, 1.0, 0.4, 0.3, 0.1, 1.0,    0.0, 0.0, -1.0, 1.0,
    ]),

    middle: new Float32Array([
      0.0, 0.0, -0.17, 1.0, 0.4, 0.3, 0.1, 1.0,     0.0, 0.0, -1.0, 1.0,
      0.3, 0.0, -0.1, 1.0, 0.4, 0.3, 0.1, 1.0,      0.0, 0.0, -1.0, 1.0,
      0.0, 0.03, 0.0, 1.0, 0.5, 0.4, 0.2, 1.0,      0.0, 1.0, 0.0, 1.0,
      0.3, 0.02, 0.0, 1.0, 0.5, 0.4, 0.2, 1.0,      0.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 0.17, 1.0, 0.5, 0.4, 0.2, 1.0,      0.0, 0.0, 1.0, 1.0,
      0.3, 0.0, 0.23, 1.0, 0.5, 0.4, 0.2, 1.0,      0.0, 0.0, 1.0, 1.0,
      0.0, -0.03, 0.0, 1.0, 0.5, 0.4, 0.2, 1.0,     0.0, -1.0, 0.0, 1.0,
      0.3, -0.02, 0.0, 1.0, 0.5, 0.4, 0.2, 1.0,     0.0, -1.0, 0.0, 1.0,
      0.0, 0.0, -0.17, 1.0, 0.4, 0.3, 0.1, 1.0,     0.0, 0.0, -1.0, 1.0,
      0.3, 0.0, -0.1, 1.0, 0.4, 0.3, 0.1, 1.0,      0.0, 0.0, -1.0, 1.0,
    ]),
    lower: new Float32Array([
      0.0, 0.0, -0.1, 1.0, 0.4, 0.3, 0.1, 1.0,      0.0, 0.0, -1.0, 1.0,
      0.4, 0.0, -0.11, 1.0, 0.4, 0.3, 0.1, 1.0,     0.0, 0.0, -1.0, 1.0,
      0.0, 0.02, 0.0, 1.0, 0.5, 0.4, 0.2, 1.0,      0.0, 1.0, 0.0, 1.0,
      0.4, 0.0, -0.11, 1.0, 0.4, 0.3, 0.1, 1.0,     0.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 0.23, 1.0, 0.5, 0.4, 0.2, 1.0,      0.0, 0.0, 1.0, 1.0,
      0.4, 0.0, -0.11, 1.0, 0.4, 0.3, 0.1, 1.0,     0.0, 0.0, 1.0, 1.0,
      0.0, -0.02, 0.0, 1.0, 0.5, 0.4, 0.2, 1.0,     0.0, -1.0, 0.0, 1.0,
      0.4, 0.0, -0.11, 1.0, 0.4, 0.3, 0.1, 1.0,     0.0, -1.0, 0.0, 1.0,
      0.0, 0.0, -0.1, 1.0, 0.4, 0.3, 0.1, 1.0,      0.0, 0.0, -1.0, 1.0,
    ]),
  };
}