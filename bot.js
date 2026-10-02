require('dotenv').config();
const { Telegraf } = require('telegraf');
const registerCommands = require('./commands');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Middleware log
bot.use(async (ctx, next) => {
  const t = new Date().toISOString();
  console.log(`[${t}] ${ctx.from?.username || ctx.from?.id}: ${ctx.message?.text || ''}`);
  await next();
});

registerCommands(bot);

bot.launch();
console.log('🤖 Bot Telegram aktif...');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));