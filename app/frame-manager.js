/* global AFRAME THREE closeDialog showDialog */
AFRAME.registerComponent('frame-manager', {
  init: function() {
    this.frames = [
      {
        //needs to change with upload functionality
        portals: [],
        base: "https://cdn.glitch.com/dff38557-346e-4aa3-94d5-969225a03cf0%2F8b4718d5-af4e-4720-b09b-9c4f4a59768f.image.png?v=1579359942179"
      }
    ];
    this.frame = 0;
  },
  tick: function() {
    document.getElementById("renderer").components.renderer
      .loadImage(this.frames[this.frame].base, this.frame);
    document.getElementById("frames").onclick =   () => {
      var buttons = this.frames.map((frame, index) => [
        index + 1, () => {
          this.frame = index;
          closeDialog();
        }
      ]);
      showDialog("Frame:", buttons);
    };
    document.getElementById("new-frame").onclick = () => {
      this.frame = this.frames.length;
      this.frames.push({
        base: this.frames[this.frames.length - 1].base,
        portals: []
      });
    };
    document.getElementById("new-portal").onclick = () => {
      var buttons = this.frames.map((frame, index) => [
        index + 1, () => {
          var cursor = document.getElementById("cursor");
          var worldPos = new THREE.Vector3();
          worldPos.setFromMatrixPosition(cursor.object3D.matrixWorld);
          var portal = document.createElement("a-sphere");
          portal.setAttribute("cursor-listener", '');
          var w = worldPos;
          portal.position = `${w.x} ${w.y} ${w.z}`;
          portal.radius = 0.1;
          portal.color = "red";
          portal.onclick = () => {
            this.frame = index;
          };
          this.el.sceneEl.appendChild(portal);
          this.frames[index].portals.push({
            position: worldPos,
            to: index
          });
          closeDialog();
        }
      ]);
      showDialog("Frame:", buttons);
    }
  }
});