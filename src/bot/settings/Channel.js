const { SettingError } = require('constants');

module.exports = {
  name: 'Channel',

  async formatted(key) {
    const value = await this.get(key);
    return value ? `<#${value}>` : undefined;
  },

  async compute(key, message, ...args) {
    return args.length === 1 ? /(\d+)/.exec(args[0])[0] : undefined;
  },

  async validate(key, message, ...args) {
    if (args.length === 0) return;
    if (args.length > 1 || !/^(\d+|<#\d+>)$/.test(args[0])) {
      throw new SettingError('Value must be a channel mention, channel ID or empty');
    }
  }
};
