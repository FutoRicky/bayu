var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.io.emit("socketToMe", "flute/G.mp3");
  res.send('respond with a resource');
});

router.post('/:instrument', function(req, res, next) {
  console.log(req.params.instrument);
});

module.exports = router;
