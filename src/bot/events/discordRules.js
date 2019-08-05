module.exports = {
  name: 'messageReactionAdd',
  description: 'Promote user when he accepted Discord rules',
  settings: [
    { key: 'discordRulesEnabled', type: Boolean, permissions: ['ADMINISTRATOR'], defaultValue: false },
    { key: 'discordRulesMessage', type: String, permissions: ['ADMINISTRATOR'] },
    { key: 'discordRulesEmoji', type: String, permissions: ['ADMINISTRATOR'] },
    { key: 'discordRulesPromote', type: 'Role', permissions: ['ADMINISTRATOR'] },
  ],
  async execute(reaction, user) {
    // Ignore joining bot
    if (user.bot) return;

    // Load Guild settings and emoji
    const settings = await this.getSettings(reaction.message.guild);
    const emoji = reaction.emoji.id ? `${reaction.emoji.name}:${reaction.emoji.id}` : reaction.emoji.name;

    // Do not proceed if Discord rules are not enable, it's not right message or right emoji
    if (await settings.not('discordRulesEnabled')) return;
    if (reaction.message.id !== await settings.get('discordRulesMessage')) return;
    if (emoji !== await settings.get('discordRulesEmoji')) return;

    return reaction.message.guild.fetchMember(user)
      .then(async (member) => {
        return member.addRole(await settings.get('discordRulesPromote'));
      });
  }
}
