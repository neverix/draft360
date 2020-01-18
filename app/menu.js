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

function showQRDialog() {
  if(!isTouch()) {
    document.getElementById("camera").components
      .mylookcontrols.movementMode = true;
  }
  var dialog = getDialog();
  dialog.showModal();
  document.getElementById("modal-text").innerText = "QR Code";
  
  var imageElem = document.getElementById("qr-code");
  var img = document.createElement('img'); 
  img.src =  'https://cdn.glitch.com/dff38557-346e-4aa3-94d5-969225a03cf0%2FTeam009QRCode.png?v=1579278312151'; 
  imageElem.appendChild(img);
  
  var buttonsElem = document.getElementById("modal-buttons");
  buttonsElem.innerHTML = "";
  var button = document.createElement("button");
  button.setAttribute("type", "button");
  button.innerText = "CLOSE";
  button.onclick = closeDialog;
  buttonsElem.appendChild(button);
}

function closeDialog() {
  getDialog().close();
}

function closeQRDialog() {
  
  getDialog().close();
}