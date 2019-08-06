module.exports = {
  name: 'settings',
  description: 'Display all guild settings',
  async execute(message, settings) {
    const values = [''];

    for (const [key] of settings.definitions) {
      const value = await settings.formatted(key, message);
      if (value === undefined) {
        values.push(`Value of '${key}' is unset`);
      } else {
        values.push(`Value of '${key}' is set to: ${value}`);
      }
    }

    return message.reply(values.join('\n'));
  }
};
