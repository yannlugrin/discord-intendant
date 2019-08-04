const { readdirSync } = require('fs');
const Discord = require('discord.js');
const { DefaultOptions } = require('./util/constants');

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

    // Load commands
    const commandFiles = readdirSync('./src/commands');
    for (const file of commandFiles) {
      this._loadCommand(file);
    }

    // Log when bot is ready
    this.client.once('ready', () => {
      console.info('Bot is Ready!');
    });

    // Catch command messages
    this.client.on('message', message => {
      if (!message.content.startsWith(options.prefix) || message.author.bot) return;

      const args = message.content.slice(options.prefix.length).split(/ +/);
      const command = args.shift().toLowerCase();

      if (!this.commands.has(command)) return;
      try {
        this.commands.get(command).execute(message, args);
      } catch (e) {
        console.error(e);
        message.reply('there was an error trying to execute that command!');
      }
    });
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
}

module.exports = Bot;
