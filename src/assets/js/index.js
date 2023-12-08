const { Html5Qrcode } = require("html5-qrcode");

const html5QrCode = new Html5Qrcode("reader");


const qrCodeSuccessCallback = (decodedText, decodedResult) => {
  /* handle success */
    console.log(decodedText);

};

const config = { fps: 2, qrbox: { width: 250, height: 250 } };

html5QrCode.start({ facingMode: "user" }, config, qrCodeSuccessCallback);
