const { Collection } = require('discord.js');
const Discord = require('discord.js');
const { UnauthorizedError, RuntimeError, NotImplemented } = require('constants');

class SettingError extends RuntimeError {}

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
    // check permissions of message author.
    const message = (args[0] instanceof Discord.Message) ? args.shift() : undefined;
    if (message && (definition.internal || !message.channel.permissionsFor(message.author).has(this._definitions.get(key).permissions))) {
      throw new UnauthorizedError(`Set '${key}' setting is forbidden!`);
    }

    const computedValue = await this.compute(key, ...args);

    await this.guild.set(key, computedValue);
    return super.has(key) || definition.cached ? super.set(key, computedValue) : this;
  }

  async get(key) {
    if (!this.guild || !this.definitions.has(key)) return super.get(key);

    return this.guild.get(key).then ((value) => {
      return value ? value : (super.get(key) || this.definitions.get(key).default);
    });
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
    const message = (args[0] instanceof Discord.Message) ? args.shift() : undefined;
    const definition = this.definitions.get(key);

    switch (definition.type) {
      // Boolean type
      case 'Boolean':
        if (args.length === 0) return undefined;

        if (!/^(true|false)$/.test(args[0]) && message) {
          throw new SettingError('Value must be equal to true, false or be empty');
        }

        return args[0] === 'true' ? true : false;

      // Channel type
      case 'Channel':
        if (!message) throw new NotImplemented(`Message required to set "${key}" setting`);
        if (args.length > 0 && message.mentions.channels.size !== 1) {
          throw new SettingError('Value must be equal to exactly one channel or be empty');
        }
        return args.length === 1 ? message.mentions.channels.first().id : undefined;

      // Role type
      case 'Role':
        if (args.length === 0) return undefined;

        if (!message) throw new NotImplemented(`Message required to set "${key}" setting`);
        if (args.length > 1) {
          throw new SettingError('Value must be equal to exactly one role or be empty');
        }

        try {
          return message.guild.roles.find((role) => role.name === args[0]).id;
        } catch(error) {
          if (error instanceof TypeError) {
            throw new SettingError('Value must be equal to an existing role name');
          } else {
            console.error(error);
          }
        }

        break;

      // Default type, like String
      default:
        return args.length > 0 ? args.join(' ') : undefined;
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
    const internal = values.internal || false;
    const defaultValue = values.default;
    const cached = values.cached || false;

    if (this.has(key)) {
      const actual = this.get(key);

      if (type !== actual.type || permissions.every((v, i) => actual.permissions[i] === v)) {
        throw new RuntimeError(`'${key} settings is set twice with different values'`);
      }
    }

    return super.set(key, {
      type: type,
      permissions: permissions,
      default: defaultValue,
      internal: internal,
      cached: cached,
    });
  }

  get(key) {
    return super.get(key);
  }
}

module.exports = Settings;
