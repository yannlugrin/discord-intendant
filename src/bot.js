const { readdirSync } = require('fs');
const Discord = require('discord.js');
const { DefaultOptions } = require('./util/constants');
const Guild = require('./guild');

/*
 * Bot class
 */
class Bot {
  /*
   * Bot class constructor
   */
  constructor(options = {}) {
    this.options = Discord.Util.mergeDefault(DefaultOptions, options);
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
    this.client.login(this.options.token);
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
   * Return Guild object
   */
  _loadGuild(guild) {
    if(!this.guilds.has(guild.id)) {
      this.guilds.set(guild.id, new Guild(guild.id, this.options));
    }

    return this.guilds.get(guild.id)
  }
}

module.exports = Bot;
