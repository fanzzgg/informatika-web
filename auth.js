const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

function setupAuth(passport) {
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
  }, (accessToken, refreshToken, profile, done) => {
    const user = {
      id: profile.id,
      provider: 'google',
      name: profile.displayName,
      email: profile.emails?.[0]?.value,
      photo: profile.photos?.[0]?.value
    };
    return done(null, user);
  }));

  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK
  }, (accessToken, refreshToken, profile, done) => {
    const user = {
      id: profile.id,
      provider: 'github',
      name: profile.displayName || profile.username,
      username: profile.username,
      email: profile.emails?.[0]?.value,
      photo: profile.photos?.[0]?.value
    };
    return done(null, user);
  }));
}

module.exports = { setupAuth };