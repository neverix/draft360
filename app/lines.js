AFRAME.registerComponent('line-renderer', {
  schema: {
    enabled: {default: true},
    cursorId: {default: "cursor"}
  },
  init: function() {
    this.geometry = new THREE.BufferGeometry();
    this.material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    this.line = new THREE.Line(this.geometry, this.material);
    this.object3d.add(this.line);
    this.cursor = document.getElementById(this.data.cursorId);
  },
  tick: function(t) {
    if(!this.data.enabled) return;
    var worldPos = new THREE.Vector3();
    worldPos.setFromMatrixPosition(this.cursor.object3d.matrixWorld);
    console.log(worldPos);
    this.geometry.vertices.add(worldPos);
  }
})