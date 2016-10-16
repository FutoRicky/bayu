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

  client.rpop("available_instruments", function(err, instrument) {
    console.log(err);
    console.log(instrument);
    if (err || instrument == null) {
      res.render('index', { notes: [], status: 'Spectator', instrument: '' });
    } else {
      client.get(instrument, function(er, reply) {
        if (er) {
          console.log(er);
        } else {
          var notes = reply.split(",")

          client.quit();
          res.render('index', { notes: notes, status: 'Instrument: ', instrument: instrument });
        }
      });
    }
    
  });
});

module.exports = router;
