var UTILS = {
  makeTube: function(numCapVertices, data, offset, mod) {
    var i = offset;

    var vec4 = new Vector4();

    for (var v=0; v<numCapVertices*2; v++, i+=FLOATS_PER_VERTEX) {
      if (v%2 == 0) {
        
        vec4.set(
          Math.cos(Math.PI*(v)/numCapVertices),
          Math.sin(Math.PI*(v)/numCapVertices),
          0.0,
          1.0
        );

        var newVec4 = mod[0].transform.multiplyVector4(vec4);

        data[i] = newVec4.elements[0];
        data[i+1] = newVec4.elements[1];
        data[i+2] = newVec4.elements[2];
        data[i+3] = newVec4.elements[3];
        data[i+4] = mod[0].color.r;
        data[i+5] = mod[0].color.g;
        data[i+6] = mod[0].color.b;

      } else {
        
        vec4.set(
          Math.cos(Math.PI*(v-1)/numCapVertices),
          Math.sin(Math.PI*(v-1)/numCapVertices),
          1.0,
          1.0
        );

        var newVec4 = mod[1].transform.multiplyVector4(vec4);

        data[i] = newVec4.elements[0];
        data[i+1] = newVec4.elements[1];
        data[i+2] = newVec4.elements[2];
        data[i+3] = newVec4.elements[3];
        data[i+4] = mod[1].color.r;
        data[i+5] = mod[1].color.g;
        data[i+6] = mod[1].color.b;
      }
    }

    return i;
  },

  // returns mod object for use in makeTube
  makeModOptions: function(scaleX, scaleY, scaleZ, rotateAngle, rotateX, rotateY, rotateZ, transX, transY, transZ, r, g, b) {
    var mat = new Matrix4();

    mat.setTranslate(transX, transY, transZ);
    mat.rotate(rotateAngle, rotateX, rotateY, rotateZ);
    mat.scale(scaleX, scaleY, scaleZ);

    return {
      transform: mat,
      color: {r: r, g: g, b: b},
    };
  },

  makeSceneryTransform: function(scaleRange, rotateRange, transRangeX, transRangeY, transRangeZ) {
    var transform = new Matrix4();

    var scaleX = this.randomRange(scaleRange[0], scaleRange[1]),
        scaleY = this.randomRange(scaleRange[0], scaleRange[1]),
        scaleZ = this.randomRange(scaleRange[0], scaleRange[1]),

        angle = this.randomRange(rotateRange[0], rotateRange[1]),

        transX = this.randomRange(transRangeX[0], transRangeX[1]),
        transY = this.randomRange(transRangeY[0], transRangeY[1]),
        transZ = this.randomRange(transRangeZ[0], transRangeZ[1]);

    transform.translate(transX, transY, transZ);
    transform.rotate(angle, 0, 0, 1);
    transform.scale(scaleX, scaleY, scaleZ);

    return transform;
  },

  // returns random float within given range
  randomRange: function(low, high) {
    return Math.random() * (high - low) + low;
  },
};