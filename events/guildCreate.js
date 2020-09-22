const { Discord, displayText } = require(`../util/function.js`)
const config = require(`../config.json`);
const Games = require(`../listGames.js`);

const mongoose = require("mongoose");
const { DEFAULTSETTINGS : defaults} = require("../config.json");
const { Guild } = require("../models/index");



//When Bot add to the guild
/*
Create the main Channel
Display the presentation
*/
//auxiliary function Presentation
var displayPresentation = (bot,channel) => {
  // Display Presentation
  channel.send( displayText(bot,`text`,bot.main,`presentation`,bot.lang))
  channel.send( displayText(bot,`text`,bot.main,`help`,bot.lang))

  //version embed
  const embed = new Discord.MessageEmbed()
  .setTitle(bot.nameParentChannel)
  .setDescription(displayText(bot,`text`,bot.main,`presentation`,bot.lang))
  .addField("Information",displayText(bot,`text`,bot.main,`help`,bot.lang));

  // channel.send(embed)

  //Display list of Games and add reaction
  channel.send( displayText(bot,`text`,bot.main,`listGames`,bot.lang));
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
module.exports = async (bot,guild) => {
  console.log(`Bot add to the Guild`);

  //Add to the DB 
  const newGuild = {
    guildID : guild.id,
    guildName: guild.name
  };

  await bot.saveGuild(newGuild);
     


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
    console.log(`Creating category`)
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
        displayPresentation(bot,channel)
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
      displayPresentation(bot,channel)

    })
  })
}