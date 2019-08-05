module.exports = {
  settings: [
    { key: 'prefix', type: 'String', permissions: ['ADMINISTRATOR'], defaultValue: '!' },
  ],
  listeners: [
    {
      name: 'message',
      description: 'Execute commands in messages sent in Guild channels',
      async execute(message) {
        // Ignore any bot message or DM
        if (message.author.bot || !message.guild) return;

        // Load settings, will use default settings if Guild is not set or don't have
        // their own settings set.
        const settings = await this.getSettings(message.guild);
        const prefix = await settings.get('prefix');

        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Ignore command if doesn't exists
        if (!this.commands.has(commandName)) return;
        const command = this.commands.get(commandName);

        // Execute command if user is authorized in current channel
        if (command.permissions && !message.channel.permissionsFor(message.author).has(command.permissions)) return;
        return command.execute(message, settings, args)
          .catch((e) => {
            console.error(e);
            message.reply('there was an error trying to execute that command!');
          });
      }
    },
  ]
};
