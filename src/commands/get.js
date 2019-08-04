module.exports = {
  name: 'get',
  description: 'Get guild settings',
  permissions: ['ADMINISTRATOR'],
  async execute(message, args) {
    const key = args.shift().toLowerCase();

    return message.settings.guild.get(key)
      .then(function(value) {
        message.reply(`Value of '${key}' is set to: ${value}`);
      });
  }
};
