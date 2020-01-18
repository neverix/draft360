AFRAME.registerComponent('renderer', {
  schema: {
    image: {default: "https://cdn.glitch.com/dff38557-346e-4aa3-94d5-969225a03cf0%2F8b4718d5-af4e-4720-b09b-9c4f4a59768f.image.png?v=1579359942179"},
    radius: {default: 1000},
    subdiv: {default: 64},
    strokeColor: {default: "#101010"},
    strokeSize: {default: 3},
    hThreshold: {default: 0.8}
  },
  init: function() {
    this.image = new Image();
    this.image.crossOrigin = "anonymous";
    this.image.src = this.data.image;
    this.loaded = false;
    this.image.onload = (() => {
      var canvas = document.getElementById("canvas");
      canvas.width = this.image.width;
      canvas.height = this.image.height;
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = this.data.strokeColor;
      ctx.lineWidth = this.data.strokeSize;
      this.ctx = ctx;
      this.ctx.drawImage(this.image, 0, 0);
      this.canvas = canvas;
      this.texture = new THREE.Texture(this.canvas);
      var material = new THREE.MeshBasicMaterial({
        map: this.texture,
        flatShading: THREE.FlatShading,
        side: THREE.BackSide
      });
      var geometry = new THREE.SphereGeometry(this.data.radius,
                                              this.data.subdiv,
                                              this.data.subdiv);
      var mesh = new THREE.Mesh(geometry, material);
      this.el.setObject3D("mesh", mesh);
      this.loaded = true;
    }).bind(this);
    this.line = [];
    this.lines = [];
    this.camera = document.getElementById("camera");
    this.cursor = document.getElementById("cursor").object3D;
    this.enabled = true;
    this.prevEnabled = false;
  },
  tick: function(t) {
    if(!this.loaded) return;
    if(!this.enabled) {
      this.prevEnabled = false;
      return;
    }
    if(!this.prevEnabled) {
      this.line = [];
      this.lines.push(this.line);
    }
    this.prevEnabled = true;
    var rot = this.camera.getAttribute("rotation");
    var x = (rot.y + 90) / 360 + 0.5;
    var y = rot.x / -180 + 0.5;
    x -= Math.floor(x);
    x *= this.canvas.width;
    y *= this.canvas.height;
    x = Math.floor(x);
    y = Math.floor(y);
    this.line.push([x, y]);
    if(this.line.length > 1) {
      var i = this.line.length - 1;
      if(this.line[i][0] - this.line[i - 1][0]
         > this.canvas.width * this.data.hThreshold) return;
      if(this.line[i - 1][0] - this.line[i - 1][0]
         > this.canvas.width * this.data.hThreshold) return;
      this.ctx.beginPath();
      this.ctx.moveTo(this.line[i][0], this.line[i][1]);
      this.ctx.lineTo(this.line[i - 1][0], this.line[i - 1][1]);
      this.ctx.stroke();
      this.texture.needsUpdate = true;
    }
  }
});