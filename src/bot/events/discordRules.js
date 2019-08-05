module.exports = {
  settings: [
    { key: 'discordRulesEnabled', type: Boolean, permissions: ['ADMINISTRATOR'], defaultValue: false },
    { key: 'discordRulesMessage', type: String, permissions: ['ADMINISTRATOR'] },
    { key: 'discordRulesReaction', type: String, permissions: ['ADMINISTRATOR'] },
    { key: 'discordRulesPromote', type: 'Role', permissions: ['ADMINISTRATOR'] },
  ],
  listeners: [
    {
      name: 'messageReactionAdd',
      description: 'Promote user when he accepted Discord rules',
      async execute(reaction, user) {
        // Ignore joining bot
        if (user.bot) return;

        // Load Guild settings and emoji
        const settings = await this.getSettings(reaction.message.guild);
        const emoji = reaction.emoji.id ? `${reaction.emoji.name}:${reaction.emoji.id}` : reaction.emoji.name;

        // Do not proceed if Discord rules are not enable, it's not right message or right emoji
        if (await settings.not('discordRulesEnabled')) return;
        if (reaction.message.id !== await settings.get('discordRulesMessage')) return;
        if (emoji !== await settings.get('discordRulesReaction')) return;

        return reaction.message.guild.fetchMember(user)
          .then(async (member) => {
            return member.addRole(await settings.get('discordRulesPromote'));
          });
      }
    },
  ]
}
