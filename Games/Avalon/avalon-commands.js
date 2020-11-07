const {MessageEmbed} = require("discord.js")
const {start} = require("../../util/commands.js")

module.exports  =  {
  commands : [
    {
      name : 'pingavalon',
      parent : 'avalon',
      default : "", 
      args : true,
      usage :  '<word>',
      type : "information",
      description: 'Pong !',
      execute(bot,game,message,args, settings) {
        game.send("Pong!");
        game.send(args[0]);
      }
    },
    start
  ]
}

