const Keyv = require('keyv');

class Guild {
  constructor(id, settings) {
    Object.defineProperty(this, 'id', { value: id });
    Object.defineProperty(this, 'settings', { value: settings.clone() });
    Object.defineProperty(this, '_database', { value: new Keyv(settings.databaseURL, { namespace: id }) });

    this.settings.guild = this;
  }

  async set(key, value) {
    return this._database.set(key, value);
  }

  async get(key) {
    return this._database.get(key);
  }

  async is(key) {
    return this.get(key)
      .then((value) => { return value === 'true' });
  }

  async not(key) {
    return this.is(key)
      .then((value) => { return !value; });
  }
}

module.exports = Guild;
