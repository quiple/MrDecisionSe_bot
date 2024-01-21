const { BskyBot, Events } = require('easy-bsky-bot-sdk')
const config = require('./config.js')
const mrDecisionBot = require('./mrDecisionBot.js')

async function main() {
  BskyBot.setOwner({ handle: config.bluesky_owner, contact: config.bluesky_owner_contact })
  const bot = new BskyBot({ handle: config.bluesky_handle, replyToBots: true, replyToNonFollowers: true })
  await bot.login(config.bluesky_app_password)

  bot.setHandler(Events.MENTION, async ({ post }) => {
    let msg = post.text.replace('@' + config.bluesky_handle, '').trim()
    let reply = mrDecisionBot.discord(msg)
    if (reply !== null) {
      await bot.reply(reply.a, post)
    }
  })

  bot.startPolling()
}

main()
