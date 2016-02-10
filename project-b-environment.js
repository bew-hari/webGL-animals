function Environment() {
  var groundVertices = makeGroundVertices(),
      mountainVertices = makeMountainVertices(),
      treeVertices = makeTreeVertices();

  var ground = {
    startVertexOffset: 0,
    numVertices: groundVertices.length / FLOATS_PER_VERTEX,
  };

  var mountain = {
    startVertexOffset: ground.startVertexOffset + ground.numVertices,
    numVertices: mountainVertices.length / FLOATS_PER_VERTEX,
  };

  var tree = {
    startVertexOffset: mountain.startVertexOffset + mountain.numVertices,
    numVertices: treeVertices.length / FLOATS_PER_VERTEX,
  };

  var numElements = groundVertices.length + mountainVertices.length + treeVertices.length;
  var vertices = new Float32Array(numElements);

  vertices.set(groundVertices, 0);
  vertices.set(mountainVertices, mountain.startVertexOffset*FLOATS_PER_VERTEX);
  vertices.set(treeVertices, tree.startVertexOffset*FLOATS_PER_VERTEX);
  
  // save all properties
  this.numElements = numElements;
  this.startVertexOffset = 0;
  this.numVertices = numElements / FLOATS_PER_VERTEX;
  this.vertices = vertices;
  this.ground = ground;
  this.mountain = mountain;
  this.tree = tree;
}

function makeGroundVertices() {
  var xcount = 100;     // # of lines to draw in x,y to make the grid.
  var ycount = 100;   
  var xymax = 50.0;     // grid size; extends to cover +/-xymax in x and y.
  var xColr = new Float32Array([1.0, 1.0, 0.3]);  // bright yellow
  var yColr = new Float32Array([0.5, 1.0, 0.5]);  // bright green.

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

  modA = UTILS.makeModOptions(radius.middleLeavesBottom, radius.middleLeavesBottom, 0.0, 1.0, 0.0, 1.0, 0.0, 0.01, 0.0, 0.5, 0.0, 0.6, 0.2);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(radius.middleLeavesTop, radius.middleLeavesTop, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.8, 0.0, 0.4, 0.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  modA = UTILS.makeModOptions(radius.upperLeavesBottom, radius.upperLeavesBottom, 0.0, -1.0, 0.5, 1.0, 0.0, 0.0, 0.0, 0.7, 0.0, 0.6, 0.2);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modB, modA]);

  modB = UTILS.makeModOptions(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.4, 0.0);
  i = UTILS.makeTube(numCapVertices, vertices, i, [modA, modB]);

  return vertices;
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