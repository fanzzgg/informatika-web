const { Telegraf } = require('telegraf');
const registerCommands = require('./commands');

if (!process.env.BOT_TOKEN) {
  console.log('⚠️ BOT_TOKEN tidak diset, bot tidak jalan');
  module.exports = null;
} else {
  const bot = new Telegraf(process.env.BOT_TOKEN);

  bot.use(async (ctx, next) => {
    console.log(`[${new Date().toISOString()}] ${ctx.from?.username || ctx.from?.id}: ${ctx.message?.text || ''}`);
    await next();
  });

  registerCommands(bot);

  bot.catch((err, ctx) => {
    console.error(`❌ Error untuk ${ctx.updateType}:`, err.message);
  });

  bot.launch()
    .then(() => console.log('🤖 Bot Telegram aktif'))
    .catch(err => console.error('❌ Bot gagal launch:', err.message));

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  module.exports = bot;
}
