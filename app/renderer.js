AFRAME.registerComponent('renderer', {
  schema: {
    backdrop: { default: "https://cdn.glitch.com/dff38557-346e-4aa3-94d5-969225a03cf0%2Fpuydesancy.jpg" }
  },
  init: function() {
    document.getElementById("backdrop-img").src = this.data.backdrop;
    this.backdrop = document.getElementById("backdrop").getProperty("sky");
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(50, 50, 60, 60)
  }
});