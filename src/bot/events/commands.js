module.exports = {
  settings: [
    { key: 'prefix', type: 'String', permissions: ['ADMINISTRATOR'], default: '!' },
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

        // Parse single word and quoted sentence args.
        const args = [];

        const argsRegexp = /[^\s"]+|"([^"]*)"/gi;
        let match = null;
        do {
          match = argsRegexp.exec(message.content);
          if (match != null)
          {
            // Index 1 in the array is the captured group if it exists
            // Index 0 is the matched text, which we use if no captured group exists
            args.push(match[1] ? match[1] : match[0]);
          }
        } while (match != null);

        const commandName = args.shift().slice(prefix.length).toLowerCase();

        // Ignore command if doesn't exists
        if (!this.commands.has(commandName)) return;
        const command = this.commands.get(commandName);

        // Execute command if user is authorized in current channel
        if (command.permissions && !message.channel.permissionsFor(message.author).has(command.permissions)) return;
        return command.execute(message, settings, ...args)
          .catch((e) => {
            console.error(e);
            message.reply('there was an error trying to execute that command!');
          });
      }
    },
  ]
};
