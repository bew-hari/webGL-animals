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

  // add a color randomizer
  this.eagle.colorMultiplier = 1.0;
  this.eagle.colorChannelModified = 0;
  this.fox.colorMultiplier = 1.0;
  this.fox.colorChannelModified = 0;
  this.randomizeColor = function() {
    // modify eagle color
    var start = 0,
        end = start + this.eagle.numElements;

    // randomly generate multiplier and select color channel
    var multiplier = (Math.random() + 1),
        channel = Math.round(Math.random()*2) + 4;

    for (var i=start; i<end; i+=FLOATS_PER_VERTEX) {
      // correct previously modified channel
      this.vertices[i+this.eagle.colorChannelModified] /= this.eagle.colorMultiplier;
      this.vertices[i+channel] *= multiplier;
    }

    // save for corrections in subsequent calls
    this.eagle.colorMultiplier = multiplier;
    this.eagle.colorChannelModified = channel;

    // modify fox color
    start = this.eagle.numElements;
    end = start + this.fox.numElements;

    // randomly generate multiplier and select color channel
    multiplier = Math.random()*2 + 0.01;
    channel = Math.round(Math.random()*2) + 4;

    for (var i=start; i<end; i+=FLOATS_PER_VERTEX) {
      // correct previously modified channel
      this.vertices[i+this.fox.colorChannelModified] /= this.fox.colorMultiplier;
      this.vertices[i+channel] *= multiplier;
    }

    // save for corrections in subsequent calls
    this.fox.colorMultiplier = multiplier;
    this.fox.colorChannelModified = channel;
  };

  this.resetColor = function() {
    // reset eagle color
    var start = 0,
        end = start + this.eagle.numElements;

    for (var i=start; i<end; i+=FLOATS_PER_VERTEX) {
      this.vertices[i+this.eagle.colorChannelModified] /= this.eagle.colorMultiplier;
    }

    // reset fox color
    start = this.eagle.numElements;
    end = start + this.fox.numElements;

    for (var i=start; i<end; i+=FLOATS_PER_VERTEX) {
      this.vertices[i+this.fox.colorChannelModified] /= this.fox.colorMultiplier;
    }
  };
}
