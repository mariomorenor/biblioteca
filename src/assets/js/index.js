const { Html5Qrcode } = require("html5-qrcode");
const moment = require("moment");
const Swal = require("sweetalert2");
window.$ = require("jquery");

const timeToResetCache = 60;
const timeToCleanInfo = 10;
const numHistoryRecords = 6;

const html5QrCode = new Html5Qrcode("reader");
Html5Qrcode.getCameras()
  .then((devices) => {
    if (devices && devices.length) {
      var cameraId = devices.filter((d) => d.label != "Droidcam")[0].id;

      return cameraId;
    }
  })
  .then((cameraId) => {
    const config = { fps: 10, qrbox: { width: 200, height: 200 } };

    html5QrCode.start(cameraId, config, qrCodeSuccessCallback);
  })
  .catch((err) => {
    console.log(err);
  });

var results = [];
var badResults = [];

const qrCodeSuccessCallback = (decodedText, decodedResult) => {
  /* handle success */
  try {
    let dataString = String(decodedText).replaceAll("'", '"');
    let userData = JSON.parse(dataString);
    let exist = results.some((u) => u.cedula == userData.cedula);

    if (!exist) {
      results.push(userData);
      sendData(userData);
      setTimeout(() => {
        removeFromCache(userData);
      }, timeToResetCache * 1000);
    }
  } catch (error) {
    let exist = badResults.some((qr) => qr == decodedText);
    if (!exist) {
      badResults.push(decodedText);
      badQR();
      setTimeout(() => {
        badResults = badResults.filter((qr) => qr != decodedText);
      }, 1 * 1500);
    }
  }
};

function sendData(user) {
  makeSound({ type: "success" });
  generateHistory(user);
  showInfo(user);
}

function removeFromCache(user) {
  results = results.filter((u) => u.cedula != user.cedula);
}

function badQR() {
  // Mostrar mensaje de QR Inválido
  makeSound({ type: "error" });
  Swal.fire({
    title: "Código QR Inválido",
    text: "El código que intenta escanear no es válido!",
    icon: "error",
    timer: 2000,
    showConfirmButton: false,
  });
  
}

function generateHistory(user) {
  const li = $("<li>")
    .addClass("list-group-item list-group-item-success")
    .append(
      `${user.nombres} ${user.apellidos} - ${moment().format("HH:mm:ss")}`
    );

  $("#records").prepend(li);
  if ($("#records").children().length > numHistoryRecords) {
    $("#records").children().last().remove();
  }
}

var resetInfoInterval = null;

function showInfo(user) {
  clearTimeout(resetInfoInterval);
  $("#name").val(user.nombres);
  $("#last_name").val(user.apellidos);
  $("#dni").val(user.cedula);
  $("#email").val(user.correo);
  resetInfoInterval = setTimeout(() => {
    $("#name").val("");
    $("#last_name").val("");
    $("#dni").val("");
    $("#email").val("");
  }, timeToCleanInfo * 1000);
}

function makeSound({ type }) {
  switch (type) {
    case "success":
      $("#sound")[0].pause();
      $("#sound")[0].currentTime = 0;
      $("#sound")[0].play();
      break;
    case "error":
      $("#error-sound")[0].pause();
      $("#error-sound")[0].currentTime = 0;
      $("#error-sound")[0].play();
      break;
  }
}
