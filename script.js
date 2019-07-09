/*unser Video Element*/ 
const video = document.getElementById('video')
var isPlaying = false;
/*hier wird ein Event Listener hinzugefügt, sobald die Animation Happy beendet wurde - wird der "isPlaying" Wert auf false gesetzt, das Video wird also aktuell nicht abgespielt */
document.getElementById("animationhappy").addEventListener("ended", function(){
  isPlaying = false;
}) 
/*hier wird ein Event Listener hinzugefügt, sobald die Animation Sad beendet wurde - wird der "isPlaying" Wert auf false gesetzt, das Video wird also aktuell nicht abgespielt */
document.getElementById("animationsad").addEventListener("ended", function(){
  isPlaying = false;
}) 
/*die Models müssen geladen werden, damit das Gesicht erkannt werden kann und nicht einfach nur das Video gerendert wird*/
Promise.all([
  /*diese vier Modelle sind zur Gesichtserkennung sowie Analyse erforderlich*/
  /*tinyFaceDetector ist kleiner und schneller als ein normaler Gesichtsdetektor und benötigt daher weniger Zeit, um im Browser zu laden*/
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  /*faceLandmark68 registriert die verschiedenen Gesichtskomponenten wie Nase, Mund, Augen*/
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  /*faceRecognition ermöglicht der API zu erkennen, wo sich die Fläche des Gesichtes befindet und die Box, die es umgibt*/
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  /*faceExpression ist das wichtigste Model, es erkennt, ob die Person traurig, glücklich, etc. ist*/ 
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
  /*nachdem die Models geladen wurden, kann das Video starten*/ 
]).then(startVideo)

/*verbindet die Webcam mit dem Videoelement*/ 
function startVideo() {

  /*navigator.mediaDevices.getUserMedia (
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )*/
  //Garrits Änderung
  /*"Navigator.mediaDevices" gibt ein MediaDevices-Objekt zurück, das den Zugriff auf angeschlossene Medieneingabegeräte wie Kameras und Mikrofone sowie die Bildschirmfreigabe ermöglicht */
  navigator.mediaDevices
      /*"MediaDevices.getUserMedia()" gibt die Aufforderung eine Medieneingabe zu verwenden, die einen MediaStream erzeugt*/
      /*der Stream kann eine Video- oder Audioquelle beinhalten*/
      /*wir möchten jedoch keinen Audiostream erstellen, sondern einen Videostream*/
      .getUserMedia({audio: false, video: true})
      .then(function(stream) {
        video.srcObject = stream;
      })
      /*sobald ein Fehler vorhanden ist, soll dieser in der Console ausgegeben werden*/
      .catch(function(err) {
        console.log(err.message);
      });
}
/*hier wird ein Event Listener hinzugefügt, sobald das Video abgespielt wird*/
video.addEventListener('play', () => {
  // const canvas = faceapi.createCanvasFromMedia(video)
  // document.body.append(canvas)
  // const displaySize = { width: video.width, height: video.height }
  // faceapi.matchDimensions(canvas, displaySize)
  /*set Interval, um den Code mehrfach in einer Reihe ausführen zu können*/
  setInterval(async () => {
    /*alle Gesichter, die sich in der Kamera befinden sollen erkannt werden*/
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    /*sobald mehr als 0 Personen erkannt werden und gerade keine Videodatei abgespielt wird, soll die Emotion Sad (Traurig) getrackt werden, ist der Schwellenwert mehr als 0.7, soll in der Console 'sad' ausgegeben werden und die Animation Sad (Traurig) abgespielt werden */
    if (detections.length > 0 && !isPlaying) {
        if(detections[0].expressions.sad > 0.7){
          console.log('sad');
          document.getElementById("animationsad").play() 
          isPlaying = true;

          document.getElementById("animationsad").style.display = "block"

          document.getElementById("animationhappy").style.display = "none"
        /*sobald mehr als 0 Personen erkannt werden und die Emotion Sad (Traurig) nicht getrackt wurde, soll die Emotion Happy getrackt werden, ist der Schwellenwert mehr als 0.7, soll in der Console 'happy' ausgegeben werden und die Animation Sad Happy abgespielt werden */  
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

    /*alle 500 Millisekunden (0,5 Sekunden) wird der Code aufgerufen*/
  }, 500)
})