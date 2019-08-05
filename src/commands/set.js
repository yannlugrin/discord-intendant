module.exports = {
  name: 'set',
  description: 'Set guild settings',
  permissions: ['ADMINISTRATOR'],
  async execute(message, settings, args = []) {
    const key = args.shift();

    return settings.set(key, message, ...args)
      .then(async () => {
        const value = await settings.get(key);
        if (value === undefined) return message.reply(`Value of '${key}' is unset`);

        switch (settings.definitions.get(key).type) {
          case 'Channel':
            return message.reply(`Value of '${key}' is set to: <#${value}>`);
          default:
            return message.reply(`Value of '${key}' is set to: ${value}`);
        }
      })
      .catch((e) => {
        message.reply(e);
      });
  }
};
