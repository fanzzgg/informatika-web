// dotenv hanya untuk lokal, di panel tidak dipakai
try { require('dotenv').config(); } catch (e) {}

const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');
const path = require('path');
const { setupAuth } = require('./auth');

const app = express();
// ⚠️ Pterodactyl kasih PORT dari env, biasanya 3000 atau random
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ⚠️ WAJIB untuk panel (di belakang proxy)
app.set('trust proxy', 1);

app.use(cookieSession({
  name: 'sess',
  keys: [process.env.SESSION_SECRET || 'default_secret_ganti_ya'],
  maxAge: 24 * 60 * 60 * 1000,
  secure: false,           // ⚠️ false karena panel pakai HTTP internal
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

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '../public/index.html')));

app.get('/health', (req, res) => res.json({ ok: true, port: PORT }));

// 🤖 Jalankan bot Telegram
if (process.env.BOT_TOKEN) {
  try {
    require('./bot/bot');
    console.log('🤖 Bot Telegram dijalankan');
  } catch (err) {
    console.error('❌ Gagal jalankan bot:', err.message);
  }
} else {
  console.log('⚠️ BOT_TOKEN kosong, bot tidak jalan');
}

// ⚠️ WAJIB listen di 0.0.0.0 untuk panel
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Server: http://0.0.0.0:${PORT}`);
});
