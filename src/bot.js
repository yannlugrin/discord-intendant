const { readdirSync } = require('fs');
const Discord = require('discord.js');
const { DefaultSettings } = require('./util/constants');
const Guild = require('./guild');

/*
 * Bot class
 */
class Bot {
  /*
   * Bot class constructor
   */
  constructor(options = {}) {
    this.settings = Discord.Util.mergeDefault(DefaultSettings, options);
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
  start() {
    this.client.login(this.settings.token);
  }

  /*
   * Load a command file
   */
  _loadCommand(file) {
    if (!file.endsWith(".js")) return;

    try {
      console.info(`Loading Command: ${file}`);
      const command = require(`./commands/${file}`);
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
      this.client.on(event.name, event.execute.bind(this));
    } catch (e) {
      console.error(`Unable to load event ${file}: ${e}`);
    }
  }

  /*
   * Return guild settings or default
   */
  async getSettings(guild) {
    const settings = Discord.Util.mergeDefault(this.settings, {});

    if (guild && guild.id) {
      if(!this.guilds.has(guild.id)) {
        this.guilds.set(guild.id, new Guild(guild.id, settings));
      }

      settings.guild = this.guilds.get(guild.id);
      settings.prefix = await settings.guild.get('prefix') || settings.prefix;
    }

    return settings
  }
}

module.exports = Bot;
