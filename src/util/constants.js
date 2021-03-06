const DefaultSettings = {
  prefix: process.env.DISCORD_BOT_PREFIX || '!',
  token: process.env.DISCORD_BOT_TOKEN,
  databaseURL: process.env.DATABASE_URL,

  [Symbol.iterator]: function * () {
    for (const key in this) {
      yield [key, this[key]];
    }
  }
};

class NotImplemented extends Error {}
class RuntimeError extends Error {}
class SettingError extends RuntimeError {}
class UnauthorizedError extends RuntimeError {}

module.exports = {
  DefaultSettings: DefaultSettings,
  NotImplemented: NotImplemented,
  RuntimeError: RuntimeError,
  SettingError: SettingError,
  UnauthorizedError: UnauthorizedError,
};
