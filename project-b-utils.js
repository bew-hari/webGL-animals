var UTILS = {
  makeTube: function(numCapVertices, data, offset, mod) {
    var i = offset;

    var pos = new Vector4(),
        norm = new Vector4();

    for (var v=0; v<numCapVertices*2; v++, i+=FLOATS_PER_VERTEX) {
      if (v%2 == 0) {
        
        pos.set(
          Math.cos(Math.PI*(v)/numCapVertices),
          Math.sin(Math.PI*(v)/numCapVertices),
          0.0,
          1.0
        );

        var transformedPos = mod[0].posTransform.multiplyVector4(pos);
        var transformedNorm = mod[0].normTransform.multiplyVector4(pos);

        data[i] = transformedPos.elements[0];
        data[i+1] = transformedPos.elements[1];
        data[i+2] = transformedPos.elements[2];
        data[i+3] = transformedPos.elements[3];
        
        data[i+4] = mod[0].color.r;
        data[i+5] = mod[0].color.g;
        data[i+6] = mod[0].color.b;
        data[i+7] = mod[0].color.a;

        data[i+8] = transformedNorm.elements[0];
        data[i+9] = transformedNorm.elements[1];
        data[i+10] = transformedNorm.elements[2];
        data[i+11] = transformedNorm.elements[3];

      } else {
        
        pos.set(
          Math.cos(Math.PI*(v-1)/numCapVertices),
          Math.sin(Math.PI*(v-1)/numCapVertices),
          1.0,
          1.0
        );

        norm.set(
          Math.cos(Math.PI*(v-1)/numCapVertices),
          Math.sin(Math.PI*(v-1)/numCapVertices),
          0.0,
          1.0
        );

        var transformedPos = mod[1].posTransform.multiplyVector4(pos);
        var transformedNorm = mod[1].normTransform.multiplyVector4(norm);

        data[i] = transformedPos.elements[0];
        data[i+1] = transformedPos.elements[1];
        data[i+2] = transformedPos.elements[2];
        data[i+3] = transformedPos.elements[3];

        data[i+4] = mod[1].color.r;
        data[i+5] = mod[1].color.g;
        data[i+6] = mod[1].color.b;
        data[i+7] = mod[1].color.a;

        data[i+8] = transformedNorm.elements[0];
        data[i+9] = transformedNorm.elements[1];
        data[i+10] = transformedNorm.elements[2];
        data[i+11] = transformedNorm.elements[3];

      }
    }

    return i;
  },

  // returns cap modification object for use in makeTube
  makeCapOptions: function(scaleX, scaleY, scaleZ, rotateAngle, rotateX, rotateY, rotateZ, transX, transY, transZ, r, g, b, a) {
    var posTransform = new Matrix4(),
        normTransform = new Matrix4();

    posTransform.setTranslate(transX, transY, transZ);
    posTransform.rotate(rotateAngle, rotateX, rotateY, rotateZ);
    posTransform.scale(scaleX, scaleY, scaleZ);

    normTransform.setInverseOf(posTransform);
    normTransform.transpose();
    //normTransform.setScale(scaleX, scaleY, scaleZ);
    //normTransform.rotate(rotateAngle, rotateX, rotateY, rotateZ);
    //normTransform.invert();
    //normTransform.transpose();

    return {
      posTransform: posTransform,
      normTransform: normTransform, 
      color: {r: r, g: g, b: b, a: a},
    };
  },

  makeSceneryTransform: function(scaleRange, rotateRange, transRangeX, transRangeY, transRangeZ) {
    var posTransform = new Matrix4(),
        normTransform = new Matrix4();

    var scaleX = this.randomRange(scaleRange[0], scaleRange[1]),
        scaleY = this.randomRange(scaleRange[0], scaleRange[1]),
        scaleZ = this.randomRange(scaleRange[0], scaleRange[1]),

        angle = this.randomRange(rotateRange[0], rotateRange[1]),

        transX = this.randomRange(transRangeX[0], transRangeX[1]),
        transY = this.randomRange(transRangeY[0], transRangeY[1]),
        transZ = this.randomRange(transRangeZ[0], transRangeZ[1]);

    posTransform.setTranslate(transX, transY, transZ);
    posTransform.rotate(angle, 0, 0, 1);
    posTransform.scale(scaleX, scaleY, scaleZ);

    //normTransform.setInverseOf(posTransform);
    //normTransform.transpose();
    normTransform.setScale(scaleX, scaleY, scaleZ);
    normTransform.rotate(angle, 0, 0, 1);
    normTransform.invert();
    normTransform.transpose();

    return {
      posTransform: posTransform,
      normTransform: normTransform,
    };
  },

  // returns random float within given range
  randomRange: function(low, high) {
    return Math.random() * (high - low) + low;
  },

  transformVertices: function(transform, vertices) {
    var result = new Float32Array(vertices.length);

    var posTransform = transform.posTransform,
        normTransform = transform.normTransform;

    for (var v=0; v<vertices.length; v+=FLOATS_PER_VERTEX) {
      var originalPos = new Vector4([vertices[v], vertices[v+1], vertices[v+2], vertices[v+3]]);
      var transformedPos = posTransform.multiplyVector4(originalPos);

      var originalNorm = new Vector4([vertices[v+8], vertices[v+9], vertices[v+10], vertices[v+11]]);
      var transformedNorm = normTransform.multiplyVector4(originalNorm);

      result[v] = transformedPos.elements[0];
      result[v+1] = transformedPos.elements[1];
      result[v+2] = transformedPos.elements[2];
      result[v+3] = transformedPos.elements[3];

      result[v+4] = vertices[v+4];
      result[v+5] = vertices[v+5];
      result[v+6] = vertices[v+6];
      result[v+7] = vertices[v+7];

      result[v+8] = transformedNorm.elements[0];
      result[v+9] = transformedNorm.elements[1];
      result[v+10] = transformedNorm.elements[2];
      result[v+11] = transformedNorm.elements[3];
    }

    return result;
  },
};