var scenes = [
  [
    "Grid",
    "https://cdn.glitch.com/a8da06d9-f932-41a5-aaec-fae9a08ccb37%2F360BG_BasicBackground_4K.png?v=1590133236870"
  ],
  [
    "Grid (Black&White)",
    "https://cdn.glitch.com/a8da06d9-f932-41a5-aaec-fae9a08ccb37%2F360BG_DarkGrid_Square_4K.jpg?v=1590133237232"
  ],
  [
    "Grid (White&Blue)",
    "https://cdn.glitch.com/a8da06d9-f932-41a5-aaec-fae9a08ccb37%2F360BG_BlueGrid_Square_4K.jpg?v=1590133236030"
  ],
  [
    "City",
    "https://cdn.glitch.com/a8da06d9-f932-41a5-aaec-fae9a08ccb37%2F360BG_CityTemplateBlue_4k.jpg?v=1590133236612"
  ],
  [
    "Field",
    "https://cdn.glitch.com/dff38557-346e-4aa3-94d5-969225a03cf0%2Fpuydesancy.jpg?v=1579277588433"
  ]
];
var images = [
  [
    "Person",
    "https://cdn.glitch.com/dff38557-346e-4aa3-94d5-969225a03cf0%2Fstamp_person1.png?v=1579396695751"  
  ],
  /*[
    // temp image for multiple-images testing
    "Pigeon",
    "https://cdn.glitch.com/dff38557-346e-4aa3-94d5-969225a03cf0%2Fpigeon-transparent.png?v=1579407367303"
  ],*/
  [
    "Portal",
    "https://cdn.glitch.com/dff38557-346e-4aa3-94d5-969225a03cf0%2FPortal.png?v=1579443744370"
  ]
];

var input = document.createElement("input");
input.setAttribute("type", "file");
input.onclick = () => { input.value = null };

function pickFile() {
  return new Promise((ok, err) => {
    input.onchange = () => {
      var file = input.files[0];
      var reader = new FileReader();
      reader.onload = () => {
        var content = reader.result;
        ok([file.name, content]);
      }
      reader.readAsDataURL(file);
    }
    input.click();
  });
}

window.addEventListener("load", () => {
  document.getElementById("360-open").addEventListener("click", () => {
    pickFile().then(([name, content]) => {
      scenes.push([name, content]);
    });
  });
  document.getElementById("image-open").addEventListener("click", () => {
    pickFile().then(([name, content]) => {
      images.push([name, content]);
    });
  });
});
