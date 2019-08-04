module.exports = {
  name: 'set',
  description: 'Set guild settings',
  permissions: ['ADMINISTRATOR'],
  async execute(message, args) {
    const key = args.shift();
    const value = args.join(' ');

    return message.settings.guild.set(key, value)
      .then(function() {
        message.reply(`Value of '${key}' is set to: ${value}`);
      });
  }
};
