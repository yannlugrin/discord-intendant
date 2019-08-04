module.exports = {
  name: 'set',
  description: 'Set guild settings',
  permissions: ['ADMINISTRATOR'],
  async execute(message, settings, args = []) {
    const key = args.shift();
    let value = args.join(' ');
    let computedValue = value;

    switch (key) {
      case 'welcomeChannel':
        if (args.length > 0 && message.mentions.channels.size !== 1) {
          message.reply('You must specify exactly one channel');
          return;
        }
        computedValue = args.length === 0 ? undefined : message.mentions.channels.first().id;
        break;
    }

    return settings.guild.set(key, computedValue)
      .then(function() {
        if (computedValue === undefined) {
          message.reply(`Value of '${key}' is unset`);
        } else {
          message.reply(`Value of '${key}' is set to: ${value}`);
        }
      });
  }
};
