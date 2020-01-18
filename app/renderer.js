AFRAME.registerComponent('renderer', {
  schema: {
    image: {default: "https://cdn.glitch.com/dff38557-346e-4aa3-94d5-969225a03cf0%2Fpuydesancy.jpg"},
    radius: {default: 1000},
    subdiv: {default: 64}
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
      ctx.strokeStyle = "#000000";
      ctx.strokeWidth = 10;
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
    this.lines = [this.line];
    this.camera = document.getElementById("camera");
  },
  tick: function(t) {
    if(!this.loaded) return;
    var rot = this.camera.getAttribute("rotation");
    var x = (rot.y + 90) / 360 + 0.5;
    var y = rot.x / -360 + 0.5;
    x -= Math.floor(x);
    x *= this.canvas.width;
    y *= this.canvas.height;
    x = Math.floor(x);
    y = Math.floor(y);
    this.line.push([x, y]);
    if(this.line.length > 1) {
      this.ctx.beginPath();
      var i = this.line.length - 1;
      this.ctx.moveTo(this.line[i][0], this.line[i][1]);
      this.ctx.lineTo(this.line[i - 1][0], this.line[i - 1][1]);
      this.ctx.stroke();
      this.texture.needsUpdate = true;
    }
  }
});