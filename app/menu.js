/* global dialogPolyfill, isTouch  */
function getDialog() {
  var dialog = document.getElementById("modal");
  if (!dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
  }
  return dialog;
}

function showDialog(text, buttons) {
  if(!isTouch()) {
    document.getElementById("camera").components
      .mylookcontrols.movementMode = true;
  }
  var dialog = getDialog();
  dialog.showModal();
  document.getElementById("modal-text").innerText = text;
  var buttonsElem = document.getElementById("modal-buttons");
  buttonsElem.innerHTML = "";
  buttons.push(["Close", closeDialog]);
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
  getDialog().close();
}