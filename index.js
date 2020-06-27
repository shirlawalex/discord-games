// Require (module,files)
const { Discord, fs, displayText, arrayOfFile } = require(`./function.js`)
const config = require(`./config.json`);
const Games = require(`./listGames.js`);


// Initialisation and new Proprieties
const bot = new Discord.Client();
bot.jsonFiles = new Discord.Collection();
bot.commands = new Discord.Collection();
bot.lang = `Fr`
bot.idMainChannel = 0;

// Constantes
const PREFIX = config.prefix
bot.main = `main`
bot.nameParentChannel = `GAME CHANNELS`
bot.nameMainChannel = `presentation-channel`

// import JSON file: the text content and put in a Collection
const jsonPath =  arrayOfFile('./json','.json',true);
jsonPath.forEach( pathFile => {
  const key = pathFile.split("/").pop().slice(0,-5);
  bot.jsonFiles.set(key,JSON.parse(fs.readFileSync(pathFile)));
});

// import of commands from main-commands
const commandPath =  arrayOfFile('.','commands.js',false);
commandPath.forEach( pathFile => {
  const listCommands = require(pathFile);
  listCommands.commands.forEach( (command) => {
    console.log(command.name,command)
    bot.commands.set(command.name,command);
  });
});




// Collection of Data
bot.listGamesMessage = new Map() //Map of games launcher { message.id : `name` }
bot.gamesOngoing = new Map() // Map of the games ongoing { channel.id : Object Game }


////////////////  HANDLERS

//When Bot ready
bot.on(`ready`, () => {
  console.log(`I am ready!`);
});

//When Bot add to the guild
/*
Create the main Channel
Display the presentation
*/
//auxiliary function Presentation
var displayPresentation = (channel) => {
  // Display Presentation
  channel.send( displayText(bot,`text`,bot.main,`presentation`,bot.lang))

  //Display list of Games and add reaction
  channel.send( displayText(bot,`games`,bot.main,`listGames`,bot.lang));
  const jsonGames = bot.jsonFiles.get(`games`)
  jsonGames.forEach( element => {
    channel.send(element)
    .then( message => {
      message.react(`🆕`)
      bot.listGamesMessage.set(message.id,element)
    })
  })
}

//main function Presentation
bot.on(`guildCreate`, (guild) => {
  console.log(`Bot add to the Guild`);

  // Loading content of variables
  const topicParent =  displayText(bot,`text`,bot.main,`topicParent`,bot.lang)
  const reasonParent =  displayText(bot,`text`,bot.main,`reasonParent`,bot.lang)
  const topicChannel =  displayText(bot,`text`,bot.main,`topicMain`,bot.lang)
  const reasonChannel =  displayText(bot,`text`,bot.main,`reasonMain`,bot.lang)
  bot.listGamesMessage.clear() //empty the Map

  // Bool test of existing
  let bool = false
  let parentChannelPromise;

  // Creation of the repository/category for the games
  // If already exist do nothing
  guild.channels.cache.each(channel => {

    if(channel.type === `category` && channel.name === bot.nameParentChannel){
      console.log(`Category already existing`)
      bool = true
      parentChannelPromise = new Promise((resolve,reject) => {resolve(channel)});
    }
  })

  // Else create the Parent Category
  if(bool == false){
    parentChannelPromise = guild.channels.create(bot.nameParentChannel, {
      type : `category`,
      topic : topicParent,
      reason : reasonParent
    })
  }

  // Reset of bool test of existing
  bool = false

  // Wait for the parent category to be created
  parentChannelPromise.then( parentChannel => {

    // If Presentation Channel already exist just clean et display again
    parentChannel.children.each( channel => {
      if(channel.name === bot.nameMainChannel ){
        bot.idMainChannel = channel.id;
        displayPresentation(channel)
        bool = true
      }
    })
    if(bool == true){return true}

    // Create a new channel for the Presentation of the games
    guild.channels.create(bot.nameMainChannel, {
      type : `text`,
      topic : topicChannel,
      reason : reasonChannel,
      parent : parentChannel
    })
    .then( (channel) => {
      bot.idMainChannel = channel.id;
      displayPresentation(channel)
    })
  })
})

//When User react to a Emoji
/*
Start a new game
check if it`s not the Bot that react to the message
*/
bot.on(`messageReactionAdd`, (reaction, user) => {
  const message = reaction.message
  const idChannel = message.channel.id
  const guild = message.guild
  const parent = message.channel.parent
  // const member = message.guild.members.get(user.id)
  if(user.bot) return

  // Parse by channel, first the Main Channel
  if(idChannel === bot.idMainChannel){
    if(bot.listGamesMessage.has(message.id)){
      newGame = Games.launcher(bot,parent,bot.listGamesMessage.get(message.id));
      if(newGame !== undefined){
        newGame.channel.then( channel => {
          // add to the Map of the Game Channel
          bot.gamesOngoing.set(channel.id,newGame)
          newGame.action();
        })
      }else{
        console.log("game undefined")
      }
      reaction.remove();
      message.react(`🆕`)
    }
  }else{
    // handle a reaction in a Game channel
    if (bot.gamesOngoing.has(idChannel)){
      bot.gamesOngoing.get(idChannel).handleReaction(reaction,user)
    }

    // handle reaction in private channel
    // if ( user.channnel ){}

  }
})


/*
When User send a message
Execute the command called
*/
bot.on(`message`, (message) => {
  if(!message.content.startsWith(PREFIX) || message.author.bot) return;

  const args = message.content.slice(PREFIX.length).split(/ +/);
  const command = args.shift().toLowerCase();

  // in a game channel
  const id = message.channel.id
  if(bot.gamesOngoing.has(id)) console.log("in channel game")

  // any channel
  if(!bot.commands.has(command)) return;
  bot.commands.get(command).execute(bot,message,args);

});

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
