module.exports = {
  name: 'Time',

  async formatted(key) {
    const value = await this.get(key);
    return value ? (new Date(value)).toString() : undefined;
  },

  async compute(key, message, ...args) {
    return (args.length > 0) ? new Date(args.join(' ')).getTime() : undefined;
  },

  async validate() {}
};
