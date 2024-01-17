const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const config = require("./config.js");
client.login(config.discord_token);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const mrDecisionBot = require("./mrDecisionBot.js");
client.on("messageCreate", (msg) => {
  /* Discord wrapper */
  let reply = mrDecisionBot.discord(msg.content);
  if (reply !== null) {
    console.log(reply);
    msg.reply(reply.a);
  }
});
