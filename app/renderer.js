/* global AFRAME, THREE */
AFRAME.registerComponent('renderer', {
  schema: {
    radius: {default: 5},
    subdiv: {default: 64},
    strokeColor: {default: "red"},
    strokeSize: {default: 3},
    hThreshold: {default: 0.8},
    enabled: {default: true}
  },
  deleteFrame: function(scene) {
    this.lines.splice(scene, 1);
    this.geos.splice(scene, 1);
  },
  loadImage: function(img, scene) {
    this.sky.setAttribute("src", img);
    if(!this.geos[scene]) {
      this.line = [];
      this.lines[scene] = this.line;
      var mat = new THREE.LineBasicMaterial({
        color: this.data.strokeColor,
        linewidth: this.data.strokeSize
      });
      var geo = new THREE.Geometry();
      geo.vertices = this.line;
      this.geo = new THREE.LineSegments(geo, mat);
      this.geos[scene] = this.geo;
      this.el.setObject3D("mesh", this.geo);
    }
    this.geo = this.geos[scene];
    this.line = this.lines[scene];
    this.loaded = true;
  },
  init: function() {
    this.loaded = false;
    this.line = [];
    this.lines = [[]];
    this.geos = [];
    this.circle = document.getElementById("circle");
    this.enabled = false;
    this.prevPos = null;
    this.sky = document.getElementById("sky")
  },
  tick: function(t) {
    var pos = document.getElementById("cursor").components.raycaster.raycaster.ray.direction;
    pos = new THREE.Vector3(pos.x, pos.y, pos.z);
    document.getElementById("cover").style.display = this.loaded ? "none" : "block";
    if(this.loaded && this.enabled) {
      this.line.push(this.prevPos, pos);
      this.geo.geometry.verticesNeedUpdate = true;
    }
    this.prevPos = pos;
  }
});