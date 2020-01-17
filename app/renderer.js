AFRAME.registerComponent('renderer', {
  init: function() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#000000";
    ctx.strokeWidth = 10;
    this.ctx = ctx;
    this.canvas = canvas;
    this.line = [];
    this.lines = [this.line];
    
  },
  tick: function(t) {
    var rot = this.el.getAttribute("rotation");
    var x = rot.y / 360 + 0.5;
    var y = rot.x / 360 + 0.5;
    x -= Math.floor(x);
    x *= this.canvas.width;
    y *= this.canvas.height;
    x = Math.floor(x);
    y = Math.floor(y);
    this.line.push([x, y]);
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.beginPath();
    for(var i = 1; i < this.line.length; i++) {
      this.ctx.moveTo(this.line[i][0], this.line[i][1]);
      this.ctx.lineTo(this.line[i - 1][0], this.line[i - 1][1]);
    }
    this.ctx.stroke();
  }
});