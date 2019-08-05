module.exports = {
  name: 'guildMemberAdd',
  description: 'Send welcome message to member that join Guild server',
  settings: [
    { key: 'welcomeEnabled', type: Boolean, permissions: ['ADMINISTRATOR'], defaultValue: false },
    { key: 'welcomeChannel', type: 'Channel', permissions: ['ADMINISTRATOR'] },
    { key: 'welcomeMessage', type: String, permissions: ['ADMINISTRATOR'] },
  ],
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
