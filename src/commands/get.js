module.exports = {
  name: 'get',
  description: 'Get guild settings',
  permissions: ['ADMINISTRATOR'],
  async execute(message, args) {
    const key = args.shift();

    return message.settings.guild.get(key.toLowerCase())
      .then(function(value) {
        message.reply(`Value of '${key}' is set to: ${value}`);
      });
  }
};
