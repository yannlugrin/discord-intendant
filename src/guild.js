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
}

module.exports = Guild;
