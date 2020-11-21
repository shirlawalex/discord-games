const { Discord} = require(`../util/function.js`)

/* 
//*When Bot add to the guild

//*Create the main Channel
//*Display the presentation

//*auxiliary function Presentation
var  displayPresentation = (bot,channel,settings) => {
  const guild = channel.guild;
  //* Display Presentation
  channel.send( bot.displayText(`text`,bot.main,`presentation`,settings.lang))
  channel.send( bot.displayText(`text`,bot.main,`help`,settings.lang))

  //* version embed
  const embed = new Discord.MessageEmbed()
  .setTitle(settings.nameParentChannel)
  .setDescription(bot.displayText(`text`,bot.main,`presentation`,settings.lang))
  .addField("Information",bot.displayText(`text`,bot.main,`help`,settings.lang));

  // channel.send(embed)

  //* Display list of Games and add reaction
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

//* main function Presentation
module.exports = async (bot,guild) => {
  console.log(`Bot add to the Guild`);

  //* Add to the DB 
  const newGuild = {
    guildID : guild.id,
    guildName: guild.name
  };

  const settings = await bot.saveGuild(newGuild);

  //* Loading content of variables
  const topicParent =  bot.displayText(`text`,bot.main,`topicParent`,settings.lang)
  const reasonParent =  bot.displayText(`text`,bot.main,`reasonParent`,settings.lang)
  const topicChannel =  bot.displayText(`text`,bot.main,`topicMain`,settings.lang)
  const reasonChannel =  bot.displayText(`text`,bot.main,`reasonMain`,settings.lang)
  await bot.clearlistGames(guild); //empty the Map

  
  //* Creation of the repository/category for the games
  //* If already exist do nothing
  
  let parentChannel = await guild.channels.cache.get(settings.idParentChannel);

  if(parentChannel){
    console.log(`Category already existing`)
  }else{
    //* Else create the Parent Category
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

  //* Wait for the parent category to be created

  let mainChannel = parentChannel.children.get(settings.idMainChannel);
  //* If Presentation Channel already exist just clean et display again
  if(mainChannel){
    console.log("main channel already existing");
    displayPresentation(bot,mainChannel,settings)
  }else{
    console.log("Create new main Channel");

    //* Create a new channel for the Presentation of the games
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

  //* Create a log channel
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
*/

module.exports = async (bot,guild) => {
  //* Add to the DB 
  const newGuild = {
    guildID : guild.id,
    guildName: guild.name
  };

  const settings = await bot.saveGuild(newGuild);

  const embed = new Discord.MessageEmbed()
  .setTitle("Merci de m'avoir installé")
  .setDescription("Pour lancer le bot, tapez la commande !launch")
  .addField("Explication","Cela va créer une catégorie avec un channel de Jeux où vous pourrez lancer les jeux en cliquant sur l'emoji New en dessous du nom du Jeux.")
  .addField("Problème","C'est possible qu'il y ai des conflits entre les permissions des rôles, si c'est le cas veuillez créer un rôle (exemple : 'role_jeux') qui donnera accès aux joueurs de pouvoir ecrire,réagir et lire les anciens message sur ce channel")
  .addField("Commandes","Pour lancer le bot !launch.\nPour avoir la liste des commandes faites !commands. \nPour supprimer toutes les parties !deleteall. \nPour rénitialisé le bot (en cas de bug) !restart ")
  .addField("Conseil","Je vous recommande de mettre la catégorie en sourdine pour tous, et d'enlever les notifications des mentions aussi")
  .addField("Disclaimer","le bot est fait par un étudiant alors soyez indulgent haha\nAmusez vous bien :)"); ; 

  let channel = guild.channels.cache.find(e => e.type == "text" && e.permissionsFor(bot.user));
  channel.send(embed);
};       