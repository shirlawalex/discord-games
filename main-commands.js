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
      execute(bot, game, message, args) {
        message.channel.send("Pong!");
      }
    }
    ,{
      name : 'welcome',
      description : 'Pong !',
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
