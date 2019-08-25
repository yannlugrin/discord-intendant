module.exports = {
  settings: [
    { key: 'logChannel', type: 'Channel', permissions: ['ADMINISTRATOR'] },
  ],
  listeners: [
    {
      name: 'ready',
      description: 'Ready event runs once when bot is ready',
      async execute() {
        console.info('Bot is Ready!');
      }
    },
  ]
};
