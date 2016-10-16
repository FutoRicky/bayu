// var socket = io('//localhost:3000');
var socket = io('https://bayu-orch.herokuapp.com');
var audio = new Audio();

$('document').ready(function() {
  visualize(audio);
})

socket.on('socketToMe', function(data) {
  audio.src = '/assets/sounds/' + data
  audio.play();
});
