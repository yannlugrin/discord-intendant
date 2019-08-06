const { Collection } = require('discord.js');
const Discord = require('discord.js');
const { UnauthorizedError, RuntimeError } = require('constants');

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
    // To restore values on clone, super in constructor is called before definitions is set
    if (!this._definitions) return super.set(key, args[0]);

    const definition = this.definitions.get(key);
    if (!definition) throw new UnauthorizedError(`Set '${key}' setting is forbidden!`);

    // Setting set without message is internal, so internal are authoritzed. Otherwise
    // check permissions of message author
    const message = (args[0] instanceof Discord.Message) ? args.shift() : undefined;
    if (message && (definition.internal || !message.channel.permissionsFor(message.author).has(this._definitions.get(key).permissions))) {
      throw new UnauthorizedError(`Set '${key}' setting is forbidden!`);
    }

    const computedValue = await this.compute(key, message, ...args);

    await this.guild.set(key, computedValue);
    return super.has(key) ? super.set(key, computedValue) : this;
  }

  async get(key, ...args) {
    if (!this.guild || !this.definitions.has(key)) return super.get(key);

    // Check permissions of message author
    const message = (args[0] instanceof Discord.Message) ? args.shift() : undefined;
    if (message && !message.channel.permissionsFor(message.author).has(this._definitions.get(key).permissions)) {
      throw new UnauthorizedError(`Get '${key}' setting is forbidden!`);
    }

    return this.guild.get(key).then ((value) => {
      return value ? value : (super.get(key) || this.definitions.get(key).default);
    });
  }

  async formatted(key, ...args) {
    return this.definitions.get(key).formatted.call(this, key, ...args);
  }

  async has(key) {
    return super.has(key) || this.guild.has(key);
  }

  async is(key) {
    return this.get(key)
      .then((value) => { return value === true });
  }

  async not(key) {
    return this.is(key)
      .then((value) => { return !value });
  }

  async compute(key, ...args) {
    return this.definitions.get(key).compute.call(this, key, ...args);
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
    const internal = values.internal || false;
    const defaultValue = values.default;

    if (this.has(key)) {
      const actual = this.get(key);

      if (type !== actual.type || permissions.every((v, i) => actual.permissions[i] === v)) {
        throw new RuntimeError(`'${key} settings is set twice with different values'`);
      }
    }

    const { formatted, compute } = require(`bot/settings/${type}.js`);

    return super.set(key, {
      type: type,
      permissions: permissions,
      default: defaultValue,
      internal: internal,
      formatted: formatted,
      compute: compute,
    });
  }

  get(key) {
    return super.get(key);
  }
}

module.exports = Settings;
