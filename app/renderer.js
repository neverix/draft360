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
    this.canvases.splice(scene, 1);
    this.images.splice(scene, 1);
    this.meshes.splice(scene, 1);
    this.textures.splice(scene, 1);
    this.ctxs.splice(scene, 1);
  },
  loadImage: function(img, scene) {
    var mat = new THREE.LineBasicMaterial({
      color: this.data.strokeColor,
      linewidth: this.data.strokeSize
    });
    if(this.images[scene]) {
      this.image = this.images[scene];
      if(!!this.meshes[scene] && !!this.lines[scene]) {
        this.loaded = true;
        this.el.setObject3D("mesh", this.meshes[scene]);
        var geo = new THREE.Geometry();
        this.line = this.lines[scene];
        geo.vertices = this.line;
        geo.verticesNeedUpdate = true;
        this.geo = new THREE.LineSegments(geo, mat);
        this.geos[scene] = this.geo;
        this.el.setObject3D("lines", this.geo);
      }
      return;
    }
    this.image = new Image();
    this.image.crossOrigin = "anonymous";
    this.image.src = img;
    this.loaded = false;
    this.images[scene] = this.image;
    this.image.addEventListener("load", () => {
      this.texture = new THREE.Texture(this.image);
      this.textures[scene] = this.texture;
      var material = new THREE.MeshBasicMaterial({
        map: this.texture,
        flatShading: THREE.FlatShading,
        side: THREE.BackSide
      });
      var geometry = new THREE.SphereGeometry(this.data.radius,
                                              this.data.subdiv,
                                              this.data.subdiv);
      var mesh = new THREE.Mesh(geometry, material);
      this.meshes[scene] = mesh;
      this.el.setObject3D("mesh", mesh);
      var geo = new THREE.Geometry();
      this.line = geo.vertices;
      this.lines[scene] = this.line;
      this.geo = new THREE.LineSegments(geo, mat);
      this.geos[scene] = this.geo;
      this.el.setObject3D("lines", this.geo);
      this.loaded = true;
      this.texture.needsUpdate = true;
    }).bind(this);
  },
  init: function() {
    this.loaded = false;
    this.images = [];
    this.meshes = [];
    this.textures = [];
    this.line = [];
    this.lines = [];
    this.geos = [];
    this.circle = document.getElementById("circle");
    this.enabled = false;
    this.prevPos = null;
    this.prevEnabled = false;
  },
  tick: function(t) {
    var pos = document.getElementById("cursor").components.raycaster.raycaster.ray.direction;
    pos = new THREE.Vector3(pos.x, pos.y, pos.z);
    document.getElementById("cover").style.display = this.loaded ? "none" : "block";
    if(this.prevEnabled && !this.enabled) {
      
    }
    if(this.loaded && this.enabled) {
      this.line.push(this.prevPos, pos);
      this.geo.geometry.verticesNeedUpdate = true;
    }
    this.prevPos = pos;
    this.prevEnabled = this.enabled;
  }
});