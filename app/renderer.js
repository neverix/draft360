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
      color: 0x7167f8
    });
    if(this.images[scene]) {
      this.image = this.images[scene];
      if(!!this.meshes[scene] && !!this.lines[scene]) {
        this.loaded = true;
        this.el.setObject3D("mesh", this.meshes[scene]);
        this.geo = this.geos[scene];
        this.el.setObject3D("line", this.geo)
        this.line = this.lines[scene];
      }
      return;
    }
    this.image = new Image();
    this.image.crossOrigin = "anonymous";
    this.image.src = img;
    this.loaded = false;
    this.images[scene] = this.image;
    this.image.onload = (() => {
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
      this.geo = new THREE.Line(geo, mat);
      this.geos[scene] = this.geo;
      this.el.setObject3D("line", this.geo);
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
  },
  tick: function(t) {
    document.getElementById("cover").style.display = this.loaded ? "none" : "block";
    if(!this.loaded) return;
    if(!this.enabled) return;
    var pos = this.circle.getAttribute("position");
    this.line.push(pos);
    this.geo.needsUpdate = true;
  }
});