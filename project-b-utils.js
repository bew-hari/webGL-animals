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

  makeModOptions: function(scaleX, scaleY, scaleZ, transX, transY, transZ, r, g, b) {
    var mat = new Matrix4();

    mat.setTranslate(transX, transY, transZ);
    mat.scale(scaleX, scaleY, scaleZ);

    return {
      transform: mat,
      color: {r: r, g: g, b: b},
    };
  },
};