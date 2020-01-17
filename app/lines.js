AFRAME.registerComponent('line-renderer', {
  schema: {
    enabled: {default: true},
    cursorId: {default: "cursor"}
  },
  init: function() {
    this.cursor = document.getElementById(this.data.cursorId);
    this.firstFrame = true;
    this.lines = [];
    this.line = null;
    this.component = null;
    this.prevEnabled = false;
  },
  tick: function(t) {
    var worldPos = new THREE.Vector3();
    worldPos.setFromMatrixPosition(this.cursor.object3D.matrixWorld);
    if(!this.data.enabled) {
      this.prevEnabled = false;
      return;
    }
    if(!this.prevEnabled) {
      this.line = [worldPos];
      this.lines.push(this.line);
      this.component = document.createElement("a-entity");
      document.body.appendChild(this.component);
      this.firstFrame = false;
    }
    this.component.setAttribute("meshline", "lineWidth: 20; path: "
                                + this.line.map(x => x.toString()).join(", ")
                                + "; color: #FFFFFF");
    this.prevEnabled = true;
  }
})