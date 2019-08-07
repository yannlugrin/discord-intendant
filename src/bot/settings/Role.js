const { SettingError, NotImplemented } = require('constants');

module.exports = {
  name: 'Role',

  async formatted(key, message) {
    const value = await this.get(key);
    return value ? message.guild.roles.find((role) => role.id === value).name : undefined;
  },

  async compute(key, message, ...args) {
    const role = message.guild.roles.find((role) => role.name === args[0]);
    return role ? role.id : args[0];
  },

  async validate(key, message, ...args) {
    if (args.length === 0) return;
    if (!message && !/^\d+$/.test(args[0])) throw new NotImplemented(`Message required to set "${key}" setting`);
    if (args.length > 1 || (!/^\d+$/.test(args[0]) && !message.guild.roles.find((role) => role.name === args[0]))) {
      throw new SettingError('Value must a role name, role ID or empty');
    }
  }
};
