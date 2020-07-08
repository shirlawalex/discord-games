const { Discord, fs, displayText, arrayOfFile } = require(`./../../function.js`)


module.exports  =  {
  commands : [
    {
      name : 'lang',
      description : 'lang arguement : argument is the language to change',
      execute(bot,games,message, args) {
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
      execute(bot,games,message, args) {
        message.channel.send("Pong!");
      }
    }
  ]
}

/*
!
*/
