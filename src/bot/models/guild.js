const Keyv = require('keyv');

class Guild {
  constructor(id, settings) {
    Object.defineProperty(this, 'id', { value: id });
    Object.defineProperty(this, 'settings', { value: settings.clone() });
    Object.defineProperty(this, '_database', { value: new Keyv(settings.databaseURL, { namespace: `guild_settings_${id}` }) });

    this.settings.guild = this;
  }

  async set(key, value) {
    return this._database.set(key, value);
  }

  async get(key) {
    return this._database.get(key);
  }

  async has(key) {
    return await this._database.get(key) !== undefined;
  }

  /*
   *
   */
  async log(...args) {
    return this.get('logChannel').then((channelID) => {
      if (!channelID) return;
      this.settings.bot.client.channels.find(c => c.id === channelID)
        .send(this.settings.bot.render(...args));
    });
  }
}

module.exports = Guild;
