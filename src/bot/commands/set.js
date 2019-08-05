const { RuntimeError } = require('constants');

module.exports = {
  name: 'set',
  description: 'Set guild settings',
  permissions: [],
  async execute(message, settings, args = []) {
    const key = args.shift();

    return settings.set(key, message, ...args)
      .then(async () => {
        const value = await settings.get(key);
        if (value === undefined) return message.reply(`Value of '${key}' is unset`);

        switch (settings.definitions.get(key).type) {
          case 'Channel':
            return message.reply(`Value of '${key}' is set to: <#${value}>`);
          case 'Role':
            return message.reply(`Value of '${key}' is set to: ${message.guild.roles.find((role) => role.id === value).name}`);
          default:
            return message.reply(`Value of '${key}' is set to: ${value}`);
        }
      })
      .catch((error) => {
        if (error instanceof RuntimeError) {
          return message.reply(error.message);
        }
        console.error(error);
      });
  }
};
