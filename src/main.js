const express = require('express');
const bodyParser = require('body-parser');
const router = require('./router');
const mongoose = require('mongoose');
const fs = require( 'fs' );
const path = require('path');
const winston = require('winston');
let port = 3000;

run();

function run() {
  mongoose.connect('mongodb://localhost/frontcamp', { useNewUrlParser: true } );
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    var app = configureApp();
    app.listen(port, function() {
      console.log('Application running on port ' + port);
    });
});
}

function configureApp() {
  let app = express();
  let logger = createLogger();
  let logRequest = createRequestLogMiddleware(logger);

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname));

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(logRequest);
  app.use('/blogs', router);
  app.use(handleUnknownRoute);
  app.use(logErrors);
  app.use(clientErrorHandler);

  return app;
}

function createRequestLogMiddleware(logger) {
  return function(req, res, next) {
    var currentDate = new Date(Date.now()).toLocaleString();
    logger.info('request recieved', { url: req.originalUrl, method: req.method, date: currentDate });
    next();
  }
}

function handleUnknownRoute(req, res) {
  res.render('index', {
    url: req.originalUrl,
    method: req.method
  });
}

function logErrors (err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler (err, req, res, next) {
  console.log(err);
  res.status(500).send({ error: err.message })
}

function createLogger() {
  const logDirectory = 'logs';
  if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory);
  }

  let logger = winston.createLogger({
    level: 'info',
    transports: [
      new winston.transports.File({ filename: path.join(logDirectory, 'requestInfo.log') })
    ]
  });

  return logger;
}
