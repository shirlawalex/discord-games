const { Discord} = require(`../util/function.js`)

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
      setTimeout(function(){ message.fetch(true)},3000);
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

  
  // Creation of the repository/category for the games
  // If already exist do nothing
  
  let parentChannel = await guild.channels.cache.get(settings.idParentChannel);

  if(parentChannel){
    console.log(`Category already existing`)
  }else{
    // Else create the Parent Category
    console.log(`Creating category`)
    await guild.channels.create(settings.nameParentChannel, {
      type : `category`,
      topic : topicParent,
      reason : reasonParent
    }).then( category => {
      bot.updateGuild(guild,{idParentChannel: category.id})
      parentChannel = category;
    })
  }

  // Wait for the parent category to be created

  let mainChannel = parentChannel.children.get(settings.idMainChannel);
  // If Presentation Channel already exist just clean et display again
  if(mainChannel){
    console.log("main channel already existing");
    displayPresentation(bot,mainChannel,settings)
  }else{
    console.log("Create new main Channel");

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
  if(settings.logActivated){
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const txt = `Start of the log : ${today.toUTCString()}`;

    let logChannel = guild.channels.cache.get(settings.idLogChannel);
    if(logChannel == undefined){
      logChannel = bot.createLogChannel(guild,data,txt);
    }else{
      logChannel.send(txt);
    }
  }
}