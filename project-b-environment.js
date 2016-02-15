function Environment() {
  var groundVertices = makeGroundVertices(),
      mountainVertices = makeMountainVertices(),
      forestVertices = makeRandomForestVertices(),
      rockVertices = makeRandomRocksVertices(),
      foxVertices = makeRandomFoxesVertices();

  var ground = {
    startVertexOffset: 0,
    numVertices: groundVertices.length / FLOATS_PER_VERTEX,
  };

  var mountain = {
    startVertexOffset: ground.startVertexOffset + ground.numVertices,
    numVertices: mountainVertices.length / FLOATS_PER_VERTEX,
  };

  var forest = {
    startVertexOffset: mountain.startVertexOffset + mountain.numVertices,
    numVertices: forestVertices.length / FLOATS_PER_VERTEX,
  };

  var rock = {
    startVertexOffset: forest.startVertexOffset + forest.numVertices,
    numVertices: rockVertices.length / FLOATS_PER_VERTEX,
  };

  var fox = {
    startVertexOffset: rock.startVertexOffset + rock.numVertices,
    numVertices: foxVertices.length / FLOATS_PER_VERTEX,
  };

  var numElements = 
    groundVertices.length
    + mountainVertices.length
    + forestVertices.length
    + rockVertices.length
    + foxVertices.length;

  var vertices = new Float32Array(numElements);

  vertices.set(groundVertices, 0);
  vertices.set(mountainVertices, mountain.startVertexOffset*FLOATS_PER_VERTEX);
  vertices.set(forestVertices, forest.startVertexOffset*FLOATS_PER_VERTEX);
  vertices.set(rockVertices, rock.startVertexOffset*FLOATS_PER_VERTEX);
  vertices.set(foxVertices, fox.startVertexOffset*FLOATS_PER_VERTEX);
  
  // save all properties
  this.numElements = numElements;
  this.startVertexOffset = 0;
  this.numVertices = numElements / FLOATS_PER_VERTEX;
  this.vertices = vertices;
  this.ground = ground;
  this.mountain = mountain;
  this.forest = forest;
  this.rock = rock;
  this.fox = fox;
}

function makeGroundVertices() {
  var xcount = 100;     // # of lines to draw in x,y to make the grid.
  var ycount = 100;   
  var xymax = 50.0;     // grid size; extends to cover +/-xymax in x and y.
  var xColr = new Float32Array([0.8, 0.4, 0.0, 1.0]);  // reddish brown
  var yColr = new Float32Array([0.0, 0.4, 0.2, 1.0]);  // softer brown

  var vertices = new Float32Array(FLOATS_PER_VERTEX*2*(xcount+ycount));
  var xgap = xymax/(xcount-1);    // HALF-spacing between lines in x,y;
  var ygap = xymax/(ycount-1);    // (why half? because v==(0line number/2))
  
  // First, step thru x values as we make vertical lines of constant-x:
  var v, j;
  for(v=0, j=0; v<2*xcount; v++, j+= FLOATS_PER_VERTEX) {
    if(v%2==0) {  // put even-numbered vertices at (xnow, -xymax, 0)
      vertices[j  ] = -xymax + (v  )*xgap;  // x
      vertices[j+1] = -xymax;               // y
      vertices[j+2] = 0.0;                  // z
    }
    else {        // put odd-numbered vertices at (xnow, +xymax, 0).
      vertices[j  ] = -xymax + (v-1)*xgap;  // x
      vertices[j+1] = xymax;                // y
      vertices[j+2] = 0.0;                  // z
    }
    vertices[j+3] = 1.0           // w
    vertices[j+4] = xColr[0];     // red
    vertices[j+5] = xColr[1];     // grn
    vertices[j+6] = xColr[2];     // blu
    vertices[j+7] = xColr[3];     // alpha
    vertices[j+8] = 0.0;          // normal x
    vertices[j+9] = 0.0;          // normal y
    vertices[j+10] = 1.0;         // normal z
    vertices[j+11] = 0.0;         // normal w
  }
  // Second, step thru y values as wqe make horizontal lines of constant-y:
  // (don't re-initialize j--we're adding more vertices to the array)
  for(v=0; v<2*ycount; v++, j+= FLOATS_PER_VERTEX) {
    if(v%2==0) {    // put even-numbered vertices at (-xymax, ynow, 0)
      vertices[j  ] = -xymax;               // x
      vertices[j+1] = -xymax + (v  )*ygap;  // y
      vertices[j+2] = 0.0;                  // z
    }
    else {          // put odd-numbered vertices at (+xymax, ynow, 0).
      vertices[j  ] = xymax;                // x
      vertices[j+1] = -xymax + (v-1)*ygap;  // y
      vertices[j+2] = 0.0;                  // z
    }
    vertices[j+3] = 1.0           // w
    vertices[j+4] = yColr[0];     // red
    vertices[j+5] = yColr[1];     // grn
    vertices[j+6] = yColr[2];     // blu
    vertices[j+7] = yColr[3];     // alpha
    vertices[j+8] = 0.0;          // normal x
    vertices[j+9] = 0.0;          // normal y
    vertices[j+10] = 1.0;         // normal z
    vertices[j+11] = 0.0;         // normal w
  }

  return vertices;
}

function makeRandomForestVertices() {
  var numTrees = 100;
  var treeVertices = makeTreeVertices();
  var vertices = new Float32Array(treeVertices.length * numTrees);
  
  for (var t=0, i=0; t<numTrees; t++, i+=treeVertices.length) {
    var transform = UTILS.makeSceneryTransform(
      [0.9, 1.1],
      [0, 360],
      [-5, 5], [-5, 5], [0, 0]);
    
    var result = UTILS.transformVertices(transform, treeVertices);
    vertices.set(result, i);
  }

  return vertices;
}

function makeTreeVertices() {
  var numCapVertices = 8;
  var radius = {
    lowerTrunk: 0.07,
    middleTrunk: 0.05,
    upperTrunk: 0.05,
    lowerLeavesBottom: 0.25,
    lowerLeavesTop: 0.15,
    middleLeavesBottom: 0.2,
    middleLeavesTop: 0.08,
    upperLeavesBottom: 0.15,
  };

  var vertices = new Float32Array((numCapVertices*18) * FLOATS_PER_VERTEX);
  var i = 0;

  var modA = UTILS.makeModOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.25, 0.1, 0.0, 1.0);
  var modB = UTILS.makeModOptions(radius.lowerTrunk, radius.lowerTrunk, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.25, 0.1, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(radius.middleTrunk, radius.middleTrunk, 0.0, 10.0, 1.0, 1.0, -0.02, -0.01, 0.0, 0.15, 0.4, 0.2, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(radius.upperTrunk, radius.upperTrunk, 0.0, 0.0, 0.0, 0.0, 1.0, 0.02, 0.0, 0.4, 0.45, 0.25, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(radius.lowerLeavesBottom, radius.lowerLeavesBottom, 0.0, 2.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.27, 0.0, 0.6, 0.2, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(radius.lowerLeavesTop, radius.lowerLeavesTop, 0.0, 0.0, 0.0, 0.0, 1.0, 0.01, 0.0, 0.55, 0.0, 0.4, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(radius.middleLeavesBottom, radius.middleLeavesBottom, 0.0, 0.0, 0.0, 0.0, 1.0, 0.01, 0.0, 0.5, 0.0, 0.6, 0.2, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(radius.middleLeavesTop, radius.middleLeavesTop, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.8, 0.0, 0.4, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(radius.upperLeavesBottom, radius.upperLeavesBottom, 0.0, -1.0, 0.5, 1.0, 0.0, 0.0, 0.0, 0.7, 0.0, 0.6, 0.2, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.4, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);


  // adjust vertices for smooth concatenation of multiple copies
  var adjVertices = new Float32Array(vertices.length + 4*FLOATS_PER_VERTEX);
  
  // prepend with copy of first vertex
  for (var j=0; j<FLOATS_PER_VERTEX; j++) {
    adjVertices[j] = vertices[j];
  }
  adjVertices.set(vertices, j);

  // repeat the last vertex
  for (var j=0, i=vertices.length+FLOATS_PER_VERTEX; j<FLOATS_PER_VERTEX; j++, i++) {
    adjVertices[i] = vertices[i-FLOATS_PER_VERTEX];
  }

  // then repeat first vertex twice so copies will link on ground plane (just to be safe)
  for (var j=0; j<FLOATS_PER_VERTEX*2; j++, i++) {
    adjVertices[i] = vertices[j%FLOATS_PER_VERTEX];
  }

  return adjVertices;
}

function makeMountainVertices() {
  var numCapVertices = 8;

  var vertices = new Float32Array((numCapVertices*24) * FLOATS_PER_VERTEX);
  var i = 0;

  var modA = UTILS.makeModOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.03, 0.02, 1.0, 1.0, 1.0, 1.0, 1.0);
  var modB = UTILS.makeModOptions(0.05, 0.05, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.98, 1.0, 1.0, 1.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(0.2, 0.2, 0.0, -5.0, 0.0, 1.0, 0.0, -0.01, -0.02, 0.75, 0.5, 0.5, 0.7, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(0.3, 0.3, 0.0, 0.0, 0.0, 0.0, 1.0, -0.02, -0.03, 0.55, 0.4, 0.4, 0.6, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(0.4, 0.4, 0.0, -10.0, 0.0, 1.0, 0.0, 0.02, 0.02, 0.3, 0.25, 0.25, 0.4, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(0.5, 0.5, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.2, 0.2, 0.3, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.2, 0.2, 0.3, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);


  // second mountain a little smaller
  modA = UTILS.makeModOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.5, 0.0, 0.0, 0.2, 0.2, 0.3, 1.0);
  modB = UTILS.makeModOptions(0.4, 0.4, 0.0, 0.0, 0.0, 0.0, 1.0, 0.5, 0.0, 0.0, 0.2, 0.2, 0.3, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(0.35, 0.35, 0.0, 10.0, 1.0, 1.0, 0.0, 0.5, 0.0, 0.25, 0.25, 0.25, 0.4, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(0.2, 0.2, 0.0, 5.0, 0.0, 1.0, 0.0, 0.5, -0.03, 0.5, 0.4, 0.4, 0.6, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(0.15, 0.15, 0.0, -10.0, -1.0, 1.0, 0.0, 0.5, -0.02, 0.65, 0.5, 0.5, 0.7, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(0.05, 0.05, 0.0, 0.0, 0.0, 0.0, 1.0, 0.5, 0.0, 0.8, 1.0, 1.0, 1.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.5, 0.02, 0.85, 1.0, 1.0, 1.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  return vertices;
}

function makeRandomRocksVertices() {
  var numRocks = 0;
  var rockVertices = makeRockVertices();
  var vertices = new Float32Array(rockVertices.length * numRocks);

  for (var t=0, i=0; t<numRocks; t++, i+=rockVertices.length) {
    var transform = UTILS.makeSceneryTransform(
      [0.1, 0.2],
      [0, 360],
      [-5, 5], [-5, 5], [0, 0]);
    
    var result = UTILS.transformVertices(transform, rockVertices);
    vertices.set(result, i);
  }

  return vertices;
}

function makeRockVertices() {
  var numCapVertices = 8;

  var vertices = new Float32Array((numCapVertices*10) * FLOATS_PER_VERTEX);
  var i = 0;

  var modA = UTILS.makeModOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.2, 0.2, 0.2, 1.0);
  var modB = UTILS.makeModOptions(0.9, 0.7, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.2, 0.2, 0.2, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(1.0, 0.8, 0.0, 5.0, 0.0, 1.0, 0.0, 0.05, 0.0, 0.25, 0.3, 0.3, 0.3, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(0.8, 0.7, 0.0, 10.0, 0.0, 0.0, 1.0, 0.1, 0.05, 0.6, 0.25, 0.3, 0.15, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(0.4, 0.5, 0.0, 10.0, 1.0, 1.0, 0.0, 0.25, 0.0, 0.85, 0.2, 0.3, 0.1, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.4, 0.0, 1.0, 0.2, 0.4, 0.1, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  // adjust vertices for smooth concatenation of multiple copies
  var adjVertices = new Float32Array(vertices.length + 4*FLOATS_PER_VERTEX);
  
  // prepend with copy of first vertex
  for (var j=0; j<FLOATS_PER_VERTEX; j++) {
    adjVertices[j] = vertices[j];
  }
  adjVertices.set(vertices, j);

  // repeat the last vertex
  for (var j=0, i=vertices.length+FLOATS_PER_VERTEX; j<FLOATS_PER_VERTEX; j++, i++) {
    adjVertices[i] = vertices[i-FLOATS_PER_VERTEX];
  }

  // then repeat first vertex twice
  for (var j=0; j<FLOATS_PER_VERTEX*2; j++, i++) {
    adjVertices[i] = vertices[j%FLOATS_PER_VERTEX];
  }

  return adjVertices;
}



function makeRandomFoxesVertices() {
  var numFoxes = 3;
  var foxVertices = makeStaticFoxVertices();
  var vertices = new Float32Array(foxVertices.length * numFoxes);

  for (var t=0, i=0; t<numFoxes; t++, i+=foxVertices.length) {
    var transform = UTILS.makeSceneryTransform(
      [0.9, 1.1],
      [0, 360],
      [-5, 5], [-1, 1], [0, 0]);

    var result = UTILS.transformVertices(transform, foxVertices);
    vertices.set(result, i);
  }

  return vertices;
}

function makeStaticFoxVertices() {
  var bodyVertices = makeStaticFoxBody(),
      earVertices = makeStaticFoxEar(),
      tailVertices = makeStaticFoxTail(),
      legVertices = makeStaticFoxLeg();

  var numElements = 
    bodyVertices.length
    + earVertices.length * 2
    + legVertices.length * 4
    + tailVertices.length;

  var adjVertices = new Float32Array(numElements);
  var i = 0;

  var transform = {
    posTransform: new Matrix4(),
    normTransform: new Matrix4(),
  };

  var posTransform = transform.posTransform,
      normTransform = transform.normTransform;

  // transform then add body
  adjVertices.set(bodyVertices, i);
  i += bodyVertices.length;

  // ears
  posTransform.setTranslate(0.08, 0.25, 0.7);
  posTransform.rotate(-40.0, 0, 0, 1);
  posTransform.rotate(20.0, 1, 0, 0);
  posTransform.scale(0.15, 0.3, 0.3);
  normTransform.setScale(0.15, 0.3, 0.3);
  normTransform.rotate(20.0, 1, 0, 0);
  normTransform.rotate(-40.0, 0, 0, 1);
  normTransform.translate(0.08, 0.25, 0.7);
  normTransform.invert();
  normTransform.transpose();
  adjVertices.set(UTILS.transformVertices(transform, earVertices), i);
  i += earVertices.length;

  posTransform.setScale(-1, 1, 1);
  posTransform.translate(0.08, 0.25, 0.7);
  posTransform.rotate(-40.0, 0, 0, 1);
  posTransform.rotate(20.0, 1, 0, 0);
  posTransform.scale(0.15, 0.3, 0.3);
  normTransform.setScale(0.15, 0.3, 0.3);
  normTransform.rotate(20.0, 1, 0, 0);
  normTransform.rotate(-40.0, 0, 0, 1);
  normTransform.translate(0.08, 0.25, 0.7);
  normTransform.scale(-1, 1, 1);
  normTransform.invert();
  normTransform.transpose();
  adjVertices.set(UTILS.transformVertices(transform, earVertices), i);
  i += earVertices.length;

  // legs
  posTransform.setTranslate(0.15, 0.0, 0.25);
  posTransform.rotate(90.0, 1, 0, 0);
  posTransform.rotate(-90.0, 0, 0, 1);
  posTransform.scale(0.7, 0.7, 0.7);
  normTransform.setInverseOf(posTransform);
  normTransform.transpose();
  adjVertices.set(UTILS.transformVertices(transform, legVertices), i);
  i += legVertices.length;

  posTransform.setTranslate(-0.15, 0.0, 0.25);
  posTransform.rotate(90.0, 1, 0, 0);
  posTransform.rotate(-90.0, 0, 0, 1);
  posTransform.rotate(5.0, 0, 1, 0);
  posTransform.scale(0.7, 0.7, 0.7);
  normTransform.setInverseOf(posTransform);
  normTransform.transpose();
  adjVertices.set(UTILS.transformVertices(transform, legVertices), i);
  i += legVertices.length;

  posTransform.setTranslate(0.1, 0.0, -0.35);
  posTransform.rotate(90.0, 1, 0, 0);
  posTransform.rotate(-90.0, 0, 0, 1);
  posTransform.rotate(5.0, 0, 1, 0);
  posTransform.scale(0.7, 0.7, 0.7);
  normTransform.setInverseOf(posTransform);
  normTransform.transpose();
  adjVertices.set(UTILS.transformVertices(transform, legVertices), i);
  i += legVertices.length;

  posTransform.setTranslate(-0.1, 0.0, -0.35);
  posTransform.rotate(90.0, 1, 0, 0);
  posTransform.rotate(-90.0, 0, 0, 1);
  posTransform.rotate(10.0, 0, 1, 0);
  posTransform.scale(0.7, 0.7, 0.7);
  normTransform.setInverseOf(posTransform);
  normTransform.transpose();
  adjVertices.set(UTILS.transformVertices(transform, legVertices), i);
  i += legVertices.length;

  // transform then add the tail
  posTransform.setTranslate(0, 0.05, -0.5);
  posTransform.rotate(-15.0, 1, 0, 0);
  normTransform.setInverseOf(posTransform);
  normTransform.transpose();
  adjVertices.set(UTILS.transformVertices(transform, tailVertices), i);
  i += tailVertices.length;
  
  // final transformation on whole fox
  posTransform.setTranslate(0.0, 0.0, 0.2);
  posTransform.rotate(90.0, 1, 0, 0);
  posTransform.scale(0.3, 0.3, 0.3);
  normTransform.setInverseOf(posTransform);
  normTransform.transpose();
  return UTILS.transformVertices(transform, adjVertices);
}

function makeStaticFoxBody() {
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

  // make the body
  var vertices = new Float32Array((numCapVertices*18) * FLOATS_PER_VERTEX);
  var i = 0;

  var modA = UTILS.makeModOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.1, 1.0, 0.0, 0.0, 0.0, 1.0);
  var modB = UTILS.makeModOptions(radius.nose, radius.nose, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.08, 0.93, 0.8, 0.3, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(radius.midSnout, radius.midSnout, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.1, 0.85, 0.8, 0.3, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(0.8*radius.snoutHead, radius.snoutHead, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.15, 0.78, 0.8, 0.3, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(radius.midHead, radius.midHead, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.18, 0.7, 0.8, 0.3, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(0.8*radius.headNeck, radius.headNeck, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.2, 0.55, 0.75, 0.25, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(0.8*radius.neckBody, radius.neckBody, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.05, 0.3, 0.8, 0.3, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(0.8*radius.midBody, radius.midBody, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.8, 0.3, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(radius.lowerBody, radius.lowerBody, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, -0.5, 0.75, 0.25, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);
  
  modB = UTILS.makeModOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.1, -0.6, 0.65, 0.15, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  // now do color correction
  var i = (12 + 2*numCapVertices) * FLOATS_PER_VERTEX;
  for ( ; i<vertices.length; i+=2*FLOATS_PER_VERTEX*numCapVertices) {
    vertices[i+4] = 1.0;
    vertices[i+5] = 1.0;
    vertices[i+6] = 1.0;
    vertices[i+7] = 1.0;
    if (i + 2*FLOATS_PER_VERTEX*numCapVertices >= vertices.length) {
      break;
    } else {
      vertices[i+FLOATS_PER_VERTEX+4] = 1.0;
      vertices[i+FLOATS_PER_VERTEX+5] = 1.0;
      vertices[i+FLOATS_PER_VERTEX+6] = 1.0;
      vertices[i+FLOATS_PER_VERTEX+7] = 1.0;
    }
  }

  var adjVertices = new Float32Array(vertices.length + 2*FLOATS_PER_VERTEX);

  // prepend with copy of first vertex
  for (var j=0; j<FLOATS_PER_VERTEX; j++) {
    adjVertices[j] = vertices[j];
  }
  adjVertices.set(vertices, j);

  // append with copy of last vertex
  for (var j=0, i=vertices.length+FLOATS_PER_VERTEX; j<FLOATS_PER_VERTEX; j++, i++) {
    adjVertices[i] = vertices[i-FLOATS_PER_VERTEX];
  }

  return adjVertices;
}

function makeStaticFoxEar() {
  var vertices = new Float32Array([
    0.5, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0,     1.0, 1.0, 1.0, 0.0,
    0.0, 0.0, -0.3, 1.0, 0.8, 0.3, 0.0, 1.0,    1.0, 1.0, 1.0, 0.0,
    -0.5, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0,    1.0, 1.0, 1.0, 0.0,
    0.0, 0.5, 0.0, 1.0, 0.8, 0.3, 0.0, 1.0,     1.0, 1.0, 1.0, 0.0,
    0.5, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0,     1.0, 1.0, 1.0, 0.0,
    0.0, 0.0, -0.3, 1.0, 0.8, 0.3, 0.0, 1.0,    1.0, 1.0, 1.0, 0.0,
  ]);


  var adjVertices = new Float32Array(vertices.length + 2*FLOATS_PER_VERTEX);

  // prepend with copy of first vertex
  for (var j=0; j<FLOATS_PER_VERTEX; j++) {
    adjVertices[j] = vertices[j];
  }
  adjVertices.set(vertices, j);

  // append with copy of last vertex
  for (var j=0, i=vertices.length+FLOATS_PER_VERTEX; j<FLOATS_PER_VERTEX; j++, i++) {
    adjVertices[i] = vertices[i-FLOATS_PER_VERTEX];
  }

  return adjVertices;
}

function makeStaticFoxTail() {
  var numCapVertices = 8;
  var radius = {
    upperTail: 0.08,
    midTail: 0.15,
    lowerTail: 0.1,
  };

  var vertices = new Float32Array((numCapVertices*8) * FLOATS_PER_VERTEX);
  var i = 0;

  // make the tail
  var modA = UTILS.makeModOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, 0.0, 0.7, 0.2, 0.0, 1.0);
  var modB = UTILS.makeModOptions(radius.upperTail, radius.upperTail, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, -0.1, 0.7, 0.2, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(radius.midTail, radius.midTail, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, -0.5, 0.8, 0.3, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(radius.lowerTail, radius.lowerTail, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, -0.8, 1.0, 1.0, 1.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, -1.0, 1.0, 1.0, 1.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);


  var adjVertices = new Float32Array(vertices.length + 2*FLOATS_PER_VERTEX);

  // prepend with copy of first vertex
  for (var j=0; j<FLOATS_PER_VERTEX; j++) {
    adjVertices[j] = vertices[j];
  }
  adjVertices.set(vertices, j);

  // append with copy of last vertex
  for (var j=0, i=vertices.length+FLOATS_PER_VERTEX; j<FLOATS_PER_VERTEX; j++, i++) {
    adjVertices[i] = vertices[i-FLOATS_PER_VERTEX];
  }

  return adjVertices;
}

function makeStaticFoxLeg() {
  var numCapVertices = 8;
  var radius = {
    shoulder: 0.2,
    knee: 0.07,
    ankle: 0.05,
    anklePaw: 0.1,
    paw: 0.1,
  };

  // make the upper leg
  var vertices = new Float32Array((numCapVertices*12) * FLOATS_PER_VERTEX);
  var i = 0;

  var modA = UTILS.makeModOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, -0.15, 0.8, 0.3, 0.0, 1.0);
  var modB = UTILS.makeModOptions(radius.shoulder, 0.7*radius.shoulder, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, 0.0, 0.78, 0.28, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(radius.knee, 0.7*radius.knee, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.5, 0.7, 0.2, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(radius.ankle, radius.ankle, 0.0, 0.0, 0.0, 0.0, 1.0, -0.1, 0.0, 0.9, 0.3, 0.1, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(radius.anklePaw, 0.7*radius.anklePaw, 0.0, 0.0, 0.0, 0.0, 1.0, -0.15, 0.0, 0.95, 0.3, 0.1, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(radius.paw, 0.7*radius.paw, 0.0, 0.0, 0.0, 0.0, 1.0, -0.15, 0.0, 1.0, 0.3, 0.1, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, -0.1, 0.0, 1.0, 0.4, 0.15, 0.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);


  var adjVertices = new Float32Array(vertices.length + 2*FLOATS_PER_VERTEX);

  // prepend with copy of first vertex
  for (var j=0; j<FLOATS_PER_VERTEX; j++) {
    adjVertices[j] = vertices[j];
  }
  adjVertices.set(vertices, j);

  // append with copy of last vertex
  for (var j=0, i=vertices.length+FLOATS_PER_VERTEX; j<FLOATS_PER_VERTEX; j++, i++) {
    adjVertices[i] = vertices[i-FLOATS_PER_VERTEX];
  }

  return adjVertices;
}