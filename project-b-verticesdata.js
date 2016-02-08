function VerticesData() {
  var environment = new Environment(),
      eagle = new Eagle(),
      fox = new Fox();

  var numElements = environment.numElements + eagle.numElements + fox.numElements;
  var vertices = new Float32Array(numElements);

  // copy vertices and remove unnecessary older copy
  vertices.set(environment.vertices, 0);
  vertices.set(eagle.vertices, environment.numElements);
  vertices.set(fox.vertices, environment.numElements+eagle.numElements);
  
  delete environment.vertices;
  delete eagle.vertices;
  delete fox.vertices;

  // adjust start vertices
  var startVertex = environment.numElements / FLOATS_PER_VERTEX;
  eagle.adjustStartVertices(startVertex);

  startVertex += eagle.numElements / FLOATS_PER_VERTEX;
  fox.adjustStartVertices(startVertex);

  // save properties
  this.environment = environment;
  this.eagle = eagle;
  this.fox = fox;
  this.numElements = numElements;
  this.vertices = vertices;
}
