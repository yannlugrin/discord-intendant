const Discord = require('discord.js');
const { SettingError, NotImplemented } = require('constants');

module.exports = {
  name: 'Role',
  async formatted(key, ...args) {
    const value = await this.get(key);
    const message = (args[0] instanceof Discord.Message) ? args.shift() : undefined;

    return value ? message.guild.roles.find((role) => role.id === value).name : undefined;
  },
  async compute(key, ...args) {
    const message = (args[0] instanceof Discord.Message) ? args.shift() : undefined;

    if (args.length === 0) return undefined;

    if (!message) throw new NotImplemented(`Message required to set "${key}" setting`);
    if (args.length > 1) {
      throw new SettingError('Value must be equal to exactly one role or be empty');
    }

    try {
      return message.guild.roles.find((role) => role.name === args[0]).id;
    } catch(error) {
      if (error instanceof TypeError) {
        throw new SettingError('Value must be equal to an existing role name');
      } else {
        console.error(error);
      }
    }
  }
};
