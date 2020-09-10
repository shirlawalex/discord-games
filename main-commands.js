const { Discord, fs, displayText, arrayOfFile, displayCommands } = require(`./function.js`)

module.exports  =  {
  commands : [
    {
      name : 'lang',
      description : 'lang arguement : argument is the language to change',
      execute(bot, game, message, args) {
        if(message.guild === null){
          console.log("commands in dm, not working")
          return
        }
        // The command is in a Game Channel, or in private channel else the command affect the Main channel
        const id = message.channel.id
        if(bot.gamesOngoing.has(id)) {
          game = bot.gamesOngoing.get(id);
          console.log(game)
        }else{
          game = bot;
        }

        if(args.length == 0){
          message.channel.send(game.lang);
        }
        else {
          switch(args[0].toLowerCase()){
            case `en` : case `england` : case `angleterre` : case `english` : case `anglais` :
            game.lang = `En`;
            console.log("do")
            break;
            case `fr` : case `france` : case `fr  ench` : case `francais` : case `français` :
            case `be` : case `belgique` : case `belgium` : case `belge` :
            default :
            game.lang = `Fr`
          }
          message.channel.send(`language set to ${game.lang}`);
          console.log(`language set to ${game.lang}`);
        }
      }
    }
    ,{
      name : 'ping',
      description : 'Pong !',
      delete : false,
      execute(bot, game, message, args) {
        message.channel.send("Pong!");

      }
    }
    ,{
      name : 'supp',
      description : 'Pong !',
      delete : true,
      execute(bot, game, message, args) {
        console.log(message.content)
        // message.delete().then( m => console.log(m.deleted) );
        // console.log(message.deleted)
      }
    }
    ,{
      name : 'deleted',
      description : 'give all message that have been deleted !',
      execute(bot, game, message, args) {
        const content = String(message.channel.messages.cache
          // .filter(m => m.deleted)
          .array())
        // .array().toString();
        console.log(content == "")
        console.log(content === "")
        message.channel.send(content == "" ? "none" : content);
      }
    }
    ,{
      name : 'embed',
      description : 'Pong !',
      execute(bot, game, message, args) {
        // Send an embed with a local image inside


        const embed = new Discord.MessageEmbed()
          .setColor("#DC143C")
          .setTitle("Titre de l'embed")
          .setURL("https://google.com")
          .setDescription("Description de l'embed")
          .setThumbnail(bot.user.displayAvatarURL())
          .addField("je suis un Champ","et je suis sa valeur")
          .addFields(
            { value :":x::x::x::x::x:",inline : true},
            {name : "un champ 2", value :" sa valaue",inline : true},
            {name : "un champ 3", value :" sa valaue",inline : false},
            {name : "un champ 4", value :" sa valaue",inline : true}
          )
          .setImage(bot.user.displayAvatarURL())
          .setTimestamp()
          .setAuthor("Auteur",bot.user.displayAvatarURL(),"https://google.com")
          .setFooter("Je suis sur le pied du footer",bot.user.displayAvatarURL());


        message.channel.send(embed)
        .then(m => m.react("❌"));

      }
    }
    ,{
      name : 'welcome',
      description : 'Display Welcome text',
      execute(bot, game, message, args) {
        message.channel.send(displayText(bot,`text`,bot.main,`welcome`,bot.lang));
      }
    }
    ,{
      name : 'commands',
      description : 'Display all commands loaded (You need to launch a game to have the commands)',
      execute(bot, game, message, args) {
        // message.channel.send(bot);
        displayCommands(bot,message);
      }
    }
    ,{
      name : 'deleteall',
      description : `Delete all channel in the Category Game Channels`,

      execute(bot, game, message, args) {
        const guild = message.guild;
        // Delete the channel
        const parentChannel = guild.channels.cache.find(channel => channel.name === bot.nameParentChannel)
        if(parentChannel !== undefined){
          parentChannel.children.each(channel => {
            channel.delete(`making room for new channels`)
            .catch(console.error);
          })
        }
      }
    }
    ,{
      name : 'restart',
      description : 'Restart the Main Channel Presentation Text and create it if needed',
      execute(bot, game, message, args) {
        if(message.channel.type == "text"){
          bot.emit(`guildCreate`,message.guild);
        }
      }
    }
    ,{
      name : 'newmainchannel',
      description : 'rename old Main Channel and create a new one',
      execute(bot, game, message, args) {
        message.guild.channels.cache.each(channel =>{
          if(channel.name === bot.nameMainChannel){
            channel.setName(`\[previous\]\_`+bot.nameMainChannel)
          }
        })
        console.log(message.guild.channels)
        message.guild.fetch().then( guild =>
          bot.emit(`guildCreate`,guild)
        )
      }
    }

  ]

}
