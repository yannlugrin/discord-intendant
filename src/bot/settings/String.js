module.exports = {
  name: 'String',

  async formatted(key) {
    return this.get(key);
  },

  async compute(key, message, ...args) {
    return args.length > 0 ? args.join(' ') : undefined;
  },

  async validate() {}
};
