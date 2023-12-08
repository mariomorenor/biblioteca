async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({video:true});
    const video = document.getElementById("camera");

    video.srcObject = stream;
    video.play();
}

startCamera();