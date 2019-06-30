const video = document.getElementById('video')
var isPlaying = false;
document.getElementById("animationhappy").addEventListener("ended", function(){
  isPlaying = false;
}) 

document.getElementById("animationsad").addEventListener("ended", function(){
  isPlaying = false;
}) 

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {

  /*navigator.mediaDevices.getUserMedia (
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )*/
  //Garrits Änderung
  navigator.mediaDevices
      .getUserMedia({audio: false, video: true})
      .then(function(stream) {
        video.srcObject = stream;
      })
      .catch(function(err) {
        console.log(err.message);
      });
}

video.addEventListener('play', () => {
  // const canvas = faceapi.createCanvasFromMedia(video)
  // document.body.append(canvas)
  // const displaySize = { width: video.width, height: video.height }
  // faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()

    if (detections.length > 0 && !isPlaying) {
        if(detections[0].expressions.sad > 0.7){
          console.log('sad');
          document.getElementById("animationsad").play() 
          isPlaying = true;

          document.getElementById("animationsad").style.display = "block"

          document.getElementById("animationhappy").style.display = "none"

        }else if(detections[0].expressions.happy > 0.7){
          console.log('happy');
          document.getElementById("animationhappy").play()
          isPlaying = true;

          document.getElementById("animationhappy").style.display = "block"

          document.getElementById("animationsad").style.display = "none"
        }


      
      //console.log(detections[0].expressions);
      }
      //print("Hello World")
      //console.log("hello world");
      //console.log(detections[1].expressions)
      // FACE_EXPRESSION_LABELS = ['helloworld', 'happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised'];
      //   if(FACE_EXPRESSION_LABELS[1]){
         
    
      //     console.log("HAPPY");
        
          
      //   }
      
      // if(detections.length[1]){
      //   console.log("HAPPY");
      // }
      
      // if (detections.length//returns the length of an array, a string, or the number of parameters expected by a function
      //   >
      //   0.99) {
      //     console.log('happy');
      //   }
      

    // const resizedDetections = faceapi.resizeResults(detections, displaySize)
    // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    // faceapi.draw.drawDetections(canvas, resizedDetections)
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 500)
})