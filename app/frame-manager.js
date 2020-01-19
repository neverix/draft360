/* global AFRAME THREE closeDialog showDialog showQRDialog scenes */
var prefix = "https://team-009.glitch.me"

AFRAME.registerComponent('frame-manager', {
  schema: {
    portalDistance: {default: 5},
    portalRadius: {default: 0.5}
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
            portals: []
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
      showDialog("Frame:", buttons);
    };
    this.imageMode = false;
    document.getElementById("image-mode").onclick = () => {
      this.imageMode = true;
      // this.stampImage = new Image();
      // this.stampImage.crossOrigin = "anonymous";
      // this.stampImage.src = "https://cdn.glitch.com/dff38557-346e-4aa3-94d5-969225a03cf0%2Fstamp_person1.png?v=1579396695751";
    }
  },
  tick: function() {
    if(!this.loaded) return;
    document.getElementById("frame-number").innerText = this.frame + 1
    document.getElementById("renderer").components.renderer
      .loadImage(this.frames[this.frame].base, this.frame);
    for(var i = 0; i < this.frames.length; i++) {
      var { portals } = this.frames[i];
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
    }
  }
});