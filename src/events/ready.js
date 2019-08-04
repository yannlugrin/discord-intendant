module.exports = {
  name: 'ready',
  description: 'Ready event runs once when bot is ready',
  async execute() {
    console.info('Bot is Ready!');
  }
};
