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

  analyzers.push(analyser)

  audio.src = '/assets/sounds/' + data
  audio.play();
});

window.onbeforeunload = function() {
	$.post('/users/fluta');
	return null;
};
