// The server only handles api and auth requests.
// It should not be in charge of serving any files.
// I mean, it could, but we'll use nginx for that.

// node_module includes
const express     = require('express')();
const bodyParser  = require('body-parser');
const morgan      = require('morgan');
const path        = require('path');
const fs          = require('fs');
const rfs         = require('rotating-file-stream');

// custom includes
const models      = require('./models');
const dbconfig    = require('./config/config_database');
const logConfig   = require('./config/config_log');
const checkToken  = require('./middleware/middle_jwt').checkToken;
const authRoutes  = require('./routes/route_auth');
const apiRoutes   = require('./routes/route_api');

// local const
const port        = process.env.PORT || 3000;

// connect to the database
models.connect(dbconfig.uri);

// tell Express to parse HTTP body messages
express.use(bodyParser.urlencoded({ extended: false }));
express.use(bodyParser.json());

// create logs directory
fs.existsSync(logConfig.directory) || fs.mkdirSync(logConfig.directory);

// use a rotating write stream
const accessLogStream = rfs('access.log', {
  interval: logConfig.interval, // rotate daily
  path: logConfig.directory,
  maxFiles: logConfig.maxFiles
});

// initialize logger
express.use(morgan('combined', { stream: accessLogStream }));

// authenticaion middleware
express.use('/api', checkToken);

// top-level routes
express.use('/auth', authRoutes);
express.use('/api', apiRoutes);

if (express.get('env') === 'development') {
  express.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err,
    });
  });
}
else {
  // production error handler
  // no stacktraces leaked to user
  express.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
      });
  });
}

express.listen(port, () => {
    console.log(`Express listening on port ${port}!`);
});
