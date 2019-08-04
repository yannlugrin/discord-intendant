const Discord = require('discord.js');
const { DefaultOptions } = require('./util/constants');

class Bot {
  constructor(options = {}) {
    this.options = Discord.Util.mergeDefault(DefaultOptions, options);
    this.client = new Discord.Client();

    this.client.once('ready', () => {
      console.log('Bot is Ready!');
    });
  }

  start() {
    this.client.login(this.options.token);
  }
}

module.exports = Bot;
