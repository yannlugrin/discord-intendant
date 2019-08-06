const Discord = require('discord.js');

module.exports = {
  name: 'String',
  async formatted(key) {
    return this.get(key);
  },
  async compute(key, ...args) {
    if (args[0] instanceof Discord.Message) args.shift();

    return args.length > 0 ? args.join(' ') : undefined;
  }
};
