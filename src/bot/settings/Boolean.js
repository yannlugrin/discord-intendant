const { SettingError } = require('constants');

module.exports = {
  name: 'Boolean',

  async formatted(key) {
    return this.get(key);
  },

  async compute(key, message, ...args) {
    return (args.length === 1) ? args[0] === 'true' : undefined;
  },

  async validate(key, message, ...args) {
    if (args.length === 0) return;
    if (args.length > 1 || !/^(true|false)$/.test(args[0])) {
      throw new SettingError('Value must be equal to true, false or be empty');
    }
  }
};
