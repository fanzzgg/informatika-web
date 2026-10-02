require('dotenv').config();
const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');
const path = require('path');
const { setupAuth } = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ⚠️ WAJIB untuk Render (HTTPS reverse proxy)
app.set('trust proxy', 1);

app.use(cookieSession({
  name: 'sess',
  keys: [process.env.SESSION_SECRET || 'default_secret_ganti_ya'],
  maxAge: 24 * 60 * 60 * 1000,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax'
}));

app.use(passport.initialize());
app.use(passport.session());
setupAuth(passport);

// Auth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login.html' }),
  (req, res) => res.redirect('/index.html'));

app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login.html' }),
  (req, res) => res.redirect('/index.html'));

app.get('/api/me', (req, res) => res.json(req.user || null));

app.get('/api/logout', (req, res) => {
  req.logout(() => res.redirect('/login.html'));
});

function requireAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

app.get('/api/materi', requireAuth, (req, res) => {
  res.json({ ok: true, user: req.user });
});

app.get('/', (req, res) => 
  res.sendFile(path.join(__dirname, '../public/index.html')));

// Health check untuk Render
app.get('/health', (req, res) => res.json({ ok: true }));

// 🔥 GABUNG BOT DI SINI — biar jalan bareng web
if (process.env.BOT_TOKEN) {
  try {
    require('./bot/bot');
    console.log('🤖 Bot Telegram dijalankan bersamaan dengan web');
  } catch (err) {
    console.error('❌ Gagal jalankan bot:', err.message);
  }
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Server running on port ${PORT}`);
});
