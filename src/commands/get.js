module.exports = {
  name: 'get',
  description: 'Get guild settings',
  permissions: ['ADMINISTRATOR'],
  async execute(message, settings, args) {
    const key = args.shift();

    return settings.get(key)
      .then((value) => message.reply(`Value of '${key}' is set to: ${value}`));
  }
};
