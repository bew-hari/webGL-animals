function VerticesData() {
  var environment = new Environment(),
      eagle = new Eagle(),
      fox = new Fox();

  var numElements = environment.numElements + eagle.numElements + fox.numElements;
  var vertices = new Float32Array(numElements);

  eagle.startVertexOffset = environment.numVertices;
  fox.startVertexOffset = eagle.startVertexOffset + eagle.numVertices;

  // copy vertices and remove unnecessary older copy
  vertices.set(environment.vertices, environment.startVertexOffset);
  vertices.set(eagle.vertices, eagle.startVertexOffset * FLOATS_PER_VERTEX);
  vertices.set(fox.vertices, fox.startVertexOffset * FLOATS_PER_VERTEX);
  
  delete environment.vertices;
  delete eagle.vertices;
  delete fox.vertices;

  // save properties
  this.environment = environment;
  this.eagle = eagle;
  this.fox = fox;
  this.numElements = numElements;
  this.vertices = vertices;
}
