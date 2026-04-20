let stuff_org_address = window.location.protocol + "//" + window.location.hostname + "/stuff";
let camera_button = document.querySelector("#start-camera");
let video = document.querySelector("#video");
let canvas = document.querySelector("#canvas");
let picture = canvas.getContext('2d') // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D

const urlParams = new URLSearchParams(window.location.search);
let photoId = urlParams.get('id')
console.log(photoId);
if (!photoId) { console.error('id param not found') } else {
  photoId = photoId.replace(/[^\d]+/g, 'b') // replace any nondigit characters with letter b
  photoId = photoId.slice(0, 10) // only keep the first ten characters of photoId
  console.log(photoId);
}

document.addEventListener("DOMContentLoaded", async function() {
  let stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 640, facingMode: "environment" }, audio: false });
  video.srcObject = stream; // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
});

video.addEventListener('click', function() {
  picture.drawImage(video, 0, 0, canvas.width, canvas.height);
}); // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement

canvas.addEventListener('click', function() {
  canvas.toBlob(function(blob) {
    let fileName = photoId+'.jpg'
    file = new File([blob], fileName, { type: 'image/jpeg' });
    let data = new FormData();

    data.append('file', file); // why is this here?

    let request = new XMLHttpRequest();
    request.open('POST', 'uploadpic'); // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
    request.addEventListener('loadend', function(e) {
      console.log("res:",request.response);
      if (request.response == "ok") { // this only happens if the server did res.status(200).send('ok');
        picture.font = "75px serif";
        picture.fillStyle = '#FFFFFF';
        picture.fillText("image saved as:", 5, 100);
        picture.fillText(fileName, 5, 200);
        window.location.href = stuff_org_address + "/form?id=" + photoId; // send us back to stuff-org at the correct URL
      } else {
        picture.font = "75px serif";
        picture.fillStyle = '#FF0000';
        picture.fillText("ERROR! See console.log", 5, 100);
      }
    });
    request.send(data);
  }, 'image/jpeg');
});
