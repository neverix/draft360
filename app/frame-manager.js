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
      var json = this.frames.map(({portals}, index) => ({
        portals, base: document.getElementById("renderer").components.renderer.canvases[index].toDataURL()
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
      showDialog("Choose frame to teleport to:", buttons);
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
            this.imageSrc = image;
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
              src: this.imageSrc
            });
            closeDialog();
          }
        ]))
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
      portals.forEach(({ position, to }, nd) => {
        var portalId = `portal-${i}-${nd}`;
        var elem = document.getElementById(portalId);
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
            stampImg.setAttribute("rotation", rotation);
            stampImg.setAttribute("size", `200 200`);
            stampImg.setAttribute("src", src);
            this.el.sceneEl.appendChild(stampImg);
          }
        } else if(!!elem) elem.remove();
      });
    }
  }
});