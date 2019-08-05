const { Collection } = require('discord.js');
const Discord = require('discord.js');

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

  get databaseURL() {
    return super.get('databaseURL');
  }

  async set(key, ...args) {
    if (!this._definitions) return super.set(key, args[0]);
    if (!this._definitions.has(key)) throw `Set '${key}' setting is forbidden!`;

    const computedValue = await this.compute(key, ...args);

    await this.guild.set(key, computedValue);
    return super.has(key) ? super.set(key, computedValue) : this;
  }

  async get(key) {
    if (!this.guild || !this.definitions.has(key)) return super.get(key);

    return this.guild.get(key).then ((value) => {
      return value ? value : (super.get(key) || this.definitions.get(key).defaultValue);
    });
  }

  async is(key) {
    return this.get(key)
      .then((value) => { return value === true });
  }

  async not(key) {
    return this.is(key)
      .then((value) => { return !value; });
  }

  async compute(key, ...args) {
    const message = (args[0] instanceof Discord.Message) ? args.shift() : undefined;
    const definition = this.definitions.get(key);

    if (message && !message.channel.permissionsFor(message.author).has(definition.permissions)) throw 'Not authorized';

    switch (definition.type) {
      // Boolean type
      case Boolean:
        if (args.length === 0) return undefined;

        if (!/^(true|false)$/.test(args[0]) && message) {
          throw('You must use values true or false. No value is also valid.');
        }

        return args[0] === 'true' ? true : false;

      // Channel type
      case 'Channel':
        if (!message) throw `Message required to set "${key}" setting`;
        if (args.length > 0 && message.mentions.channels.size !== 1) {
          throw('You must specify exactly one channel');
        }
        return args.length === 1 ? message.mentions.channels.first().id : undefined;

      // Role type
      case 'Role':
        if (args.length === 0) return undefined;

        if (!message) throw `Message required to set "${key}" setting`;
        if (args.length > 1) {
          throw('You must specify exactly one role');
        }

        try {
          return message.guild.roles.find((role) => role.name === args[0]).id;
        } catch {
          throw('You must specify an existing role');
        }

      // Default type, like String
      default:
        return args.length > 0 ? args.join(' ') : undefined
    }
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
