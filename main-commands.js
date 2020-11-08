const client = require("./util/client.js");
const { Discord, fs } = require(`./util/function.js`)

module.exports  =  {
  commands : [
    {
      name : 'lang',
      parent : 'main',
      default : "", 
      args : false,
      usage :  '',
      type : "information",
      description: 'lang arguement : argument is the language to change',
      execute(bot, game, message,args, settings) {
        if(message.guild === null){
          return
        }
        // The command is in a Game Channel, or in private channel else the command affect the Main channel
        const id = message.channel.id
        if(bot.gamesOngoing.has(id)) {
          game = bot.gamesOngoing.get(id);
          console.log("TODO change lang in a game not implemented");
        }else{ game = {}}

        if(args.length == 0){
          message.channel.send("language is "+settings.lang);
        }
        else {
          switch(args[0].toLowerCase()){
            case `en` : case `england` : case `angleterre` : case `english` : case `anglais` :
            bot.updateGuild(message.guild,{lang:"En"});
            game.lang = `En`;
            break;
            case `fr` : case `france` : case `fr  ench` : case `francais` : case `français` :
            case `be` : case `belgique` : case `belgium` : case `belge` :
            default :
            game.lang = `Fr`
            bot.updateGuild(message.guild,{lang:"Fr"});

          }
          message.channel.send(`language set to ${game.lang}`);
          // console.log(`language set to ${game.lang}`);
        }
      }
    }
    ,{
      name : 'ping',
      parent : 'main',
      default : "", 
      args : false,
      usage :  '',
      type : "information",
      description: 'Pong !',
      delete : false,
      execute(bot, game, message,args, settings) {
        message.channel.send("Pong!");

      }
    } 
    // ,{
    //   name : 'kill',
    //   parent : 'main',
    //   description : 'kill the bot.',
    //   delete : false,
    //   async execute(bot, game, message,args, settings) {
    //     await message.delete();
    //     await message.channel.send("Le bot s'eteint");
    //     process.exit();
    //   }
    // } 
    ,{
      name : 'gamestat',
      parent : 'main',
      default : "", 
      args : false,
      usage :  '',
      type : "information",
      description: 'Display all games on going',
      delete : false,
      execute(bot, game, message,args, settings) {
        message.channel.send("There is all game on going in the bot");          
        // message.channel.send(bot.gamesOngoing);          
        bot.gamesOngoing.forEach((v,k,m) => {
          message.channel.send(`${v.name} in ${k} at ${v.channel.guild.name}`);          
        }) 
      }
    } 
    ,{
      name : 'config',
      parent : 'main',
      default : "", 
      args : false,
      usage :  '',
      type : "admin",
      description: 'Change some parameter in the database',
      delete : false,
      async execute(bot, game, message, args,settings) {
        const getSetting = args[0];
        const newSetting = args.slice(1).join(" ");

        switch(getSetting){
          case "prefix": 
            if(newSetting){
              let found = await bot.updateGuild(message.guild,{prefix:newSetting});
              if(found){
                message.channel.send(`${bot.displayText("text","log","prefixUpdate",settings.lang)} \`${settings.prefix}\` -> \`${newSetting}\`.`);
              }else{
                message.channel.send(bot.displayText("text","log","errorAction",settings.lang)+bot.displayText("text","log","dbMissing",settings.lang) )
              }
            }else{
              message.channel.send("prefix : "+settings.prefix);
            }
            break;
          default:
            message.channel.send("not allowed to change this key or key not valid")
            break;
        }
      }
    }
    ,{
      name : 'supp',
      parent : 'main',
      default : "", 
      args : false,
      usage :  '',
      type : "information",
      description: 'Delete the message after a time',
      delete : true,
      execute(bot, game, message,args, settings) {
        //do nothing just delete the message
      }
    }
    ,{
      name : 'embed',
      parent : 'main',
      default : "", 
      args : false,
      usage :  '',
      type : "information",
      description: 'A extraordinary embed message',
      execute(bot, game, message,args, settings) {
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
      parent : 'main',
      args : true,
      usage :  '<@mention>',
      type : "information",
      description: 'Display Welcome text to a user',
      execute(bot, game, message,args, settings) {
        message.channel.send(bot.displayText(`text`,bot.main,`welcome`,settings.lang)+" "+args[0]);
      }
    }
    ,{
      name : 'commands',
      parent : 'main',
      default : "main", 
      args : true,
      usage :  '<Name Game> <Command name>',
      type : "information",
      description: 'Display all commands from a Game. If you want main commands put \"main\" for <Name Game>',
      execute(bot, game, message,args, settings) {
        if(args.length == 2){
          bot.displayCommands(message,args[0],args[1],settings);
        }else{
          bot.displayCommands(message,args[0],"",settings);
        }
      }
    }
    ,{
      name : 'deleteall',
      parent : 'main',
      default : "", 
      args : false,
      usage :  '',
      type : "information",
      description: `Delete all channel in the Category Game Channels`,

      execute(bot, game, message, args,settings) {
        const guild = message.guild;
        // Delete the channel
        const parentChannel = guild.channels.cache.find(channel => channel.name === settings.nameParentChannel)
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
      parent : 'main',
      default : "", 
      args : false,
      usage :  '',
      type : "information",
      description: 'Restart the Main Channel Presentation Text and create it if needed',
      execute(bot, game, message,args, settings) {
        if(message.channel.type == "text"){
          bot.emit(`guildCreate`,message.guild);
        }
      }
    }
    ,{
      name : 'deleterole',
      parent : 'main',
      default : "", 
      args : false,
      usage :  '',
      type : "information",
      description: 'Delete rôles created by discord-games (check that the bot has the permissions)!',
      execute(bot,game,message,args, settings) {
        message.guild.roles.cache.forEach((v,k,m) => {
          if(v.name.startsWith("Leader of")){
            v.delete("Deleting role").then(deleted => console.log(`Deleted role ${deleted.name}`))
          }

        })
      }
    }
    ,{
      name : 'newmainchannel',
      parent : 'main',
      default : "", 
      args : false,
      usage :  '',
      type : "information",
      description: 'rename old Main Channel and create a new one',
      execute(bot, game, message, args,settings) {
        message.guild.channels.cache.each(channel =>{
          if(channel.name === settings.nameMainChannel){
            channel.setName(`\[previous\]\_`+settings.nameMainChannel)
          }
        })
        message.guild.fetch().then( guild =>
          bot.emit(`guildCreate`,guild)
        )
      }
    }

  ]

}
