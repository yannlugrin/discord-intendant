module.exports = {
  name: 'ping',
  description: 'Ping!',
  permissions: ['ADMINISTRATOR'],
  async execute(message) {
    message.channel.send('Pong.');
  }
};
