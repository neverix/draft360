/* global AFRAME THREE closeDialog showDialog showQRDialog scenes images */
var prefix = "https://team-009.glitch.me"

AFRAME.registerComponent('frame-manager', {
  schema: {
    portalDistance: {default: 3},
    portalRadius: {default: 0.1}
  },
  init: function() {
    this.loaded = true;
    var href = window.location.href;
    if(href.includes("draft")) {
      this.loaded = false;
      var parts = href.split('/');
      var lastSegment = parts.pop() || parts.pop();
      var url = prefix + "/file/" + lastSegment;
      fetch(url).then(res => res.json()).then(res => {
        this.frames = res;
        this.loaded = true;
      })
    .then(response => {
        // handle response data
    })
    }
    this.frames = [
      {
        //needs to change with upload functionality // of course
        portals: [],
        images: [],
        base: scenes[0][1]
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
      var json = this.frames.map(({portals, images}, index) => ({
        portals, images, base: document.getElementById("renderer").components.renderer.canvases[index].toDataURL()
      }));
      var xhr = new XMLHttpRequest();
      xhr.open("POST", prefix + "/store/", true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(json));
      xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          showQRDialog(prefix + "/draft/" + xhr.responseText);
        }
      }
    }
    document.getElementById("new-frame").onclick = () => {
      showDialog("Choose backdrop:", scenes.map(([name, url]) => [
        name, () => {
          closeDialog();
          this.frame = this.frames.length;
          this.frames.push({
            base: url,
            portals: [],
            images: []
          });
        }
      ]));
    };
    document.getElementById("delete-frame").onclick = () => {
      showDialog("Are you sure you want to delete this frame? There's no way to undo this action", [
        ["Yes", () => {
          closeDialog();
          if(this.frames.length < 2) return;
          this.frames.splice(this.frame, 1);
          document.getElementById("renderer").components.renderer.deleteFrame(this.frame);
          this.frame = 0;
        }]
      ])
    };
    document.getElementById("new-portal").onclick = () => {
      var buttons = this.frames.map((frame, index) => [
        index + 1, () => {
          closeDialog();
          showDialog("Choose image:", images.map(([name, image]) => [
            name, () => {
              var cursor = document.getElementById("cursor");
              var worldPos = new THREE.Vector3();
              worldPos.setFromMatrixPosition(cursor.object3D.matrixWorld);
              worldPos.multiplyScalar(this.data.portalDistance);
              var rot = document.getElementById("camera")
                .getAttribute("rotation");
              this.frames[this.frame].portals.push({
                position: worldPos,
                rotation: rot,
                src: image,
                to: index
              });
              closeDialog();
            }
          ]));
          /*
          var cursor = document.getElementById("cursor");
          var worldPos = new THREE.Vector3();
          worldPos.setFromMatrixPosition(cursor.object3D.matrixWorld);
          worldPos.multiplyScalar(this.data.portalDistance);
          this.frames[this.frame].portals.push({
            position: worldPos,
            to: index
          });
          closeDialog();
          */
        }
      ]);
      showDialog("Make portal to:", buttons);
    };
    this.imageMode = false;
    document.getElementById("image-mode").onclick = () => {
      /*if (this.imageMode) {
        this.imageMode = false;
        document.getElementById("image-mode-icon").innerText = "add_photo_alternate";
      } else {
      */
        showDialog("Choose image:", images.map(([name, image]) => [
          name, () => {
            this.imageMode = true;
            //document.getElementById("image-mode-icon").innerText = "done";
            var cursor = document.getElementById("cursor");
            var worldPos = new THREE.Vector3();
            worldPos.setFromMatrixPosition(cursor.object3D.matrixWorld);
            worldPos.multiplyScalar(this.data.portalDistance);
            var rot = document.getElementById("camera")
              .getAttribute("rotation");
            this.frames[this.frame].images.push({
              position: worldPos,
              rotation: rot,
              src: image
            });
            closeDialog();
          }
        ]));
      //}
    }
  },
  tick: function() {
    if(!this.loaded) return;
    document.getElementById("frame-number").innerText = this.frame + 1
    document.getElementById("renderer").components.renderer
      .loadImage(this.frames[this.frame].base, this.frame);
    for(var i = 0; i < this.frames.length; i++) {
      var { portals, images } = this.frames[i];
      portals.forEach(({ position, rotation, src, to }, nd) => {
        var portalId = `portal-${i}-${nd}`;
        var elem = document.getElementById(portalId);
        if(i == this.frame) {
          if(!elem) {
            /*
            var portal = document.createElement("a-sphere");
            var p = position;
            portal.setAttribute("position", `${p.x} ${p.y} ${p.z}`);
            portal.setAttribute("radius", this.data.portalRadius);
            portal.id = portalId;
            portal.onclick = () => {
              this.frame = to;
            };
            this.el.sceneEl.appendChild(portal);
            */
            var p = position;
            var portal = document.createElement("a-image");
            portal.id = portalId;
            var p = position;
            portal.setAttribute("position", `${p.x} ${p.y} ${p.z}`);
            var r = rotation;
            portal.setAttribute("rotation", `${r.x} ${r.y} ${r.z}`);
            //portal.setAttribute("size", `200 200`);
            portal.setAttribute("src", src);
            // portal.setAttribute("particle-system", "color: #44CC00; maxAge: 0.1; particleCount: 10; velocityValue: 0 0 0; velocitySpread: 1 1 1");
            //portal.setAttribute("animation", "property: scale; dur: 1000; from: 1 1 1; to: 0.8 0.8 0.8; loop: true; direction: alternate; easing: linear");
            portal.onclick = () => {
              this.frame = to;
            };
            this.el.sceneEl.appendChild(portal);
          }
        } else if(!!elem) elem.remove();
      });
      images.forEach(({ position, rotation, src }, nd) => {
        var stampId = `image-${i}-${nd}`;
        var elem = document.getElementById(stampId);
        if(i == this.frame) {
          if(!elem) {
            var p = position;
            var stampImg = document.createElement("a-image");
            stampImg.id = stampId;
            var p = position;
            stampImg.setAttribute("position", `${p.x} ${p.y} ${p.z}`);
            var r = rotation;
            stampImg.setAttribute("rotation", `${r.x} ${r.y} ${r.z}`);
            //stampImg.setAttribute("size", `200 200`);
            stampImg.setAttribute("src", src);
            this.el.sceneEl.appendChild(stampImg);
          }
        } else if(!!elem) elem.remove();
      });
    }
  }
});