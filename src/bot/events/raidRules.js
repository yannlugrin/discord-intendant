const { RuntimeError } = require('constants');

module.exports = {
  settings: [
    { key: 'raidRulesEnabled', type: 'Boolean', permissions: ['ADMINISTRATOR'], default: false },
    { key: 'raidRulesMessage', type: 'String', permissions: ['ADMINISTRATOR'] },
    { key: 'raidRulesChannel', type: 'Channel', permissions: ['ADMINISTRATOR'], private: true },
    { key: 'raidRulesReaction', type: 'String', permissions: ['ADMINISTRATOR'] },
    { key: 'raidRulesPromote', type: 'Role', permissions: ['ADMINISTRATOR'] },
  ],
  listeners: [
    {
      name: 'messageReactionAdd',
      description: 'Promote user when he accepted raid rules',
      async execute(reaction, user) {
        // Ignore joining bot
        if (user.bot) return;

        // Load Guild settings and emoji
        const settings = await this.getSettings(reaction.message.guild);
        const emoji = reaction.emoji.id ? `${reaction.emoji.name}:${reaction.emoji.id}` : reaction.emoji.name;
        const member = await reaction.message.guild.fetchMember(user);

        // Do not proceed if raid rules are not enable, it's not right message or right emoji
        if (await settings.not('raidRulesEnabled')) return;
        if (reaction.message.id !== await settings.get('raidRulesMessage')) return;
        if (emoji !== await settings.get('raidRulesReaction')) {
          return reaction.remove(member);
        }

        // Save message channel id to be able to retrive it later
        await settings.get('raidRulesChannel').then((value) => {
          if (value !== reaction.message.channel.id) return settings.set('raidRulesChannel', reaction.message.channel.id);
        });

        // Check rights to accepts rules
        if (!reaction.message.channel.permissionsFor(member).has('ADD_REACTIONS')) {
          return reaction.remove(member);
        }

        // Add role to member
        return settings.get('raidRulesPromote').then(member.addRole.bind(member))
          .then(() => {
            settings.guild.log('{{mention}} signed raid rules', { member: member });
          })
          .catch(console.error);
      }
    },
    {
      name: 'guildMemberRemove',
      description: 'Remove user reaction on raid rules on leave',
      async execute(member) {
        const settings = await this.getSettings(member.guild);

        return settings.get('raidRulesMessage').then(async (messageID) => {
          if (!messageID) return;

          const message = await settings.get('raidRulesChannel').then((channelID) => {
            if (!channelID) throw new RuntimeError(`raidRulesChannel setting is not set`);
            return member.guild.channels.get(channelID).fetchMessage(messageID);
          });

          const rulesEmoji = await settings.get('raidRulesReaction');
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
