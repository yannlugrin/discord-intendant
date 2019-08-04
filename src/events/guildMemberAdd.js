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

    // Render templates
    const welcomeDirectMessage = this.render(await settings.guild.get('welcomeDirectMessage'), { member: member });
    if (welcomeDirectMessage.length === 0) return;

    return member.send(welcomeDirectMessage);
  }
}
