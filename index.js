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
let nameMainChannel = "presentation-channel"
var listGamesMessage = new Map() //Map of games launcher { message.id : "name" }

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
bot.on('guildCreate', (server) => {
  console.log("Bot add to the Guild");
  let topicChannel = displayText(main,"topic")
  let reasonChannel = displayText(main,"reason")
  listGamesMessage.clear() //empty the Map
  //if already exist just clean et display again
  // console.log(server.channels)
  let bool = false
  server.channels.cache.each(channel =>{
    if(channel.name === nameMainChannel){
      displayPresentation(channel)
      bool = true
    }
  })
  if(bool == true){return true}

  // Create a new channel for the Presentation of the games
  server.channels.create(nameMainChannel, {
    type : "text",
    topic : topicChannel,
    reason : reasonChannel
  })
  .then( (channel) => {
    displayPresentation(channel)
  })
})

//When User react to a Emoji
/*
Start a new game
check if it's not the Bot that react to the message
*/
bot.on('messageReactionAdd', (reaction, user) => {
  const message = reaction.message
  const guild = message.guild
  // const member = message.guild.members.get(user.id)
  if(user.bot) return

  if(listGamesMessage.has(message.id)){
    Games.launch(guild,listGamesMessage.get(message.id));
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
  //Display again the Presentation text
  if(message.content === "!restart"){
    bot.emit("guildCreate",message.guild);
  }
  //Rename old main channel and create a new one
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
