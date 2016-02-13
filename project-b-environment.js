function Environment() {
  var groundVertices = makeGroundVertices(),
      mountainVertices = makeMountainVertices(),
      forestVertices = makeRandomForestVertices(),
      rockVertices = makeRandomRocksVertices();

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

  var numElements = 
    groundVertices.length
    + mountainVertices.length
    + forestVertices.length
    + rockVertices.length;

  var vertices = new Float32Array(numElements);

  vertices.set(groundVertices, 0);
  vertices.set(mountainVertices, mountain.startVertexOffset*FLOATS_PER_VERTEX);
  vertices.set(forestVertices, forest.startVertexOffset*FLOATS_PER_VERTEX);
  vertices.set(rockVertices, rock.startVertexOffset*FLOATS_PER_VERTEX);
  
  // save all properties
  this.numElements = numElements;
  this.startVertexOffset = 0;
  this.numVertices = numElements / FLOATS_PER_VERTEX;
  this.vertices = vertices;
  this.ground = ground;
  this.mountain = mountain;
  this.forest = forest;
  this.rock = rock;
}

function makeGroundVertices() {
  var xcount = 100;     // # of lines to draw in x,y to make the grid.
  var ycount = 100;   
  var xymax = 50.0;     // grid size; extends to cover +/-xymax in x and y.
  var xColr = new Float32Array([0.8, 0.4, 0.0]);  // reddish brown
  var yColr = new Float32Array([0.0, 0.4, 0.2]);  // softer brown

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
    
    for (var v=0; v<treeVertices.length; v+=FLOATS_PER_VERTEX) {
      var originalPos = new Vector4([treeVertices[v], treeVertices[v+1], treeVertices[v+2], treeVertices[v+3]]);
      var transformedPos = transform.multiplyVector4(originalPos);
      vertices[i+v] = transformedPos.elements[0];
      vertices[i+v+1] = transformedPos.elements[1];
      vertices[i+v+2] = transformedPos.elements[2];
      vertices[i+v+3] = transformedPos.elements[3];
      vertices[i+v+4] = treeVertices[v+4];
      vertices[i+v+5] = treeVertices[v+5];
      vertices[i+v+6] = treeVertices[v+6];
    }
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

  var modA = UTILS.makeModOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.25, 0.1, 0.0);
  var modB = UTILS.makeModOptions(radius.lowerTrunk, radius.lowerTrunk, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.25, 0.1, 0.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(radius.middleTrunk, radius.middleTrunk, 0.0, 10.0, 1.0, 1.0, -0.02, -0.01, 0.0, 0.15, 0.4, 0.2, 0.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(radius.upperTrunk, radius.upperTrunk, 0.0, 0.0, 0.0, 0.0, 1.0, 0.02, 0.0, 0.4, 0.45, 0.25, 0.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(radius.lowerLeavesBottom, radius.lowerLeavesBottom, 0.0, 2.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.27, 0.0, 0.6, 0.2);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(radius.lowerLeavesTop, radius.lowerLeavesTop, 0.0, 0.0, 0.0, 0.0, 1.0, 0.01, 0.0, 0.55, 0.0, 0.4, 0.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(radius.middleLeavesBottom, radius.middleLeavesBottom, 0.0, 22.5, 0.0, 0.0, 1.0, 0.01, 0.0, 0.5, 0.0, 0.6, 0.2);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(radius.middleLeavesTop, radius.middleLeavesTop, 0.0, 22.5, 0.0, 0.0, 1.0, 0.0, 0.0, 0.8, 0.0, 0.4, 0.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(radius.upperLeavesBottom, radius.upperLeavesBottom, 0.0, -1.0, 0.5, 1.0, 0.0, 0.0, 0.0, 0.7, 0.0, 0.6, 0.2);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.4, 0.0);
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

function makeMountainVertices() {
  var numCapVertices = 8;

  var vertices = new Float32Array((numCapVertices*24) * FLOATS_PER_VERTEX);
  var i = 0;

  var modA = UTILS.makeModOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.03, 0.02, 1.0, 1.0, 1.0, 1.0);
  var modB = UTILS.makeModOptions(0.05, 0.05, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.98, 1.0, 1.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(0.2, 0.2, 0.0, -5.0, 0.0, 1.0, 0.0, -0.01, -0.02, 0.75, 0.5, 0.5, 0.7);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(0.3, 0.3, 0.0, 0.0, 0.0, 0.0, 1.0, -0.02, -0.03, 0.55, 0.4, 0.4, 0.6);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(0.4, 0.4, 0.0, -10.0, 0.0, 1.0, 0.0, 0.02, 0.02, 0.3, 0.25, 0.25, 0.4);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(0.5, 0.5, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.2, 0.2, 0.3);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.2, 0.2, 0.3);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);


  // second mountain a little smaller
  modA = UTILS.makeModOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.5, 0.0, 0.0, 0.2, 0.2, 0.3);
  modB = UTILS.makeModOptions(0.4, 0.4, 0.0, 0.0, 0.0, 0.0, 1.0, 0.5, 0.0, 0.0, 0.2, 0.2, 0.3);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(0.35, 0.35, 0.0, 10.0, 1.0, 1.0, 0.0, 0.5, 0.0, 0.25, 0.25, 0.25, 0.4);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(0.2, 0.2, 0.0, 5.0, 0.0, 1.0, 0.0, 0.5, -0.03, 0.5, 0.4, 0.4, 0.6);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(0.15, 0.15, 0.0, -10.0, -1.0, 1.0, 0.0, 0.5, -0.02, 0.65, 0.5, 0.5, 0.7);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(0.05, 0.05, 0.0, 0.0, 0.0, 0.0, 1.0, 0.5, 0.0, 0.8, 1.0, 1.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.5, 0.02, 0.85, 1.0, 1.0, 1.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  return vertices;
}

function makeRandomRocksVertices() {
  var numRocks = 100;
  var rockVertices = makeRockVertices();
  var vertices = new Float32Array(rockVertices.length * numRocks);

  for (var t=0, i=0; t<numRocks; t++, i+=rockVertices.length) {
    var transform = UTILS.makeSceneryTransform(
      [0.1, 0.2],
      [0, 360],
      [-5, 5], [-5, 5], [0, 0]);
    
    for (var v=0; v<rockVertices.length; v+=FLOATS_PER_VERTEX) {
      var originalPos = new Vector4([rockVertices[v], rockVertices[v+1], rockVertices[v+2], rockVertices[v+3]]);
      var transformedPos = transform.multiplyVector4(originalPos);
      vertices[i+v] = transformedPos.elements[0];
      vertices[i+v+1] = transformedPos.elements[1];
      vertices[i+v+2] = transformedPos.elements[2];
      vertices[i+v+3] = transformedPos.elements[3];
      vertices[i+v+4] = rockVertices[v+4];
      vertices[i+v+5] = rockVertices[v+5];
      vertices[i+v+6] = rockVertices[v+6];
    }
  }

  return vertices;
}

function makeRockVertices() {
  var numCapVertices = 8;

  var vertices = new Float32Array((numCapVertices*10) * FLOATS_PER_VERTEX);
  var i = 0;

  var modA = UTILS.makeModOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.2, 0.2, 0.2);
  var modB = UTILS.makeModOptions(0.9, 0.7, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.2, 0.2, 0.2);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(1.0, 0.8, 0.0, 5.0, 0.0, 1.0, 0.0, 0.05, 0.0, 0.25, 0.3, 0.3, 0.3);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(0.8, 0.7, 0.0, 10.0, 0.0, 0.0, 1.0, 0.1, 0.05, 0.6, 0.25, 0.3, 0.15);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(0.4, 0.5, 0.0, 10.0, 1.0, 1.0, 0.0, 0.25, 0.0, 0.85, 0.2, 0.3, 0.1);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.4, 0.0, 1.0, 0.2, 0.4, 0.1);
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