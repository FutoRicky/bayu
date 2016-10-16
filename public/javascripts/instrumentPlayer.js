var socket = io('//localhost:3000');
socket.on('socketToMe', function(data) {
  var audio = new Audio();
  audio.src = '/assets/sounds/' + data
  audio.play();
});
