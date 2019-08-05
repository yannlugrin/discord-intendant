const { readdirSync } = require('fs');
const Discord = require('discord.js');
const Guild = require('./bot/models/guild');
const Settings = require('./bot/models/settings');
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
    const commandFiles = readdirSync('./src/bot/commands');
    for (const file of commandFiles) {
      this._loadCommand(file);
    }

    // Load events
    const eventFiles = readdirSync('./src/bot/events');
    for (const file of eventFiles) {
      this._loadEvent(file);
    }

    /*
     * Fix for reaction events on message not cached.
     *
     * See https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/coding-guides/raw-events.md
     */
    this.client.on('raw', packet => {
      // We don't want this to run on unrelated packets
      if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;

      // Grab the channel to check the message from
      const channel = this.client.channels.get(packet.d.channel_id);
      // There's no need to emit if the message is cached, because the event will fire anyway for that
      if (channel.messages.has(packet.d.message_id)) return;

      // Since we have confirmed the message is not cached, let's fetch it
      channel.fetchMessage(packet.d.message_id).then(message => {
        // Emojis can have identifiers of name:id format, so we have to account for that case as well
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;

        // This gives us the reaction we need to emit the event properly, in top of the message object
        const reaction = message.reactions.get(emoji);

        // Adds the currently reacting user to the reaction's users collection.
        if (reaction) reaction.users.set(packet.d.user_id, this.client.users.get(packet.d.user_id));

        // Check which type of event it is before emitting
        if (packet.t === 'MESSAGE_REACTION_ADD') {
          this.client.emit('messageReactionAdd', reaction, this.client.users.get(packet.d.user_id));
        }
        if (packet.t === 'MESSAGE_REACTION_REMOVE') {
          this.client.emit('messageReactionRemove', reaction, this.client.users.get(packet.d.user_id));
        }
      });
    });
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
      console.info(`Loading command: ${file.split('.').slice(0, -1).join('.')}`);
      const command = require(`./bot/commands/${file}`);
      console.info(` ${command.description}`);
      for (const setting of command.settings || []) {
        console.info(` - setting: ${setting.key} (${setting.type})`);
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
      console.info(`Loading event: ${file.split('.').slice(0, -1).join('.')}`);
      const event = require(`./bot/events/${file}`);
      for (const setting of event.settings || []) {
        console.info(` - setting: ${setting.key} (${setting.type})`);
        this.settings.definitions.set(setting.key, setting);
      }
      for (const listener of event.listeners) {
        console.info(` - listener (${listener.name}): ${listener.description}`);
        this.client.on(listener.name, listener.execute.bind(this));
      }
    } catch (e) {
      console.error(`Unable to load event ${file}: ${e}`);
    }
  }
}

module.exports = Bot;
