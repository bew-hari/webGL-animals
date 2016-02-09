var UTILS = {
  makeTube: function(numCapVertices, data, offset, mod) {
  var i = offset;

  var mat = new Matrix4();
  var vec4 = new Vector4();

  for (var v=0; v<numCapVertices*2; v++, i+=FLOATS_PER_VERTEX) {
    if (v%2 == 0) {
      
      mat.setTranslate(mod[0].translate.x, mod[0].translate.y, mod[0].translate.z);
      mat.scale(mod[0].scale.x, mod[0].scale.y, mod[0].scale.z);

      vec4.set(
        Math.cos(Math.PI*(v)/numCapVertices),
        Math.sin(Math.PI*(v)/numCapVertices),
        0.0,
        1.0
      );

      var newVec4 = mat.multiplyVector4(vec4);

      data[i] = newVec4.elements[0];
      data[i+1] = newVec4.elements[1];
      data[i+2] = newVec4.elements[2];
      data[i+3] = newVec4.elements[3];
      data[i+4] = mod[0].color.r;
      data[i+5] = mod[0].color.g;
      data[i+6] = mod[0].color.b;
      
    } else {
      mat.setTranslate(mod[1].translate.x, mod[1].translate.y, mod[1].translate.z);
      mat.scale(mod[1].scale.x, mod[1].scale.y, mod[1].scale.z);

      vec4.set(
        Math.cos(Math.PI*(v-1)/numCapVertices),
        Math.sin(Math.PI*(v-1)/numCapVertices),
        1.0,
        1.0
      );

      var newVec4 = mat.multiplyVector4(vec4);

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
};