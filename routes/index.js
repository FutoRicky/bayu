var express = require('express');
var router = express.Router();
var redis = require('redis');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(process.env.REDISTOGO_URL) {
    redis_conf = require("url").parse(process.env.REDISTOGO_URL);
    console.log(redis_conf);
    client = redis.createClient(redis_conf.port, redis_conf.hostname);
    client.auth(redis_conf.auth.split(":")[1]);
  } else {
    client = redis.createClient();
  }

  client.lrange("available_instruments", 0, -1, function(err, instruments) {
    if (instruments.length == 0) {
      res.render('index', { notes: [], status: 'Spectator', instrument: '' });
    } else {
      var selected_instrument = instruments.pop();

      client.get(selected_instrument, function(err, reply) {
        var notes = reply.split(",")
        instruments.unshift("available_instruments");

        client.del("available_instruments", function(err, reply) {
          client.rpush(instruments, function(err, reply) {
           if(err) {
            console.log(err);
           } else {
            console.log(reply);
           }
          });
        });

        client.end(true);
        res.render('index', { notes: notes, status: 'Instrument: ', instrument: selected_instrument });
      })
    }
  });
});

module.exports = router;
