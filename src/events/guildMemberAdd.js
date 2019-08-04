module.exports = {
  name: 'guildMemberAdd',
  description: 'The guildMemberAdd event runs anytime a new member joins a server',
  async execute(member) {
    // Ignore joining bot
    if (member.bot) return;

    // Load settings, will use default settings if Guild is not set or don't have
    // their own settings set.
    const settings = await this.getSettings(member.guild);

    // Do not proceed if welcome message is not enable
    if (await settings.guild.not('welcomeEnabled')) return;

    // Send message
    const welcomeMessage = this.render(await settings.guild.get('welcomeMessage'), { member: member });
    const welcomeChannel = await settings.guild.get('welcomeChannel').then( (channelID => {
      return member.guild.channels.find(c => c.id === channelID) || member;
    }));

    if (welcomeMessage.length === 0) return;

    return welcomeChannel.send(welcomeMessage)
      .catch(console.error);
  }
}
