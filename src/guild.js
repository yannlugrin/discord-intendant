const Keyv = require('keyv');

class Guild {
  constructor(id, options = {}) {
    this.options = options;
    this.id = id;
    this.database = new Keyv(this.options.databaseURL, { namespace: this.id });
  }

  async getPrefix() {
    const prefix = await this.database.get('prefix');
    if (prefix) {
      return prefix;
    }
    return this.options.defaultPrefix;
  }

  async set(key, value) {
    return this.database.set(key, value);
  }

  async get(key) {
    return this.database.get(key);
  }
}

module.exports = Guild;
