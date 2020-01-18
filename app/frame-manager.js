/* global AFRAME THREE closeDialog showDialog showQRDialog scenes */
AFRAME.registerComponent('frame-manager', {
  schema: {
    portalDistance: {default: 5},
    portalRadius: {default: 0.5}
  },
  init: function() {
    this.frames = [
      {
        //needs to change with upload functionality
        portals: [],
        base: "https://cdn.glitch.com/dff38557-346e-4aa3-94d5-969225a03cf0%2F8b4718d5-af4e-4720-b09b-9c4f4a59768f.image.png?v=1579359942179"
      }
    ];
    this.frame = 0;
        document.getElementById("frames").onclick =   () => {
      var buttons = this.frames.map((frame, index) => [
        index + 1, () => {
          this.frame = index;
          closeDialog();
        }
      ]);
      showDialog("Frame:", buttons);
    };
    document.getElementById("export").onclick = () => {
      //console.log("export button clicked");
      showQRDialog();
    }
    document.getElementById("new-frame").onclick = () => {
      showDialog("Choose backdrop:", scenes.map(scene => {
        
      }));
      this.frame = this.frames.length;
      this.frames.push({
        base: this.frames[this.frames.length - 1].base,
        portals: []
      });
    };
    document.getElementById("delete-frame").onclick = () => {
      if(this.frames.length < 2) return;
      this.frames.splice(this.frame, 1);
      document.getElementById("renderer").components.renderer.deleteFrame(this.frame);
      this.frame = 0;
    };
    document.getElementById("new-portal").onclick = () => {
      var buttons = this.frames.map((frame, index) => [
        index + 1, () => {
          var cursor = document.getElementById("cursor");
          var worldPos = new THREE.Vector3();
          worldPos.setFromMatrixPosition(cursor.object3D.matrixWorld);
          worldPos.multiplyScalar(this.data.portalDistance);
          this.frames[this.frame].portals.push({
            position: worldPos,
            to: index
          });
          closeDialog();
        }
      ]);
      showDialog("Frame:", buttons);
    };
  },
  tick: function() {
    document.getElementById("frame-number").innerText = this.frame + 1
    document.getElementById("renderer").components.renderer
      .loadImage(this.frames[this.frame].base, this.frame);
    for(var i = 0; i < this.frames.length; i++) {
      var { portals } = this.frames[i];
      portals.forEach(({ position, to }) => {
        var portalId = `portal-${i}-${to}`;
        var elem = document.getElementById(portalId);
        console.log(portalId, elem);
        if(i == this.frame) {
          if(!elem) {
            var portal = document.createElement("a-sphere");
            var p = position;
            portal.setAttribute("position", `${p.x} ${p.y} ${p.z}`);
            portal.setAttribute("radius", this.data.portalRadius);
            portal.id = portalId;
            portal.onclick = () => {
              this.frame = to;
            };
            this.el.sceneEl.appendChild(portal);
          }
        } else if(!!elem) elem.remove();
      });
    }
  }
});