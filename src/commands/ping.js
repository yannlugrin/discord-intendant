module.exports = {
  name: 'ping',
  description: 'Ping!',
  permissions: ['ADMINISTRATOR'],
  execute(message) {
    message.channel.send('Pong.');
  }
};
