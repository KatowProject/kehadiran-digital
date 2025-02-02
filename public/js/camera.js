import QrScanner from "https://unpkg.com/qr-scanner@1.4.2/qr-scanner.min.js";

const video = document.getElementById("video");
const cameraSelect = document.getElementById("cameraSelect");

let currentStream;
let qrScanner;
let isRequestInProgress = false;

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

const requestCameraPermission = () => {
    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
            stream.getTracks().forEach((track) => track.stop());
            getCameras();
        })
        .catch((error) => {
            console.error("Error requesting camera permission: ", error);
        });
};


cameraSelect.addEventListener("change", () => {
    startVideo(cameraSelect.value);
});

const handleQrCode = async (result) => {
    if (isRequestInProgress) return;
    console.log(result);

    isRequestInProgress = true;

    try {
        const req = await fetch("/api/attend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: result }),
        });

        const res = await req.json();
        if (res.success) {
            Swal.fire({
                title: "Success",
                text: res.message,
                icon: "success",
                confirmButtonText: "OK",
                timer: 3000,
                willClose: () => {
                    isRequestInProgress = false;
                }
            });
        } else {
            Swal.fire({
                title: "Error",
                text: res.message,
                icon: "error",
                confirmButtonText: "OK",
                timer: 3000,
                willClose: () => {
                    isRequestInProgress = false;
                }
            });
        }
    } catch (error) {
        console.log(error);
        Swal.fire({
            title: "Error",
            text: "Internal Server Error",
            icon: "error",
            confirmButtonText: "OK",
            timer: 3000,
            willClose: () => {
                isRequestInProgress = false;
            }
        });
    }
};

requestCameraPermission();