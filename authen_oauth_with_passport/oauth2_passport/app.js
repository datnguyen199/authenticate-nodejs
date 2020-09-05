require('dotenv').config();
const express = require('express');
const app = express();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieSession = require('cookie-session');
const PORT = process.env.PORT || 8080;
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(cookieSession({
  maxAge: 24*60*60*1000,
  keys: ['randomstring']
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:8080/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

function isAuthenticated(req, res, next) {
  if(req.user) {
    next();
  } else {
    res.send('please login!');
  }
}

app.get('/', (req, res) => {
  res.render('index.ejs', { message: null });
});

app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile']
}));

app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
  res.redirect('/authenticated')
});

app.get('/authenticated', isAuthenticated, (req, res) => {
  res.send('you are authenticated!');
});

app.get('/logout', (req, res) => {
  req.logOut();
  res.render('index.ejs', { message: 'you have been loged out!' });
})

app.listen(PORT, () => {
  console.log("server is listening on port " + PORT);
});
