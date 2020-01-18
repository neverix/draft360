/* global dialogPolyfill  */
function getDialog() {
  var dialog = document.getElementById("modal");
  if (!dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
  }
  return dialog;
}

function showDialog(text, buttons) {
  var dialog = document.getElementById("modal");
  if (!dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
  }
  dialog.showModal();
  document.getElementById("modal-text").innerText = text;
  var buttonsElem = document.getElementById("modal-buttons");
  buttons.forEach(([text, action]) => {
    var button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("class", "mdl-button");
    button.innerText = text;
    button.onclick = action;
    buttonsElem.appendChild(button);
  });
}
function closeDialog() {
  var dialog = document.getElementById("modal");
  if (!dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
  }
  dialog.close();
}

window.addEventListener("load", () => {
  showDialog("Hello", [
    ["Close", () => {
      alert("Hmm");
      closeDialog();
    }]
  ])
});