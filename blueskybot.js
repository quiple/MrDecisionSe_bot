import { BskyBot, Events } from 'easy-bsky-bot-sdk'
import { bluesky_owner, bluesky_owner_contact, bluesky_handle, bluesky_app_password } from './config.js'
import { mrDecisionBot } from './mrDecisionBot.js'

async function main() {
  BskyBot.setOwner({ handle: bluesky_owner, contact: bluesky_owner_contact })
  const bot = new BskyBot({ handle: bluesky_handle, replyToBots: true, replyToNonFollowers: true })
  await bot.login(bluesky_app_password)

  bot.setHandler(Events.MENTION, async ({ post }) => {
    let msg = post.text.replace('@' + bluesky_handle, '').trim()
    let reply = mrDecisionBot.discord(msg)
    if (reply !== null) await bot.reply(reply.a, post)
  })

  bot.setHandler(Events.REPLY, async ({ post }) => {
    let msg = post.text.replace('@' + bluesky_handle, '').trim()
    let reply = mrDecisionBot.discord(msg)
    if (reply !== null) await bot.reply(reply.a, post)
  })

  bot.startPolling()
}

main()
