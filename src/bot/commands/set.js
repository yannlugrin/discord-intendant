const { RuntimeError } = require('constants');

module.exports = {
  name: 'set',
  description: 'Set guild settings',
  permissions: [],
  async execute(message, settings, args = []) {
    const key = args.shift();

    return settings.set(key, message, ...args)
      .then(async () => {
        const value = await settings.formatted(key, message);
        if (value === undefined) {
          return message.reply(`Value of '${key}' is unset`);
        }
        return message.reply(`Value of '${key}' is set to: ${value}`);
      })
      .catch((error) => {
        if (error instanceof RuntimeError) {
          return message.reply(error.message);
        }
        console.error(error);
      });
  }
};
