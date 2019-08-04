const Keyv = require('keyv');

class Guild {
  constructor(id, options = {}) {
    this.options = options;
    this.id = id;
    this.database = new Keyv(this.options.databaseURL, { namespace: this.id });
  }

  async set(key, value) {
    return this.database.set(key, value);
  }

  async get(key) {
    return this.database.get(key);
  }
}

module.exports = Guild;
