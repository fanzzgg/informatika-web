const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

function setupAuth(passport) {
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  // Google (opsional)
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK || '/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
      return done(null, {
        id: profile.id,
        provider: 'google',
        name: profile.displayName,
        email: profile.emails?.[0]?.value,
        photo: profile.photos?.[0]?.value
      });
    }));
    console.log('✅ Google OAuth aktif');
  } else {
    console.log('⚠️ Google OAuth OFF (credentials kosong)');
  }

  // GitHub (opsional)
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK || '/auth/github/callback'
    }, (accessToken, refreshToken, profile, done) => {
      return done(null, {
        id: profile.id,
        provider: 'github',
        name: profile.displayName || profile.username,
        username: profile.username,
        email: profile.emails?.[0]?.value,
        photo: profile.photos?.[0]?.value
      });
    }));
    console.log('✅ GitHub OAuth aktif');
  } else {
    console.log('⚠️ GitHub OAuth OFF (credentials kosong)');
  }
}

module.exports = { setupAuth };
