const { Discord, displayText } = require(`../util/function.js`)
const config = require(`../config.json`);
const mongoose = require("mongoose");
const { DEFAULTSETTINGS : defaults} = require("../config.json");
const { Guild } = require("../util/models/index");



//When Bot add to the guild
/*
Create the main Channel
Display the presentation
*/
//auxiliary function Presentation
var  displayPresentation = (bot,channel,settings) => {
  const guild = channel.guild;
  // Display Presentation
  channel.send( bot.displayText(`text`,bot.main,`presentation`,settings.lang))
  channel.send( bot.displayText(`text`,bot.main,`help`,settings.lang))

  //version embed
  const embed = new Discord.MessageEmbed()
  .setTitle(settings.nameParentChannel)
  .setDescription(bot.displayText(`text`,bot.main,`presentation`,settings.lang))
  .addField("Information",bot.displayText(`text`,bot.main,`help`,settings.lang));

  // channel.send(embed)

  //Display list of Games and add reaction
  channel.send( bot.displayText(`text`,bot.main,`listGames`,settings.lang));
  const jsonGames = bot.jsonFiles.get(`games`)
  jsonGames.forEach( element => {
    channel.send(element)
    .then( message => {
      message.react(`🆕`)
      bot.setListGames(guild,message.id,element);
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

  const settings = await bot.saveGuild(newGuild);

  // Loading content of variables
  const topicParent =  bot.displayText(`text`,bot.main,`topicParent`,settings.lang)
  const reasonParent =  bot.displayText(`text`,bot.main,`reasonParent`,settings.lang)
  const topicChannel =  bot.displayText(`text`,bot.main,`topicMain`,settings.lang)
  const reasonChannel =  bot.displayText(`text`,bot.main,`reasonMain`,settings.lang)
  await bot.clearlistGames(guild); //empty the Map
  // Bool test of existing
  let bool = false
  let parentChannelPromise;

  // Creation of the repository/category for the games
  // If already exist do nothing

  guild.channels.cache.each(channel => {

    if(channel.type === `category` && channel.name === settings.nameParentChannel){
      console.log(`Category already existing`)
      bool = true
      parentChannelPromise = new Promise((resolve,reject) => {resolve(channel)});
    }
  })

  // Else create the Parent Category
  if(bool == false){
    console.log(`Creating category`)
    parentChannelPromise = guild.channels.create(settings.nameParentChannel, {
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
      if(channel.name === settings.nameMainChannel ){
        displayPresentation(bot,channel,settings)
        bot.updateGuild(guild,{idMainChannel: channel.id});

        bool = true
      }
    })

    if(!bool){
      // Create a new channel for the Presentation of the games
      guild.channels.create(settings.nameMainChannel, {
        type : `text`,
        topic : topicChannel,
        reason : reasonChannel,
        parent : parentChannel,
        permissionOverwrites: [
          {
            id: guild.roles.everyone,
            deny: ['SEND_MESSAGES'],
          }
        ]
      })
      .then( (channel) => {

        displayPresentation(bot,channel,settings)
        bot.updateGuild(guild,{idMainChannel: channel.id});

      })
     }


    //Create a log channel
    guild.channels.create(settings.nameLogChannel, {
      type : `text`,
      topic : "log channel",
      reason : "every message is send here too",
      parent : parentChannel,
      permissionOverwrites: [
        {
          id: guild.roles.everyone,
          deny: ['VIEW_CHANNEL'],
        }
      ]
    })
    .then( (channel) => {
      bot.updateGuild(guild,{idLogChannel:channel.id});
      const timeElapsed = Date.now();
      const today = new Date(timeElapsed);
      channel.send(`Start of the log : ${today.toUTCString()}`);
    }).catch(console.error);


  })

  
}