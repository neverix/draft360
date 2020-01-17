AFRAME.registerComponent('renderer', {
  init: function() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    this.ctx = ctx;
    this.canvas = canvas;
  },
  tick: function() {
    var rot = this.el.getAttribute("rotation");
    var x = rot.y / 360 + 0.5;
    var y = rot.x / 360 + 0.5;
    x -= Math.floor(x);
    x *= this.canvas.width;
    y *= this.canvas.height;
    x = Math.floor(x);
    y = Math.floor(y);
    this.ctx.fillRect(x, y, x + 10, y + 10);
  }
});