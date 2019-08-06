const Discord = require('discord.js');
const { NotImplemented, SettingError } = require('constants');

module.exports = {
  name: 'Channel',

  async formatted(key) {
    const value = await this.get(key);

    return value ? `<#${value}>` : undefined;
  },

  async compute(key, message, ...args) {
    return args.length === 1 ? message.mentions.channels.first().id : undefined;
  },

  async validate(key, ...args) {
    const message = (args[0] instanceof Discord.Message) ? args.shift() : undefined;

    if (!message && !this.definitions.get(key).internal) throw new NotImplemented(`Message required to set "${key}" setting`);
    if (args.length > 0 && message.mentions.channels.size !== 1) {
      throw new SettingError('Value must be equal to exactly one channel or be empty');
    }
  }
};
