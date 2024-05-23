import { discord_token } from './config.js'
import { mrDecisionBot } from './mrDecisionBot.js'
import { Client, GatewayIntentBits } from 'discord.js'
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent],
})

client.login(discord_token)

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('messageCreate', (msg) => {
  let reply = mrDecisionBot.discord(msg.content)
  if (reply !== null) msg.reply(reply.a)
})
