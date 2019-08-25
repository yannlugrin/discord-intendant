const { RuntimeError } = require('constants');

module.exports = {
  settings: [
    { key: 'guildRulesEnabled', type: 'Boolean', permissions: ['ADMINISTRATOR'], default: false },
    { key: 'guildRulesMessage', type: 'String', permissions: ['ADMINISTRATOR'] },
    { key: 'guildRulesChannel', type: 'Channel', permissions: ['ADMINISTRATOR'], private: true },
    { key: 'guildRulesReaction', type: 'String', permissions: ['ADMINISTRATOR'] },
    { key: 'guildRulesPromote', type: 'Role', permissions: ['ADMINISTRATOR'] },
  ],
  listeners: [
    {
      name: 'messageReactionAdd',
      description: 'Promote user when he accepted Guild rules',
      async execute(reaction, user) {
        // Ignore joining bot
        if (user.bot) return;

        // Load Guild settings and emoji
        const settings = await this.getSettings(reaction.message.guild);
        const emoji = reaction.emoji.id ? `${reaction.emoji.name}:${reaction.emoji.id}` : reaction.emoji.name;

        // Do not proceed if Guild rules are not enable, it's not right message or right emoji
        if (await settings.not('guildRulesEnabled')) return;
        if (reaction.message.id !== await settings.get('guildRulesMessage')) return;
        if (emoji !== await settings.get('guildRulesReaction')) return;

        // Save message channel id to be able to retrive it later
        await settings.get('guildRulesChannel').then((value) => {
          if (value !== reaction.message.channel.id) return settings.set('guildRulesChannel', reaction.message.channel.id);
        });

        return reaction.message.guild.fetchMember(user)
          .then(async (member) => {
            return member.addRole(await settings.get('guildRulesPromote'));
          });
      }
    },
    {
      name: 'guildMemberRemove',
      description: 'Remove user reaction on Guild rules on leave',
      async execute(member) {
        const settings = await this.getSettings(member.guild);

        return settings.get('guildRulesMessage').then(async (messageID) => {
          if (!messageID) return;

          const message = await settings.get('guildRulesChannel').then((channelID) => {
            if (!channelID) throw new RuntimeError(`guildRulesChannel setting is not set`);
            return member.guild.channels.get(channelID).fetchMessage(messageID);
          });

          const rulesEmoji = await settings.get('guildRulesReaction');
          const reaction = message.reactions.find((reaction) => {
            const emoji = reaction.emoji.id ? `${reaction.emoji.name}:${reaction.emoji.id}` : reaction.emoji.name;
            return emoji === rulesEmoji;
          });

          return reaction ? reaction.remove(member) : undefined;
        });
      }
    }
  ]
};
