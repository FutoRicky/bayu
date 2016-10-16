var express = require('express');
var router = express.Router();
var redis = require('redis');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.io.emit("socketToMe", req.query.note);
  res.send('respond with a resource');
});

router.post('/:instrument', function(req, res, next) {
  var client = redis.createClient();

  client.lrange("available_instruments", 0, -1, function(err, instruments) {
    instruments.push(req.params.instrument);
    instruments.unshift("available_instruments");

    client.del("available_instruments", function(err, reply) {
      client.rpush(instruments, function(err, reply) {
        if (err) {
          console.log(err);
        } else {
          console.log(reply);
        }
      });
    });
  });
});

module.exports = router;
