import QrScanner from "https://unpkg.com/qr-scanner@1.4.2/qr-scanner.min.js";

const video = document.getElementById("video");
const cameraSelect = document.getElementById("cameraSelect");

let currentStream;
let qrScanner;

const startVideo = (deviceId) => {
    if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
    }

    if (deviceId) {
        navigator.mediaDevices
            .getUserMedia({
                video: { deviceId: { exact: deviceId } },
            })
            .then((stream) => {
                currentStream = stream;
                video.srcObject = stream;
                video.play();
                if (qrScanner) {
                    qrScanner.destroy();
                }
                qrScanner = new QrScanner(video, (result) => handleQrCode(result));
                qrScanner.start();
            })
            .catch((error) => {
                console.error("Error accessing the camera: ", error);
            });
    } else {
        if (qrScanner) {
            qrScanner.stop();
            qrScanner.destroy();
            qrScanner = null;
        }
        video.srcObject = null;
    }
};

const getCameras = () => {
    navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
            const videoDevices = devices.filter(
                (device) => device.kind === "videoinput"
            );
            cameraSelect.innerHTML = '<option value="">Select a camera</option>';
            videoDevices.forEach((device, index) => {
                const option = document.createElement("option");
                option.value = device.deviceId;
                option.text = device.label || `Camera ${index + 1}`;
                cameraSelect.appendChild(option);
            });
        })
        .catch((error) => {
            console.error("Error enumerating devices: ", error);
        });
};

cameraSelect.addEventListener("change", () => {
    startVideo(cameraSelect.value);
});

const handleQrCode = async (result) => {
    if (qrScanner) qrScanner.stop();

    console.log(result);

    // run 
};

getCameras();