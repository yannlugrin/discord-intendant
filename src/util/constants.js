exports.DefaultSettings = {
  prefix: process.env.DISCORD_BOT_PREFIX || '!',
  token: process.env.DISCORD_BOT_TOKEN,
  databaseURL: process.env.DATABASE_URL,

  [Symbol.iterator]: function * () {
    for (const key in this) {
      yield [key, this[key]]
    }
  }
}
