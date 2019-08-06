const { RuntimeError } = require('constants');

module.exports = {
  name: 'get',
  description: 'Get guild settings',
  permissions: [],
  async execute(message, settings, args = []) {
    const key = args.shift();

    return settings.formatted(key, message, ...args)
      .then((value) => {
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
