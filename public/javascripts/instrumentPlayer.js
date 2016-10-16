var socket = io('//localhost:3000');
// var socket = io('https://bayu-orch.herokuapp.com');
var context = new AudioContext(); // AudioContext object instance

$('document').ready(function() {
  visualize();
})

socket.on('socketToMe', function(data) {
  var audio = new Audio();
  var analyser = context.createAnalyser(); // AnalyserNode method
  // Re-route audio playback into the processing graph of the AudioContext
  var source = context.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(context.destination);

  var lengthNow = analyzers.length;
  analyzers.push(analyser);
  audio.onended = function() {
    console.log("audio ended", "analyzers length: ", analyzers.length, "lengthNow: ", lengthNow);
    audios.splice(audios.indexOf(audio), 1);
    analyzers.splice(audios.indexOf(audio), 1);
  }
  audios.push(audio);

  audio.src = '/assets/sounds/' + data
  audio.play();
});

function playNote(url) {
  $.ajax({
    url: "/users?note=" + url,
    type: "GET",
  });
};
