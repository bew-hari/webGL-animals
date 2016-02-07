function Eagle() {
  var bodyVertices = makeEagleBody(),
      tailVertices = makeEagleTail(),
      wingVertices = makeEagleWing();

  var body = {
    startVertex: 0,
    numVertices: bodyVertices.length / FLOATS_PER_VERTEX,
  };

  var tail = {
    startVertex: body.numVertices,
    numVertices: tailVertices.length / FLOATS_PER_VERTEX,
  };

  var upperWing = {
    startVertex: tail.startVertex + tail.numVertices,
    numVertices: wingVertices.upper.length / FLOATS_PER_VERTEX,
  };

  var middleWing = {
    startVertex: upperWing.startVertex + upperWing.numVertices,
    numVertices: wingVertices.middle.length / FLOATS_PER_VERTEX,
  };

  var lowerWing = {
    startVertex: middleWing.startVertex + middleWing.numVertices,
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
  vertices.set(tailVertices, tail.startVertex*FLOATS_PER_VERTEX);
  vertices.set(wingVertices.upper, upperWing.startVertex*FLOATS_PER_VERTEX);
  vertices.set(wingVertices.middle, middleWing.startVertex*FLOATS_PER_VERTEX);
  vertices.set(wingVertices.lower, lowerWing.startVertex*FLOATS_PER_VERTEX);

  // save all properties
  this.numElements = numElements;
  this.vertices = vertices;
  this.body = body;
  this.tail = tail;
  this.upperWing = upperWing;
  this.middleWing = middleWing;
  this.lowerWing = lowerWing;

  this.adjustStartVertices = function(offset) {
    this.body.startVertex += offset;
    this.tail.startVertex += offset;
    this.upperWing.startVertex += offset;
    this.middleWing.startVertex += offset;
    this.lowerWing.startVertex += offset;
  };
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

  // initialize modification objects
  var modA = {
    scale: {x: 0.0, y: 0.0, z: 0.0}, 
    translate: {x: 0.0, y: -0.08, z: 1.0},
    color: {r: 1.0, g: 0.8, b: 0.0}
  };

  var modB = {
    scale: {x: radius.midBeak, y: radius.midBeak, z: 0.0}, 
    translate: {x: 0.0, y: -0.02, z: 0.92},
    color: {r: 1.0, g: 0.8, b: 0.0}
  };

  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = {
    scale: {x: radius.beakHead, y: radius.beakHead, z: 0.0},
    translate: {x: 0.0, y: 0.0, z: 0.8},
    color: {r: 1.0, g: 1.0, b: 1.0},
  };
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = {
    scale: {x: radius.midHead, y: radius.midHead, z: 0.0},
    translate: {x: 0.0, y: 0.0, z: 0.6},
    color: {r: 0.8, g: 0.8, b: 0.8},
  };
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = {
    scale: {x: radius.headBody, y: radius.headBody, z: 0.0},
    translate: {x: 0.0, y: -0.03, z: 0.4},
    color: {r: 0.5, g: 0.4, b: 0.2},
  };
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = {
    scale: {x: radius.midBody, y: 0.8*radius.midBody, z: 0.0},
    translate: {x: 0.0, y: -0.05, z: 0.0},
    color: {r: 0.5, g: 0.4, b: 0.2},
  };
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = {
    scale: {x: radius.endBody, y: 0.5*radius.endBody, z: 0.0},
    translate: {x: 0.0, y: 0.0, z: -0.5},
    color: {r: 0.4, g: 0.3, b: 0.1},
  };
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = {
    scale: {x: 0.0, y: 0.0, z: 0.0},
    translate: {x: 0.0, y: 0.0, z: -0.5},
    color: {r: 0.5, g: 0.4, b: 0.2},
  };
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  return vertices;
}

function makeEagleTail() {
  var numCapVertices = 8;
  var vertices = new Float32Array((numCapVertices*8) * FLOATS_PER_VERTEX);
  var i = 0;

  modA = {
    scale: {x: 0.0, y: 0.0, z: 0.0}, 
    translate: {x: 0.0, y: 0.0, z: 0.0},
    color: {r: 0.4, g: 0.3, b: 0.1},
  };
  modB = {
    scale: {x: 0.1, y: 0.05, z: 0.0},
    translate: {x: 0.0, y: 0.0, z: 0.0},
    color: {r: 0.4, g: 0.3, b: 0.1},
  };
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = {
    scale: {x: 0.4, y: 0.03, z: 0.0},
    translate: {x: 0.0, y: 0.0, z: -0.25},
    color: {r: 0.5, g: 0.4, b: 0.2},
  };
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = {
    scale: {x: 0.8, y: 0.02, z: 0.0},
    translate: {x: 0.0, y: 0.0, z: -0.6},
    color: {r: 0.8, g: 0.8, b: 0.8},
  };
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = {
    scale: {x: 0.0, y: 0.0, z: 0.0},
    translate: {x: 0.0, y: 0.0, z: -0.65},
    color: {r: 1.0, g: 1.0, b: 1.0},
  };
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  return vertices;
}

function makeEagleWing() {
  return {
    upper: new Float32Array([
      0.0, 0.0, -0.14, 1.0, 0.4, 0.3, 0.1,
      0.0, 0.0, 0.0, 1.0, 0.5, 0.4, 0.2,
      0.0, 0.04, 0.0, 1.0, 0.5, 0.4, 0.2,
      0.0, 0.0, 0.0, 1.0, 0.5, 0.4, 0.2,
      0.0, 0.0, 0.14, 1.0, 0.5, 0.4, 0.2,
      0.0, 0.0, 0.0, 1.0, 0.5, 0.4, 0.2,
      0.0, -0.04, 0.0, 1.0, 0.5, 0.4, 0.2,

      0.0, 0.0, -0.14, 1.0, 0.4, 0.3, 0.1,
      0.25, 0.0, -0.17, 1.0, 0.4, 0.3, 0.1,
      0.0, 0.04, 0.0, 1.0, 0.5, 0.4, 0.2,
      0.25, 0.03, 0.0, 1.0, 0.5, 0.4, 0.2,
      0.0, 0.0, 0.17, 1.0, 0.5, 0.4, 0.2,
      0.25, 0.0, 0.17, 1.0, 0.5, 0.4, 0.2,
      0.0, -0.04, 0.0, 1.0, 0.5, 0.4, 0.2,
      0.25, -0.03, 0.0, 1.0, 0.5, 0.4, 0.2,
      0.25, 0.0, -0.17, 1.0, 0.4, 0.3, 0.1,
    ]),

    middle: new Float32Array([
      0.0, 0.0, -0.17, 1.0, 0.4, 0.3, 0.1,
      0.3, 0.0, -0.1, 1.0, 0.4, 0.3, 0.1,
      0.0, 0.03, 0.0, 1.0, 0.5, 0.4, 0.2,
      0.3, 0.02, 0.0, 1.0, 0.5, 0.4, 0.2,
      0.0, 0.0, 0.17, 1.0, 0.5, 0.4, 0.2,
      0.3, 0.0, 0.23, 1.0, 0.5, 0.4, 0.2,
      0.0, -0.03, 0.0, 1.0, 0.5, 0.4, 0.2,
      0.3, -0.02, 0.0, 1.0, 0.5, 0.4, 0.2,
      0.0, 0.0, -0.17, 1.0, 0.4, 0.3, 0.1,
      0.3, 0.0, -0.1, 1.0, 0.4, 0.3, 0.1,
    ]),
    lower: new Float32Array([
      0.0, 0.0, -0.1, 1.0, 0.4, 0.3, 0.1,
      0.4, 0.0, -0.11, 1.0, 0.4, 0.3, 0.1,
      0.0, 0.02, 0.0, 1.0, 0.5, 0.4, 0.2,
      0.4, 0.0, -0.11, 1.0, 0.4, 0.3, 0.1,
      0.0, 0.0, 0.23, 1.0, 0.5, 0.4, 0.2,
      0.4, 0.0, -0.11, 1.0, 0.4, 0.3, 0.1,
      0.0, -0.02, 0.0, 1.0, 0.5, 0.4, 0.2,
      0.4, 0.0, -0.11, 1.0, 0.4, 0.3, 0.1,
      0.0, 0.0, -0.1, 1.0, 0.4, 0.3, 0.1,
    ]),
  };
}