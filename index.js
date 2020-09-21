// Require (module,files)
const { Discord, fs, displayText, arrayOfFile } = require(`./util/function.js`)
const config = require(`./config.json`);
const Games = require(`./listGames.js`);

// Initialisation and new Proprieties
const bot = new Discord.Client();
bot.jsonFiles = new Discord.Collection();
bot.commands = new Map(); //Map each key is for a game
bot.lang = `Fr`
bot.idMainChannel = 0;

//Connection to the DataBase
bot.mongoose = require("./util/mongoose");

// Constantes
let PREFIX = config.prefix
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


// import events
const loadEvents = (dir = "./events") => {
  
  const eventsPath =  arrayOfFile(dir,'js',false);
  bot.commands.set("main",new Discord.Collection());
  eventsPath.forEach( pathFile => {
    const evt = require(pathFile);
    const evtName = pathFile.split("/").pop().split(".")[0]
  bot.on(evtName,evt.bind(null,bot));
  console.log(`Event loaded: ${evtName}`) ;  
  });
};

// import of commands from main-commands
const loadCommands = () => {
  const commandPath =  arrayOfFile('.','commands.js',false);
  bot.commands.set("main",new Discord.Collection());
  commandPath.forEach( pathFile => {
    const listCommands = require(pathFile);
    console.log(`load command from ${pathFile}`)
    listCommands.commands.forEach( (command) => {
      bot.commands.get("main").set(command.name,command);
      console.log(`commands loaded : ${command.name}`)
    });
  });
};

loadEvents();
loadCommands();

// start the database
bot.mongoose.init();

//Connect bot
bot.login(config.token)

/*
All Events string =
channelCreate
channelDelete
channelPinsUpdate
channelUpdate
debug
emojiCreate
emojiDelete
emojiUpdate
error
guildBanAdd
guildBanRemove
guildCreate
guildDelete
guildIntegrationsUpdate
guildMemberAdd
guildMemberRemove
guildMembersChunk
guildMemberSpeaking
guildMemberUpdate
guildUnavailable
guildUpdate
invalidated
inviteCreate
inviteDelete
message
messageDelete
messageDeleteBulk
messageReactionAdd
messageReactionRemove
messageReactionRemoveAll
messageReactionRemoveEmoji
messageUpdate
presenceUpdate
rateLimit
ready
roleCreate
roleDelete
roleUpdate
shardDisconnect
shardError
shardReady
shardReconnecting
shardResume
typingStart
userUpdate
voiceStateUpdate
warn
webhookUpdate
*/
