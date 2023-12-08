const { Html5Qrcode } = require("html5-qrcode");

const html5QrCode = new Html5Qrcode("reader");


Html5Qrcode.getCameras().then(devices => {

  if (devices && devices.length) {

    var cameraId = devices.filter(d => d.label != "Droidcam")[0].id;

    return cameraId;
  }

})
  .then((cameraId) => {

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    html5QrCode.start(cameraId, config, qrCodeSuccessCallback);

  })
  .catch(err => {
    console.log(err);
  });


const results = [];

const qrCodeSuccessCallback = (decodedText, decodedResult) => {
  /* handle success */
  console.log(decodedText);

  
  
};
