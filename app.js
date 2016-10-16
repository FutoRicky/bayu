var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var redis = require('redis');
var client = null;
var fs = require('fs');

if(app.get('env') === 'production') {
  redis_conf = require("url").parse(process.env.REDISTOGO_URL);
  console.log(redis_conf);
  client = redis.createClient(redis_conf.port, redis_conf.hostname);
  client.auth(redis_conf.auth.split(":")[1]);
} else {
  client = redis.createClient();
}

client.on('connect', function() {
  client.flushdb("available_instruments", function(err, reply) {
    if (err) {
      console.log(err);
    } else {
      console.log(reply);
    }
  });

  fs.readFile("./seed.json", "utf8", function(err, data) {
    var seed = JSON.parse(data);

    seed["instruments"].forEach(function(instrument) {
      var name = Object.keys(instrument)[0];
      var instrument_data = new Array(instrument[name]["notes_urls"]);

      client.rpush(["available_instruments", name], function(err, reply) {
        if(err) {
          console.log(err);
        } else {
          console.log(reply);
        }
      })

      client.set(name, instrument_data.toString(), function(err, reply) {
        if(err) {
          console.log(err);
        } else {
          console.log(reply);
        }
      });
    })
  });

  console.log('connected');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(function(req, res, next){
  res.io = io;
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = {app: app, server: server};
