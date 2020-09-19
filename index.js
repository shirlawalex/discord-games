// Require (module,files)
const { Discord, fs, displayText, arrayOfFile } = require(`./util/function.js`)
const config = require(`./config.json`);
const Games = require(`./listGames.js`);

const mongoose = require("mongoose");
const { DEFAULTSETTINGS : defaults} = require("./config.json");
const { Guild } = require("discord.js");


const guildSchema = mongoose.Schema({
  _id : mongoose.Schema.Types.ObjectId,
  guildID : String,
  guildName : String, 
  prefix: {
    "type" : String,
    "default": defaults.prefix
  },
  logChannel: {
    "type": String,
    "default": defaults.logChannel
  },
  welcomemessage: {
    "type" : String,
    "default" : defaults.welcomeMessage
  }
});

const Model = mongoose.model("Guild",guildSchema);

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

// start the database
bot.mongoose.init();

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

////////////////  HANDLERS
// bot.on(`ready`, () => {
//   console.log(`Logged in as ${bot.user.tag}!`);
// });

//When Bot add to the guild
/*
Create the main Channel
Display the presentation
*/
//auxiliary function Presentation
// var displayPresentation = (channel) => {
//   // Display Presentation
//   channel.send( displayText(bot,`text`,bot.main,`presentation`,bot.lang))
//   channel.send( displayText(bot,`text`,bot.main,`help`,bot.lang))

//   //version embed
//   const embed = new Discord.MessageEmbed()
//   .setTitle(bot.nameParentChannel)
//   .setDescription(displayText(bot,`text`,bot.main,`presentation`,bot.lang))
//   .addField("Information",displayText(bot,`text`,bot.main,`help`,bot.lang));

//   // channel.send(embed)

//   //Display list of Games and add reaction
//   channel.send( displayText(bot,`text`,bot.main,`listGames`,bot.lang));
//   const jsonGames = bot.jsonFiles.get(`games`)
//   jsonGames.forEach( element => {
//     channel.send(element)
//     .then( message => {
//       message.react(`🆕`)
//       bot.listGamesMessage.set(message.id,element)
//     })
//   })
// }

//main function Presentation
// bot.on(`guildCreate`, (guild) => {
//   console.log(`Bot add to the Guild`);

//   //Add to the DB 
//   const newGuild = {
//     guildID : guild.id,
//     guildName: guild.name
//   };

//   const merged = Object.assign({_id:mongoose.Types.ObjectId()},newGuild);
//   const createGuild = new Model(merged);
//   createGuild.save().then(g => console.log(`New guild -> ${g.guildName}`));
  
//   // Loading content of variables
//   const topicParent =  displayText(bot,`text`,bot.main,`topicParent`,bot.lang)
//   const reasonParent =  displayText(bot,`text`,bot.main,`reasonParent`,bot.lang)
//   const topicChannel =  displayText(bot,`text`,bot.main,`topicMain`,bot.lang)
//   const reasonChannel =  displayText(bot,`text`,bot.main,`reasonMain`,bot.lang)
//   bot.listGamesMessage.clear() //empty the Map

//   // Bool test of existing
//   let bool = false
//   let parentChannelPromise;

//   // Creation of the repository/category for the games
//   // If already exist do nothing

//   guild.channels.cache.each(channel => {

//     if(channel.type === `category` && channel.name === bot.nameParentChannel){
//       console.log(`Category already existing`)
//       bool = true
//       parentChannelPromise = new Promise((resolve,reject) => {resolve(channel)});
//     }
//   })

//   // Else create the Parent Category
//   if(bool == false){
//     console.log(`Creating category`)
//     parentChannelPromise = guild.channels.create(bot.nameParentChannel, {
//       type : `category`,
//       topic : topicParent,
//       reason : reasonParent
//     })
//   }

//   // Reset of bool test of existing
//   bool = false

//   // Wait for the parent category to be created
//   parentChannelPromise.then( parentChannel => {

//     // If Presentation Channel already exist just clean et display again
//     parentChannel.children.each( channel => {
//       if(channel.name === bot.nameMainChannel ){
//         bot.idMainChannel = channel.id;
//         displayPresentation(channel)
//         bool = true
//       }
//     })
//     if(bool == true){return true}

//     // Create a new channel for the Presentation of the games
//     guild.channels.create(bot.nameMainChannel, {
//       type : `text`,
//       topic : topicChannel,
//       reason : reasonChannel,
//       parent : parentChannel
//     })
//     .then( (channel) => {
//       bot.idMainChannel = channel.id;
//       displayPresentation(channel)

//     })
//   })
// })

// //When User react to a Emoji
// /*
// Start a new game
// check if it`s not the Bot that react to the message
// */
// bot.on(`messageReactionAdd`, (reaction, user) => {
//   const message = reaction.message;
//   const idChannel = message.channel.id;
//   const guild = message.guild;
//   const parent = message.channel.parent;
//   // const member = message.guild.members.get(user.id)
//   if(user.bot) return;

//   // Parse by channel, first the Main Channel
//   if(idChannel === bot.idMainChannel){
//     // Emoji to start new games
//     if(bot.listGamesMessage.has(message.id)){
//       newGame = Games.launcher(bot,parent,bot.listGamesMessage.get(message.id));
//       if(newGame !== undefined){
//         newGame.promiseChannel.then( channel => {
//           // add to the Map of the Game Channel
//           bot.gamesOngoing.set(channel.id,newGame)
//           newGame.action();
//         const msg = displayText(bot,`text`,bot.main,"channelCreated",bot.lang) +" <#"+ newGame.channel.id +">"
//         message.channel.send(msg);
//       });
//       }else{
//         console.log("game undefined");
//       }
//       reaction.remove();
//       message.react(`🆕`);
//       return;
//     }
//   }else{
//     // handle a reaction in a Game channel
//     if (bot.gamesOngoing.has(idChannel)){
//       bot.gamesOngoing.get(idChannel).handleReaction(reaction,user)
//     }

//     // handle reaction in private channel
//     if ( message.channel.type == "dm" ){
//         console.log("emoji detected on private/dm msg");
//         bot.gamesOngoing.forEach((item, i) => {
//           const game = item
//           const name = game.name
//           const cache = game.cache

//           if(cache.has(message.id)){
//             game.handleReaction(reaction,user)
//           }else{
//             console.log("not in cache")
//           }
//       });
//     }
//   }
// })


// //When User send a message

// var execute = (bot,env,message) => {
//   const args = env.args ;
//   const id = env.id ;
//   const commandName = env.commandName ;
//   const game = env.game ;
//   const name = env.name ;

//   const command = bot.commands.get(name).get(commandName);

//   command.execute(bot,game,message,args);

//   if(command.delete != undefined && command.delete){
//     message.delete({timeout : 10000}).then(msg => console.log(`Deleted message from ${msg.author.username} after 10 seconds.`)).catch(console.error);
//   }
// }
// /*
// Execute the command called
// */
// bot.on(`message`, (message) => {
//   if(!message.content.startsWith(PREFIX) || message.author.bot) return;

//   //all variables in one environnement call "env"
//   const env = new Object()
//   env.args = message.content.slice(PREFIX.length).split(/ +/);
//   env.commandName = env.args.shift().toLowerCase();

//   // in a game channel
//   /*
//   homonym commands from game rewrite the main commands
//   */
//   env.id = message.channel.id
//   if(bot.gamesOngoing.has(env.id)) {
//     env.game = bot.gamesOngoing.get(env.id);
//     env.name = env.game.name;
//     if(bot.commands.has(env.name)){
//       if(bot.commands.get(env.name).has(env.commandName)){
//         execute(bot,env,message)
//         // bot.commands.get(env.name).get(command).execute(bot,game,message,args);
//       }
//     }
//   }

//   //in private channel
//   /* forbiden for the moment because can't check which server is cuncern */
//   /* Maybe check ig message is in the cache of game or before the command the name of the game or quote */
//   // if(message.channel.type == "dm"){
//   //   console.log("dm send");
//   //   bot.gamesOngoing.forEach((item, i) => {
//   //     const game = item;
//   //     const name = item.name;
//   //     if(bot.commands.get(name).has(commandName)){
//   //       bot.commands.get(name).get(commandName).execute(bot,game,message,args);
//   //     }
//   //   });
//   // }else{
//   //   // console.log(message)
//   // }

//   // any channel
//   env.name = "main"
//   env.game = undefined;
//   if(!bot.commands.get(env.name).has(env.commandName)) return;
//   execute(bot,env,message)
//   // bot.commands.get("main").get(commandName).execute(bot,undefined,message,args);

// });

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
