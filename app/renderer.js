/* global AFRAME, THREE */
AFRAME.registerComponent('renderer', {
  schema: {
    radius: {default: 5},
    subdiv: {default: 64},
    strokeColor: {default: "red"},
    strokeSize: {default: 3},
    hThreshold: {default: 0.8},
    enabled: {default: true},
    maxDistance: {default: 0.1}
  },
  deleteFrame: function(scene) {
    this.lines.splice(scene, 1);
    this.geos.splice(scene, 1);
  },
  loadImage: function(img, scene) {
    this.sky.setAttribute("src", img);
    var mat = new THREE.LineBasicMaterial({
      color: this.data.strokeColor,
      linewidth: this.data.strokeSize
    });
    if(!this.lines[scene]) {
      this.lines[scene] = [];
    }
    // if(scene != this.prevEnabled) {
      this.loaded = false;
      var geo = new THREE.Geometry();
      this.line = this.lines[scene];
      geo.vertices = this.line;
      this.geo = new THREE.LineSegments(geo, mat);
      this.geos[scene] = this.geo;
      this.el.setObject3D("mesh", this.geo);
    // }
    this.loaded = true;
    this.prevEnabled = scene;
  },
  init: function() {
    this.loaded = false;
    this.line = [];
    this.lines = [[]];
    this.geos = [];
    this.sky = document.getElementById("sky");
    this.circle = document.getElementById("circle");
    this.enabled = false;
    this.prevPos = null;
    this.eraserMode = false;
    document.getElementById("edit-mode").addEventListener("click", () => {
      this.eraserMode = false;
    });
    document.getElementById("eraser-mode").addEventListener("click", () => {
      this.eraserMode = true;
    });
    this.on = false;
  },
  tick: function(t) {
    var pos = document.getElementById("cursor").components.raycaster.raycaster.ray.direction;
    pos = new THREE.Vector3(pos.x, pos.y, pos.z);
    document.getElementById("cover").style.display = this.loaded ? "none" : "block";
    if(this.loaded && this.enabled && this.on) {
      if(this.eraserMode) {
        this.line.splice(0, this.line.length, ...this.line.filter(x => {
          return this.keep(x, pos);
        }));
      } else {
        this.line.push(this.prevPos, pos);
      }
      this.geo.geometry.verticesNeedUpdate = true;
    }
    this.prevPos = pos;
    this.prevEnabled = this.enabled;
  },
  keep: function(a, c) {
    return a.normalize().distanceTo(c) > this.data.maxDistance;
  }
});

function filter(arr) {
  var newArr = [];
  for(var i = 0; i < arr.length; i++) {

  }
}
function(arr) {
  var newArr = [];
  for(var i = 0; i < arr.length; i += 2) {
    var a = arr[i];
    var b = arr[i + 1];
    if(this.keep(a, b)) {
      newArr.push(a, b);
    }
  }
}
