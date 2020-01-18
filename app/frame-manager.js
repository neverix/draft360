AFRAME.registerComponent('frame-manager', {
  init: function() {
    this.frames = [
      {
        base: "https://cdn.glitch.com/dff38557-346e-4aa3-94d5-969225a03cf0%2F8b4718d5-af4e-4720-b09b-9c4f4a59768f.image.png?v=1579359942179"
      }
    ];
    this.frame = 0;
  },
  tick: function() {
    document.getElementById("renderer").components.renderer.loadImage(this.frames[this.frame].base, this.frame)
  }
});