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

    // Log when bot is ready
    this.client.once('ready', () => {
      console.info('Bot is Ready!');
    });

    this.client.on('message', async message => {
      if (!message.guild) return;
      const guild = this._loadGuild(message.guild);
      const prefix = await guild.getPrefix();

      if (!message.content.startsWith(prefix)) return;

      const args = message.content.slice(prefix.length).split(/ +/);
      const commandName = args.shift().toLowerCase();

      // Ignore command if doesn't exists
      if (!this.commands.has(commandName)) return;
      const command = this.commands.get(commandName);

      // Execute command if user is authorized in current channel
      if (!message.channel.permissionsFor(message.author).has(command.permissions)) return;
      return command.execute(message, guild, args)
        .catch(function(e) {
          console.error(e);
          message.reply('there was an error trying to execute that command!');
        });
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

  /*
   *
   */
  _loadGuild(guild) {
    if(!this.guilds.has(guild.id)) {
      this.guilds.set(guild.id, new Guild(guild.id, this.options));
    }

    return this.guilds.get(guild.id)
  }
}

module.exports = Bot;
