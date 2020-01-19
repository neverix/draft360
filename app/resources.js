var scenes = [
  [
    "City",
    "https://cdn.glitch.com/dff38557-346e-4aa3-94d5-969225a03cf0%2F360BG_CityTemplateBlue_2k.png?v=1579385696033"
  ],
  [
    "Mountains",
    "https://cdn.glitch.com/dff38557-346e-4aa3-94d5-969225a03cf0%2Fpuydesancy.jpg?v=1579277588433"
  ]
];
var images = [
  [
    "Person",
    "https://cdn.glitch.com/dff38557-346e-4aa3-94d5-969225a03cf0%2Fstamp_person1.png?v=1579396695751"  
  ],
  [
    // temp image for multiple-images testing
    "Pigeon",
    "https://cdn.glitch.com/dff38557-346e-4aa3-94d5-969225a03cf0%2Fpigeon-transparent.png?v=1579407367303"
  ]
];

function pickFile() {
  var input = document.createElement("input");
  input.setAttribute("type", "file");
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
