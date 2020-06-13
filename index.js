const config = require('./config.json');
const Discord = require('discord.js');
const Games = require('./listGames.js');
const bot = new Discord.Client();

//import JSON file: the text content
var fs = require("fs");
var jsonText = JSON.parse(fs.readFileSync("./json/text.json"));
var jsonGames = JSON.parse(fs.readFileSync("./json/games.json"));
var lang = "Fr"
var idMain = 0
var main = "main"
var prefix = "!"
let nameParentChannel = "GAME CHANNELS"
let nameMainChannel = "presentation-channel"
let idMainChannel = 0;

// Collection of Data
var listGamesMessage = new Map() //Map of games launcher { message.id : "name" }
var gamesOngoing = new Map() // Map of the games ongoing { channel.id : Object Game }

var displayText = function (context,key){
  // console.log(text[context][key][lang])
  return jsonText[context][key][lang]
}

//When Bot ready
bot.on('ready', () => {
  console.log('I am ready!');
});

//When Bot add to the guild
/*
Create the main Channel
Display the presentation
*/
//auxiliary function Presentation
var displayPresentation = (channel) => {
  // Display Presentation
  channel.send(displayText(main,"presentation"))

  //Display list of Games and add reaction
  channel.send(displayText(main,"listGames"))
  jsonGames.forEach( element => {
    channel.send(element)
    .then( message => {
      message.react("🆕")
      listGamesMessage.set(message.id,element)
    })
  })
}

//main function Presentation
bot.on('guildCreate', (guild) => {
  console.log("Bot add to the Guild");
  let topicParent = displayText(main,"topicParent")
  let reasonParent = displayText(main,"reasonParent")
  let topicChannel = displayText(main,"topicMain")
  let reasonChannel = displayText(main,"reasonMain")
  listGamesMessage.clear() //empty the Map

  // Bool test of existing
  let bool = false
  let parentChannelPromise;

  // Creation of the repository/category for the games
  // If already exist do nothing
  guild.channels.cache.each(channel => {

    if(channel.type === 'category' && channel.name === nameParentChannel){
      console.log("Category already existing")
      bool = true
      parentChannelPromise = new Promise((resolve,reject) => {resolve(channel)});
    }
  })

  // Else create the Parent Category
  if(bool == false){
    parentChannelPromise = guild.channels.create(nameParentChannel, {
      type : "category",
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
      if(channel.name === nameMainChannel ){
        idMainChannel = channel.id;
        displayPresentation(channel)
        bool = true
      }
    })
    if(bool == true){return true}

    // Create a new channel for the Presentation of the games
    guild.channels.create(nameMainChannel, {
      type : "text",
      topic : topicChannel,
      reason : reasonChannel,
      parent : parentChannel
    })
    .then( (channel) => {
      idMainChannel = channel.id;
      displayPresentation(channel)
    })
  })
})

//When User react to a Emoji
/*
Start a new game
check if it's not the Bot that react to the message
*/
bot.on('messageReactionAdd', (reaction, user) => {
  const message = reaction.message
  const idChannel = message.channel.id
  const guild = message.guild
  const parent = message.channel.parent
  // const member = message.guild.members.get(user.id)
  if(user.bot) return

  // Parse by channel, first the Main Channel
  if(idChannel === idMainChannel){
    if(listGamesMessage.has(message.id)){

      newGame = Games.launcher(parent,listGamesMessage.get(message.id));
      newGame.channel.then( channel => {
        // add to the Map of the Game Channel
        gamesOngoing.set(channel.id,newGame)
      })
      reaction.remove();
      message.react("🆕")
    }
  }else{
    // The Game handle the reaction
    if (gamesOngoing.has(idChannel)){
      gamesOngoing.get(idChannel).handleReaction(reaction,user)
    }
  }
})


/*
When User send a message
Execute the command called
*/
bot.on('message', (message) => {
  if(message.content === "!langEn"){
    lang = "En";
    console.log("lang to En")
  }
  if(message.content === "!langFr"){
    lang = "Fr";
    console.log("lang to Fr")
  }
  if(message.content === "!presentation"){
    console.log(displayText(main,"presentation",lang))
  }
  // Delete all channel in the Category "Game Channels"
  if(message.content === "!deleteAll"){
    let guild = message.guild;
    // Delete the channel
    parentChannel = guild.channels.cache.find(channel => channel.name === nameParentChannel)
    if(parentChannel !== undefined){
      parentChannel.children.each(channel => {
        channel.delete('making room for new channels')
        .catch(console.error);
      })
    }
  }
  // Delete the current channel
  if(message.content === "!deleteThisChannel"){
    let channel = message.channel;
    // Delete the channel
    channel.delete('making room for new channels').catch(console.error)
  }
  // Display again the Presentation text
  if(message.content === "!restart"){
    bot.emit("guildCreate",message.guild);
  }
  // Rename old main channel and create a new one
  if(message.content === "!newPresentationChannel"){
    message.guild.channels.cache.each(channel =>{
      if(channel.name === nameMainChannel){
        channel.setName("\[previous\]\_"+nameMainChannel)
      }
    })
    console.log(message.guild.channels)
    message.guild.fetch().then( guild =>
      bot.emit("guildCreate",guild)
    )
  }

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
