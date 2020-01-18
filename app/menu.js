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

function showQRDialog(url) {
  if(!isTouch()) {
    document.getElementById("camera").components
      .mylookcontrols.movementMode = true;
  }
  var dialog = getDialog();
  dialog.showModal();
  document.getElementById("modal-text").innerText = "QR Code";
  
  var imageElem = document.getElementById("qr-code");
  imageElem.innerHTML = "";
  var img = document.createElement('img'); 
  img.src = 'https://cdn.glitch.com/dff38557-346e-4aa3-94d5-969225a03cf0%2FTeam009QRCode.png?v=1579278312151'; 
  imageElem.appendChild(img);
  
  var buttonsElem = document.getElementById("modal-buttons");
  buttonsElem.innerHTML = "";
  
  var copyURLbutton = document.createElement("button");
  copyURLbutton.setAttribute("class", "mdl-button");
  copyURLbutton.setAttribute("type", "button");
  copyURLbutton.innerText = "Copy link";
  copyURLbutton.onclick = copyLink.bind(this, url);
  buttonsElem.appendChild(copyURLbutton);
  
  var closeButton = document.createElement("button");
  closeButton.setAttribute("class", "mdl-button");
  closeButton.setAttribute("type", "button");
  closeButton.innerText = "Close";
  closeButton.onclick = closeDialog;
  buttonsElem.appendChild(closeButton);
}

function closeDialog() {
  getDialog().close();
}

function copyLink(url) {
  navigator.clipboard.writeText(url)/* who cares about that .then(function() {
    // clipboard successfully set
  }, function() {
    // clipboard write failed
  });
  */
  //getDialog().close();
  closeDialog();
}