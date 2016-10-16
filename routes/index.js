var express = require('express');
var router = express.Router();
var redis = require('redis');

/* GET home page. */
router.get('/', function(req, res, next) {
  var client = redis.createClient();

  client.lrange("available_instruments", 0, -1, function(err, instruments) {
    if (instruments.length == 0) {
      res.render('index', { title: 'Express', notes: [] });
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

        res.render('index', { title: 'Express', notes: notes, instrument: selected_instrument });
      })
    }
  });
});

module.exports = router;
