const { readdirSync } = require('fs');
const Discord = require('discord.js');
const Guild = require('./guild');
const Settings = require('./settings');
const { DefaultSettings } = require('./util/constants');

/*
 * Bot class
 */
class Bot {
  /*
   * Bot class constructor
   */
  constructor() {
    this.settings = new Settings(DefaultSettings);

    this.client = new Discord.Client();
    this.commands = new Discord.Collection();
    this.guilds = new Discord.Collection();

    // Load commands
    const commandFiles = readdirSync('./src/commands');
    for (const file of commandFiles) {
      this._loadCommand(file);
    }

    // Load events
    const eventFiles = readdirSync('./src/events');
    for (const file of eventFiles) {
      this._loadEvent(file);
    }
  }

  /*
   * Start the bot
   */
  async start() {
    return this.client.login(await this.settings.get('token'));
  }

  /*
   * Return guild settings or default
   */
  async getSettings(guild) {
    if (!guild || !guild.id) return this.settings

    if(!this.guilds.has(guild.id)) {
      this.guilds.set(guild.id, new Guild(guild.id, this.settings));
    }
    return this.guilds.get(guild.id).settings;
  }

  /*
   *
   */
  render(template = '', vars = {}) {
    let result = template;

    if (vars.member) {
      result = result
        .replace('{{mention}}', `<@${vars.member.id}>`)
        .replace('{{nickname}}', vars.member.nickname || vars.member.user.username)
        .replace('{{tag}}', vars.member.user.tag);
    }

    return result;
  }

  /*
   * Load a command file
   */
  _loadCommand(file) {
    if (!file.endsWith(".js")) return;

    try {
      console.info(`Loading Command: ${file}`);
      const command = require(`./commands/${file}`);
      for (const setting of command.settings || []) {
        this.settings.definitions.set(setting.key, setting);
      }
      this.commands.set(command.name, command);
    } catch (e) {
      console.error(`Unable to load command ${file}: ${e}`);
    }
  }

  /*
   * Load a event file
   */
  _loadEvent(file) {
    if (!file.endsWith(".js")) return;

    try {
      console.info(`Loading Event: ${file}`);
      const event = require(`./events/${file}`);
      for (const setting of event.settings || []) {
        this.settings.definitions.set(setting.key, setting);
      }
      this.client.on(event.name, event.execute.bind(this));
    } catch (e) {
      console.error(`Unable to load event ${file}: ${e}`);
    }
  }
}

module.exports = Bot;
