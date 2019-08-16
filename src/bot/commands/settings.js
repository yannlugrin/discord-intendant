module.exports = {
  name: 'settings',
  description: 'Display all guild settings',
  async execute(message, settings) {
    const values = [''];
    const keys = Array.from(settings.definitions.filter(s => !s.private).keys()).sort();

    for (const key of keys) {
      try {
        const value = await settings.formatted(key, message);
        if (value === undefined) {
          values.push(`Value of '*${key}*' is empty`);
        } else {
          values.push(`Value of '*${key}*' is set to: **${value}**`);
        }
      } catch {
        values.push(`**Value of '${key}' is not valid**`);
      }
    }

    return message.reply(values.join('\n'));
  }
};
