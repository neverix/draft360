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
  ]
];

function pickFile() {
  var input = document.createElement("file")
}

window.addEventListener("load", () => {
  document.getElementById("360-open").addEventListener("click", () => {
    console.log("360");
  });
  document.getElementById("image-open").addEventListener("click", () => {
    console.log("image");
  });
});
