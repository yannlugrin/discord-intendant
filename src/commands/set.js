module.exports = {
  name: 'set',
  description: 'Set guild settings',
  permissions: ['ADMINISTRATOR'],
  async execute(message, guild, args) {
    const key = args.shift().toLowerCase();
    const value = args.join(' ');

    return guild.set(key, value)
      .then(function() {
        message.reply(`Value of '${key}' is set to: ${value}`);
      });
  }
};
