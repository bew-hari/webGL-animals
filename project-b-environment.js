function Environment() {
  var groundVertices = makeGroundVertices();

  var ground = {
    startVertex: 0,
    numVertices: groundVertices.length / FLOATS_PER_VERTEX,
  }

  var numElements = groundVertices.length;
  var vertices = new Float32Array(numElements);

  vertices.set(groundVertices, 0);
  
  // save all properties
  this.numElements = numElements;
  this.startVertexOffset = 0;
  this.numVertices = numElements / FLOATS_PER_VERTEX;
  this.vertices = vertices;
  this.ground = ground;
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
    lowerTrunk: 0.25,
    middleTrunk: 0.2,
    upperTrunk: 0.2,
    lowerLeavesBottom: 0.8,
    lowerLeavesTop: 0.4,
    middleLeavesBottom: 0.6,
    middleLeavesTop: 0.2,
    upperLeavesBottom: 0.4,
    upperLeavesTop: 0.0,
  };

  var vertices = new Float32Array((numCapVertices*18) * FLOATS_PER_VERTEX);
  var i = 0;
}