// The server only handles api and auth requests.
// It should not be in charge of serving any files.
// I mean, it could, but we'll use nginx for that.

// pacakge includes
const express     = require('express');
const morgan      = require('morgan');
const path        = require('path');
const mongoose    = require('mongoose');
const passport    = require('passport');
const bodyParser  = require('body-parser');

// custom includes
const dbconfig    = require('./config/database');
const models      = require('./models');

// local const
const app         = express();
const port        = process.env.PORT || 8080;

// connect to the database
models.connect(dbconfig.uri);

// parse HTTP body messages
app.use(bodyParser.urlencoded({ extended: false }));

// logger config
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// passport config
app.use(passport.initialize());
const localSignupStrategy = require('./config/passport/local-signup');
const localLoginStrategy = require('./config/passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

// authenticaion middleware
const authMiddleware = require('./middleware/auth');
app.use('/api', authMiddleware);

// routes
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Always return the main index.html, so react-router render the route in the client
// NOTE this goes away after development
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
