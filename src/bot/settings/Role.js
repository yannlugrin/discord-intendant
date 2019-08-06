const Discord = require('discord.js');
const { SettingError, NotImplemented } = require('constants');

module.exports = {
  name: 'Role',

  async formatted(key, message) {
    const value = await this.get(key);

    return value ? message.guild.roles.find((role) => role.id === value).name : undefined;
  },

  async compute(key, message, ...args) {
    try {
      return (args.length === 1) ? message.guild.roles.find((role) => role.name === args[0]).id : undefined;
    } catch(error) {
      throw new SettingError('Value must be equal to an existing role name');
    }
  },

  async validate(key, ...args) {
    const message = (args[0] instanceof Discord.Message) ? args.shift() : undefined;

    if (!message) throw new NotImplemented(`Message required to set "${key}" setting`);
    if (args.length > 1) {
      throw new SettingError('Value must be equal to exactly one role or be empty');
    }
  }
};
