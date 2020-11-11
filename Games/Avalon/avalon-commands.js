const {MessageEmbed} = require("discord.js")
const {start} = require("../../util/commands.js");
const Role = require("../Class/role.js");
const Avalon = require("./avalon-main.js")

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
    ,{
      name : 'vote',
      parent : 'avalon',
      default : "", 
      args : true,
      usage :  '<@mention> [<@mention>, ...]',
      type : "cheat",
      description: 'créer un vote',
      execute(bot,game,message,args, settings) {
        const arrayUser = Array.from(message.mentions.members).map(x => x[1]);
        const content = "vote";
        const emojiArray = [`✅`,`❌`,`🏳️`,"🏴"];
        game.arrayMsg = game.vote(arrayUser,content,emojiArray);
        return arrayUser.map(x => x.id);
      }
    } 
    ,{
      name : 'tire',
      parent : 'avalon',
      default : "", 
      args : false,
      usage :  '',
      type : "test",
      description: 'tire un role au hasard',
      execute(bot,game,message,args, settings) {
        console.log("test");
        game.tire();
        game.nbtire();
        console.log("random in all",Avalon.randomRole())
        console.log("Avalon role",Avalon.listRole);
        console.log("compare",Avalon.compare(1,2));
        console.log("roles restant",game.displayLeftRole())
        console.log("random in left",game.randomLeftRole())
        game.resetRole();

      }
    },

  ]
}

