module.exports = {
  name: 'message',
  description: 'The message event runs anytime a message is received',
  async execute(message) {
    // Ignore any bot message
    if (message.author.bot) return;

    // Load settings, will use default settings if Guild is not set or don't have
    // their own settings set.
    // eslint-disable-next-line require-atomic-updates
    const settings = message.settings = await this.getSettings(message.guild);
    const prefix = settings.prefix;

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Ignore command if doesn't exists
    if (!this.commands.has(commandName)) return;
    const command = this.commands.get(commandName);

    // Execute command if user is authorized in current channel
    if (!message.channel.permissionsFor(message.author).has(command.permissions)) return;
    return command.execute(message, args)
      .catch(function(e) {
        console.error(e);
        message.reply('there was an error trying to execute that command!');
      });
  }
};
