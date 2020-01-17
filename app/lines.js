AFRAME.registerComponent('mylook-controls', {
  schema: {
    enabled: {default: true},
    material: {default: new THREE.LineBasicMaterial({ color: 0x0000ff })},
    cursorId: {default: "cursor"},
    cursor: {default: }
  },
  init: function() {
    this.geometry = new THREE.Geometry();
    this.line = new THREE.Line(geometry, material);
    this.object3d.add(this.line);
    this.worldPos = new THREE.Vector3();
    this.cursor = document.get
  },
  tick: function(t) {
    if(!this.data.enabled) return;
    this.worldPos.setFromMatrixPosition(this.object3D.matrixWorld);
  }
})