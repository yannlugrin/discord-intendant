const Discord = require('discord.js');
const { SettingError } = require('constants');

module.exports = {
  name: 'Boolean',
  async formatted(key) {
    return this.get(key);
  },
  async compute(key, ...args) {
    const message = (args[0] instanceof Discord.Message) ? args.shift() : undefined;

    if (args.length === 0) return undefined;

    if (message && !/^(true|false)$/.test(args[0])) {
      throw new SettingError('Value must be equal to true, false or be empty');
    }

    return args[0] === 'true' ? true : false;
  }
};
