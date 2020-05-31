const Secret = require('./secret.js');
const Discord = require('discord.js');
const Games = require('./listGames.js');
const bot = new Discord.Client();

//import JSON file: the text content
var fs = require("fs");
var contents = fs.readFileSync("./text.json");
var text = JSON.parse(contents);
var lang = "Fr"

var displayText = function (context,key,lang){
  // console.log(text[context][key][lang])
  return text[context][key][lang]
}

//When Bot ready
bot.on('ready', () => {
  console.log('I am ready!');
});

//When Bot add to the guild
/*
  Display the presentation
*/


//When User react to a Emoji
/*
  Start a new game
*/



//When User send a message
/*
  Execute the command called
*/
bot.on('message', (message) => {
  Games.parseAll(message);
});

//Connect bot
bot.login(Secret.token())
