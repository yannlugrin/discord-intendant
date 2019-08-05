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
}

module.exports = Guild;
