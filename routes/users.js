var express = require('express');
var router = express.Router();
var redis = require('redis');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.io.emit("socketToMe", req.query.note);
  res.send('respond with a resource');
});

router.post('/:instrument', function(req, res, next) {
  if(process.env.REDISTOGO_URL) {
    redis_conf = require("url").parse(process.env.REDISTOGO_URL);
    console.log(redis_conf);
    client = redis.createClient(redis_conf.port, redis_conf.hostname);
    client.auth(redis_conf.auth.split(":")[1]);
  } else {
    client = redis.createClient();
  }

  var instrument = req.params.instrument;

  client.rpush(["available_instruments", instrument], function(err, reply) {
    if (err) {
      console.log(err);
    } else {
      console.log(reply);
    }

    client.end(true);
  });
});

module.exports = router;
