var UTILS = {
  makeTube: function(numCapVertices, data, offset, mod) {
    var i = offset;

    for (var v=0; v<numCapVertices*2; v++, i+=FLOATS_PER_VERTEX) {
      if (v%2 == 0) {
        var x = mod[0].scale.x * Math.cos(Math.PI*(v)/numCapVertices) + mod[0].translate.x;
        var y = mod[0].scale.y * Math.sin(Math.PI*(v)/numCapVertices) + mod[0].translate.y;
        var z = mod[0].scale.z * 0.0 + mod[0].translate.z;
        data[i] = x;
        data[i+1] = y;
        data[i+2] = z;
        data[i+3] = 1.0;
        data[i+4] = mod[0].color.r;
        data[i+5] = mod[0].color.g;
        data[i+6] = mod[0].color.b;
      } else {
        var x = mod[1].scale.x * Math.cos(Math.PI*(v-1)/numCapVertices) + mod[1].translate.x;
        var y = mod[1].scale.y * Math.sin(Math.PI*(v-1)/numCapVertices) + mod[1].translate.y;
        var z = mod[1].scale.z * 1.0 + mod[1].translate.z;
        data[i] = x;
        data[i+1] = y;
        data[i+2] = z;
        data[i+3] = 1.0;
        data[i+4] = mod[1].color.r;
        data[i+5] = mod[1].color.g;
        data[i+6] = mod[1].color.b;
      }
    }

    return i;
  },
};