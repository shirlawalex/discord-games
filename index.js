// Require (module,files)
const { Discord, fs, displayText, arrayOfFile } = require(`./util/function.js`)
const config = require(`./config.json`);
const Games = require(`./listGames.js`);
const {loadCommands, loadEvents} = require ("./util/loader.js");

// Initialisation and new Proprieties
const bot = new Discord.Client();


bot.jsonFiles = new Discord.Collection();
bot.commands = new Map(); //Map each key is for a game
bot.lang = `Fr`
bot.idMainChannel = 0;

//Connection to the DataBase
bot.mongoose = require("./util/mongoose");

// Constantes
bot.prefix = config.prefix
bot.main = `main`
bot.nameParentChannel = `GAME CHANNELS`
bot.nameMainChannel = `presentation-channel`

// Collection of Data
bot.listGamesMessage = new Map() //Map of games launcher { message.id : `name` }
bot.gamesOngoing = new Map() // Map of the games ongoing { channel.id : Object Game }


// import JSON file: the text content and put in a Collection
const jsonPath =  arrayOfFile('./json','.json',true);
jsonPath.forEach( pathFile => {
  const key = pathFile.split("/").pop().slice(0,-5);
  bot.jsonFiles.set(key,JSON.parse(fs.readFileSync(pathFile)));
});


loadEvents(bot);
loadCommands(bot);

// start the database
bot.mongoose.init();

//Connect bot
bot.login(config.token)
