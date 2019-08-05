module.exports = {
  name: 'ping',
  description: 'Ping! Pong',
  permissions: ['ADMINISTRATOR'],
  async execute(message) {
    message.channel.send('Pong.');
  }
};
