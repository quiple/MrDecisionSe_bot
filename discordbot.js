const config = require('./config.js');
const mrDecisionBot = require('./mrDecisionBot.js');
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent],
});

client.login(config.discord_token);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (msg) => {
  /* Discord wrapper */
  let reply = mrDecisionBot.discord(msg.content);
  if (reply !== null) {
    console.log(reply);
    msg.reply(reply.a);
  }
});
