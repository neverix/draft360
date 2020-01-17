AFRAME.registerComponent('line-renderer', {
  schema: {
    enabled: {default: true},
    cursorId: {default: "cursor"}
  },
  init: function() {
    this.geometry = new THREE.Geometry();
    this.material = new THREE.LineBasicMaterial({
      color: 0x0000ff,
      linewidth: 50
    });
    this.line = new THREE.Line(this.geometry, this.material);
    this.el.setObject3D(this.attrName, this.line);
    this.cursor = document.getElementById(this.data.cursorId);
  },
  tick: function(t) {
    if(!this.data.enabled) return;
    var worldPos = new THREE.Vector3();
    worldPos.setFromMatrixPosition(this.cursor.object3D.matrixWorld);
    worldPos.subtract(this.object3D.position);
    this.geometry.vertices.push(worldPos);
  }
})