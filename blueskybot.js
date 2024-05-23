import { BskyBot, Events } from 'easy-bsky-bot-sdk'
import { config } from './config.js'
import { mrDecisionBot } from './mrDecisionBot.js'

async function main() {
  BskyBot.setOwner({ handle: config.bluesky_owner, contact: config.bluesky_owner_contact })
  const bot = new BskyBot({ handle: config.bluesky_handle, replyToBots: true, replyToNonFollowers: true })
  await bot.login(config.bluesky_app_password)

  bot.setHandler(Events.MENTION, async ({ post }) => {
    let msg = post.text.replace('@' + config.bluesky_handle, '').trim()
    let reply = mrDecisionBot.discord(msg)
    if (reply !== null) await bot.reply(reply.a, post)
  })

  bot.setHandler(Events.REPLY, async ({ post }) => {
    let msg = post.text.replace('@' + config.bluesky_handle, '').trim()
    let reply = mrDecisionBot.discord(msg)
    if (reply !== null) await bot.reply(reply.a, post)
  })

  bot.startPolling()
}

main()
