const { Discord, fs, displayText, arrayOfFile, displayCommands } = require(`./function.js`)

module.exports  =  {
  commands : [
    {
      name : 'lang',
      description : 'lang arguement : argument is the language to change',
      execute(bot,message, args) {
        if(args.length == 0){
          message.channel.send(bot.lang);
        }
        else {
          switch(args[0]){
            case `en` : case `england` : case `angleterre` : case `english` : case `anglais` :
            bot.lang = `En`;
            break;
            case `fr` : case `france` : case `french` : case `francais` : case `français` :
            case `be` : case `belgique` : case `belgium` : case `belge` :
            default :
            bot.lang = `Fr`
          }
          message.channel.send(`language set to ${bot.lang}`);
        }
        console.log( displayText(bot,`text`,bot.main,`welcome`,bot.lang))
      }
    }
    ,{
      name : 'ping',
      description : 'Pong !',
      execute(bot,message, args) {
        message.channel.send("Pong!");
      }
    }
    ,{
      name : 'commands',
      description : 'Display all commands loaded (You need to launch a game to have the commands)',
      execute(bot,message, args) {
        // message.channel.send(bot);
        displayCommands(bot,message);
      }
    }
    ,{
      name : 'deleteall',
      description : `Delete all channel in the Category Game Channels`,

      execute(bot,message,args) {
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
      execute(bot,message,args) {
        bot.emit(`guildCreate`,message.guild);
      }
    }
    ,{
      name : 'newmainchannel',
      description : 'rename old Main Channel and create a new one',
      execute(bot,message,args) {
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
