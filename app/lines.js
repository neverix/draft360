var meshline = require("aframe-meshline-component");

AFRAME.registerComponent('line-renderer', {
  schema: {
    enabled: {default: true},
    cursorId: {default: "cursor"}
  },
  init: function() {
    this.cursor = document.getElementById(this.data.cursorId);
    this.firstFrame = true;
  },
  tick: function(t) {
    var worldPos = new THREE.Vector3();
    worldPos.setFromMatrixPosition(this.cursor.object3D.matrixWorld);
    if(!this.data.enabled ||) {
      
    }
  }
})