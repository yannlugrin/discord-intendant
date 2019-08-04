const Keyv = require('keyv');

class Guild {
  constructor(id, options = {}) {
    this.options = options;
    this.id = id;
    this.database = new Keyv(this.options.databaseURL, { namespace: this.id });
  }

  async set(key, value) {
    return this.database.set(key.toLowerCase(), value);
  }

  async get(key) {
    return this.database.get(key.toLowerCase());
  }

  async is(key) {
    return this.database.get(key.toLowerCase())
      .then((value) => { return value === 'true' });
  }

  async not(key) {
    return this.is(key)
      .then((value) => { return !value; });
  }
}

module.exports = Guild;
