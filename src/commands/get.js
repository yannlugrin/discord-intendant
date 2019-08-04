module.exports = {
  name: 'get',
  description: 'Get guild settings',
  permissions: ['ADMINISTRATOR'],
  async execute(message, settings, args) {
    const key = args.shift();

    return settings.guild.get(key.toLowerCase())
      .then(function(value) {
        message.reply(`Value of '${key}' is set to: ${value}`);
      });
  }
};
