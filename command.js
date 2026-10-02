const axios = require('axios');
const QRCode = require('qrcode');

module.exports = function registerCommands(bot) {
  bot.start((ctx) => ctx.reply(
    `Halo ${ctx.from.first_name}! 👋\n\n` +
    `Saya bot Informatika. Coba:\n` +
    `/help - daftar perintah\n` +
    `/materi - daftar materi TIK\n` +
    `/qrcode <teks> - buat QR\n` +
    `/wiki <kata> - cari di Wikipedia\n` +
    `/kurs - kurs USD-IDR\n` +
    `/cuaca <kota> - info cuaca\n` +
    `/id - info user\n` +
    `/ping - cek bot`
  ));

  bot.help((ctx) => ctx.reply(
    `📚 *Perintah tersedia:*\n` +
    `/materi - Materi TIK\n` +
    `/qrcode <teks>\n` +
    `/wiki <query>\n` +
    `/kurs\n` +
    `/cuaca <kota>\n` +
    `/id\n` +
    `/ping`,
    { parse_mode: 'Markdown' }
  ));

  bot.command('ping', (ctx) => ctx.reply(`🏓 Pong! ${Date.now() - ctx.message.date * 1000}ms`));

  bot.command('id', (ctx) => {
    const f = ctx.from;
    ctx.reply(
      `🆔 ID: \`${f.id}\`\n` +
      `👤 Nama: ${f.first_name} ${f.last_name || ''}\n` +
      `🔗 Username: @${f.username || '-'}\n` +
      `🌐 Bahasa: ${f.language_code}`,
      { parse_mode: 'Markdown' }
    );
  });

  bot.command('materi', (ctx) => ctx.reply(
    `📚 *Materi TIK tersedia:*\n` +
    `1. Pengenalan Komputer\n` +
    `2. Sistem Operasi\n` +
    `3. Microsoft Office\n` +
    `4. Internet & Jaringan\n` +
    `5. Pemrograman Dasar\n` +
    `6. Basis Data\n` +
    `7. Multimedia\n` +
    `8. Keamanan Siber\n` +
    `9. Algoritma & Flowchart\n\n` +
    `Buka: http://localhost:3000/materi.html`,
    { parse_mode: 'Markdown' }
  ));

  bot.command('qrcode', async (ctx) => {
    const text = ctx.message.text.split(' ').slice(1).join(' ');
    if (!text) return ctx.reply('⚠️ Contoh: /qrcode https://google.com');
    try {
      const buffer = await QRCode.toBuffer(text, { width: 512, margin: 2 });
      await ctx.replyWithPhoto({ source: buffer }, { caption: `✅ QR untuk: ${text}` });
    } catch (e) {
      ctx.reply('❌ Gagal buat QR: ' + e.message);
    }
  });

  bot.command('wiki', async (ctx) => {
    const q = ctx.message.text.split(' ').slice(1).join(' ');
    if (!q) return ctx.reply('⚠️ Contoh: /wiki Indonesia');
    try {
      const { data } = await axios.get(
        `https://id.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`
      );
      if (!data.extract) return ctx.reply('❌ Tidak ditemukan.');
      await ctx.replyWithPhoto(data.thumbnail?.source || undefined, {
        caption: `📖 *${data.title}*\n\n${data.extract}\n\n🔗 ${data.content_urls?.desktop?.page || ''}`,
        parse_mode: 'Markdown'
      }).catch(async () => {
        await ctx.reply(
          `📖 *${data.title}*\n\n${data.extract}\n\n🔗 ${data.content_urls?.desktop?.page || ''}`,
          { parse_mode: 'Markdown' }
        );
      });
    } catch {
      ctx.reply('❌ Gagal ambil data Wikipedia.');
    }
  });

  bot.command('kurs', async (ctx) => {
    try {
      const { data } = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
      const idr = data.rates.IDR;
      const sgd = data.rates.SGD;
      const myr = data.rates.MYR;
      ctx.reply(
        `💱 *Kurs Hari Ini:*\n` +
        `1 USD = Rp ${idr.toLocaleString('id-ID')}\n` +
        `1 USD = ${sgd} SGD\n` +
        `1 USD = ${myr} MYR`,
        { parse_mode: 'Markdown' }
      );
    } catch {
      ctx.reply('❌ Gagal ambil kurs.');
    }
  });

  bot.command('cuaca', async (ctx) => {
    const kota = ctx.message.text.split(' ').slice(1).join(' ');
    if (!kota) return ctx.reply('⚠️ Contoh: /cuaca Jakarta');
    try {
      const { data } = await axios.get(
        `https://wttr.in/${encodeURIComponent(kota)}?format=j1`
      );
      const cur = data.current_condition[0];
      ctx.reply(
        `🌤️ *Cuaca ${kota}*\n\n` +
        `🌡️ Suhu: ${cur.temp_C}°C (terasa ${cur.FeelsLikeC}°C)\n` +
        `💧 Kelembapan: ${cur.humidity}%\n` +
        `💨 Angin: ${cur.windspeedKmph} km/h\n` +
        `📝 ${cur.weatherDesc[0].value}`,
        { parse_mode: 'Markdown' }
      );
    } catch {
      ctx.reply('❌ Kota tidak ditemukan.');
    }
  });

  // Handler teks biasa
  bot.on('text', (ctx) => {
    if (ctx.message.text.startsWith('/')) return;
    ctx.reply('💡 Ketik /help untuk melihat perintah.');
  });
};
