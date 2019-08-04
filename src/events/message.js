module.exports = {
  name: 'message',
  description: 'The message event runs anytime a message is received',
  async execute(message) {
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
  }
};
