// The server only handles api and auth requests.
// It should not be in charge of serving any files.
// I mean, it could, but we'll use nginx for that.

// node_module includes
const express     = require('express')();
const bodyParser  = require('body-parser');
const morgan      = require('morgan');
const passport    = require('passport');
const path        = require('path');

// custom includes
const models      = require('./models');
const dbconfig    = require('./config/config_database');
const logConfig   = require('./config/config_log');
const localSignup = require('./config/passport/config_local_signup');
const localLogin  = require('./config/passport/config_local_login');
const checkToken  = require('./middleware/middle_jwt').checkToken;
const authRoutes  = require('./routes/route_auth');
const apiRoutes   = require('./routes/route_api');

// local const
const port        = process.env.PORT || 8080;

// connect to the database
models.connect(dbconfig.uri);

// tell Express to parse HTTP body messages
express.use(bodyParser.urlencoded({ extended: false }));

// logger config
express.use(morgan(logConfig.format));

// passport config
express.use(passport.initialize());
passport.use('local-signup', localSignup);
passport.use('local-login', localLogin);

// authenticaion middleware
express.use('/api', checkToken);

// routes
express.use('/auth', authRoutes);
express.use('/api', apiRoutes);

// Always return the main index.html, so react-router renders the route in the client
// NOTE this goes away after development (handled by nginx)
express.get('*', (req, res) => { 
  res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'));
});

express.listen(port, () => {
    console.log(`Express listening on port ${port}!`);
});