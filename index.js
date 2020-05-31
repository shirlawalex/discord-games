const Secret = require('./secret.js');
const Discord = require('discord.js');
const Avalon = require('./Games/avalon.js');
// const Games = require('listGames.js');
const bot = new Discord.Client();


bot.on('ready', () => {
  console.log('I am ready!');
});

bot.on('message', (message) => {
  // Games.matchEmoji(message);
  Avalon.parse(message)
  // Avalon.helloWorld(message)
});



  bot.login(Secret.token())
