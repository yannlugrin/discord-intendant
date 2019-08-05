const { Collection } = require('discord.js');

/*
 *
 */
class Settings extends Collection {
  /*
   *
   */
  constructor(iterable) {
    super(iterable);

    const definitions = (iterable && iterable._definitions) ? iterable._definitions : new SettingsDefinition();

    Object.defineProperty(this, '_definitions', { value: definitions });
    Object.defineProperty(this, 'guild', { value: null, writable: true, configurable: true });
  }

  get definitions() {
    return this._definitions;
  }

  async set(key, value) {
    if (!this._definitions) return super.set(key, value);
    if (!this._definitions.has(key)) throw `Set '${key}' setting is forbidden!`;

    await this.guild.set(key, value);
    return super.has(key) ? super.set(key, value) : this;
  }

  async get(key) {
    if (!this.guild || !this.definitions.has(key)) return super.get(key);

    return this.guild.get(key).then ((value) => {
      return value ? value : (super.get(key) || this.definitions.get(key).defaultValue);
    });
  }
}

/*
 *
 */
class SettingsDefinition extends Collection {
  /*
   *
   */
  constructor(iterable) {
    super(iterable);
  }

  /*
   *
   */
  set(key, values) {
    const type = values.type;
    const permissions = values.permissions.sort();
    const defaultValue = values.defaultValue;

    if (this.has(key)) {
      const actual = this.get(key);

      if (type !== actual.type || permissions.every((v, i) => actual.permissions[i] === v)) {
        throw `'${key} settings is set twice with different values'`
      }
    }

    return super.set(key, { type: type, permissions: permissions.sort(), defaultValue: defaultValue });
  }

  get(key) {
    return super.get(key);
  }
}

module.exports = Settings;
