module.exports = {
  name: 'release',
  description: 'Countdown before release',
  permissions: [],
  settings: [
    { key: 'releaseTime', type: 'Time', permissions: ['ADMINISTRATOR'] },
  ],
  async execute(message, settings) {
    const releaseTime = await settings.get('releaseTime');
    if (!releaseTime) return message.channel.send('Pas de release en vue ;-(');

    const now = new Date();
    const countdown = releaseTime - now.getTime();

    if (countdown < 0) return message.channel.send(`T'es à la bourre, la release est passée.`);

    const days = Math.floor(countdown / (1000 * 60 * 60 * 24));
    const hours = Math.floor((countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));

    if (days === 0 && hours < 2) return message.channel.send(`Tic tac... tic tac... c'est dans ${hours * 60 + minutes} minutes.`);
    if (days === 0) return message.channel.send(`Ho &ç#@$£ c'est dans moins de ${hours} heures et ${minutes} minutes !`);
    if (days === 1) return message.channel.send(`Chaud ! C'est Chaud ! encore ${24 + hours} heures et ${minutes} minutes.`);
    if (days < 5 && hours === 0) return message.channel.send(`Presque, on y est presque, encore ${days} jours et ${minutes} minutes.`);
    if (days < 5 && hours === 1) return message.channel.send(`Presque, on y est presque, encore ${days} jours, 1 heure et ${minutes} minutes.`);
    if (days < 5) return message.channel.send(`Presque, on y est presque, encore ${days} jours, ${hours} heures et ${minutes} minutes.`);
    if (hours === 0) return message.channel.send(`Patience, encore ${days} jours et ${minutes} minutes.`);
    if (hours === 1) return message.channel.send(`Patience, encore ${days} jours, 1 heure et ${minutes} minutes.`);
    return message.channel.send(`Patience, encore ${days} jours, ${hours} heures et ${minutes} minutes.`);
  }
};
