const { Discord, fs, displayText, arrayOfFile } = require(`./../../function.js`)


module.exports  =  {
  commands : [
    {
    //   name : 'lang',
    //   description : 'lang arguement : argument is the language to change',
    //   execute(bot,games,message, args) {
    //     if(args.length == 0){
    //       message.channel.send(games.lang);
    //     }
    //     else {
    //       switch(args[0]){
    //         case `en` : case `england` : case `angleterre` : case `english` : case `anglais` :
    //         bot._lang = `En`;
    //         break;
    //         case `fr` : case `france` : case `french` : case `francais` : case `français` :
    //         case `be` : case `belgique` : case `belgium` : case `belge` :
    //         default :
    //         games.lang = `Fr`
    //       }
    //       message.channel.send(`language set to ${games.lang}`);
    //     }
    //     console.log(`language set to ${games.lang}`)
    //   }
    // }
    // ,{
      name : 'ping',
      description : 'Pong !',
      execute(bot,games,message, args) {
        message.channel.send("Pong!");
      }
    }
    ,{
      name : 'rules',
      description : 'Display rules !',
      execute(bot,games,message, args) {
        message.channel.send(games.displayText("menu","welcome"));
      }
    }
  ]
}

/*
!
*/
